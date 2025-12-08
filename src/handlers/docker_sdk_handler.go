package handlers

import (
	"bytes"
	"context"
	"docker-manager-go/src/dtos"
	"docker-manager-go/src/functions"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"sync"
	"time"

	"github.com/docker/docker/api/types/container"
	ctn "github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/api/types/network"
	"github.com/docker/docker/api/types/volume"
	"github.com/docker/docker/client"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type DockerSdkHandlerStruct struct {
	mutex           sync.Mutex
	appContext      context.Context
	dockerHandler   *DockerHandlerStruct
	clients         map[string]*client.Client
	contexts        map[string]context.Context
	clientCancels   map[string]context.CancelFunc
	statsCancel     map[string]map[string]context.CancelFunc
	terminalConns   map[string]net.Conn
	terminalExecIds map[string]string
}

type APIError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

func (err *APIError) Error() string {
	return fmt.Sprintf("code %d: %s", err.Code, err.Message)
}

func NewDockerSdkHandler(dockerHandler *DockerHandlerStruct) *DockerSdkHandlerStruct {
	return &DockerSdkHandlerStruct{
		dockerHandler:   dockerHandler,
		clients:         make(map[string]*client.Client),
		contexts:        make(map[string]context.Context),
		clientCancels:   make(map[string]context.CancelFunc),
		statsCancel:     make(map[string]map[string]context.CancelFunc),
		terminalConns:   make(map[string]net.Conn),
		terminalExecIds: make(map[string]string),
	}
}

func (handlerStruct *DockerSdkHandlerStruct) AddDockerClient(id int) error {
	handlerStruct.mutex.Lock()
	defer handlerStruct.mutex.Unlock()

	docker, err := handlerStruct.dockerHandler.GetDockerConnectionByIdWithoutToken(id)
	if err != nil {
		return fmt.Errorf("erro ao buscar conexão Docker: %w", err)
	}

	dockerId := fmt.Sprintf("%d", docker.ID)

	if cancel, exists := handlerStruct.clientCancels[dockerId]; exists {
		cancel()
		delete(handlerStruct.clientCancels, dockerId)
	}
	if cancelsMap, ok := handlerStruct.statsCancel[dockerId]; ok {
		for _, c := range cancelsMap {
			c()
		}
		delete(handlerStruct.statsCancel, dockerId)
	}

	if existingClient, exists := handlerStruct.clients[dockerId]; exists {
		existingClient.Close()
		delete(handlerStruct.clients, dockerId)
	}

	delete(handlerStruct.contexts, dockerId)
	delete(handlerStruct.clientCancels, dockerId)
	delete(handlerStruct.statsCancel, dockerId)

	httpClient, err := functions.BuildTLSHTTPClient(
		docker.Ca.Plaintext,
		docker.Cert.Plaintext,
		docker.Key.Plaintext,
	)
	if err != nil {
		return fmt.Errorf("erro ao montar TLS: %w", err)
	}

	cli, err := client.NewClientWithOpts(
		client.WithHost(docker.Url.Plaintext),
		client.WithHTTPClient(httpClient),
		client.WithAPIVersionNegotiation(),
	)
	if err != nil {
		return fmt.Errorf("erro ao criar cliente Docker: %w", err)
	}

	baseContext := handlerStruct.appContext
	if baseContext == nil {
		baseContext = context.Background()
	}

	ctx, cancel := context.WithCancel(baseContext)

	handlerStruct.clients[dockerId] = cli
	handlerStruct.contexts[dockerId] = ctx
	handlerStruct.clientCancels[dockerId] = cancel
	handlerStruct.statsCancel[dockerId] = make(map[string]context.CancelFunc)

	return nil
}

func (handlerStruct *DockerSdkHandlerStruct) CatchClient(clientId int) (*client.Client, context.Context, error) {
	id := fmt.Sprintf("%d", clientId)

	handlerStruct.mutex.Lock()
	defer handlerStruct.mutex.Unlock()

	cli, exists := handlerStruct.clients[id]
	ctx, ctxExists := handlerStruct.contexts[id]

	if !exists || !ctxExists {
		return nil, nil, &APIError{
			Code:    404,
			Message: fmt.Sprintf("cliente %d não encontrado", clientId),
		}
	}

	return cli, ctx, nil
}

func (handlerStruct *DockerSdkHandlerStruct) ConnectDocker(id int) error {
	return handlerStruct.AddDockerClient(id)
}

func (handlerStruct *DockerSdkHandlerStruct) Startup(ctx context.Context) {
	handlerStruct.mutex.Lock()
	defer handlerStruct.mutex.Unlock()

	handlerStruct.appContext = ctx

	for id := range handlerStruct.clients {
		handlerStruct.contexts[id] = ctx
	}
}

// ################## Images ##################################################################

func (handlerStruct *DockerSdkHandlerStruct) ImagesList(clientId int) ([]image.Summary, error) {
	cli, ctx, err := handlerStruct.CatchClient(clientId)
	if err != nil {
		return nil, err
	}

	images, err := cli.ImageList(ctx, image.ListOptions{All: true})
	if err != nil {
		return nil, &APIError{Code: 500, Message: err.Error()}
	}

	return images, nil
}

func (handlerStruct *DockerSdkHandlerStruct) RemoveImage(clientId int, imageId string) ([]image.DeleteResponse, error) {
	cli, ctx, err := handlerStruct.CatchClient(clientId)
	if err != nil {
		return nil, err
	}

	removed, err := cli.ImageRemove(ctx, imageId, image.RemoveOptions{Force: false})
	if err != nil {
		return nil, &APIError{Code: 500, Message: err.Error()}
	}

	return removed, nil
}

func (handlerStruct *DockerSdkHandlerStruct) PruneImages(clientId int) (image.PruneReport, error) {
	cli, ctx, err := handlerStruct.CatchClient(clientId)
	if err != nil {
		return image.PruneReport{}, err
	}

	pruneFilters := filters.NewArgs()
	pruneFilters.Add("dangling", "false")

	report, err := cli.ImagesPrune(ctx, pruneFilters)
	if err != nil {
		return image.PruneReport{}, &APIError{Code: 500, Message: err.Error()}
	}

	return report, nil
}

func (handlerStruct *DockerSdkHandlerStruct) InspectImage(clientId int, imageId string) (string, error) {
	cli, ctx, err := handlerStruct.CatchClient(clientId)
	if err != nil {
		return "", err
	}

	var raw bytes.Buffer

	_, err = cli.ImageInspect(
		ctx,
		imageId,
		client.ImageInspectWithRawResponse(&raw),
	)
	if err != nil {
		return "bytes.Buffer{}", err
	}

	var pretty bytes.Buffer
	err = json.Indent(&pretty, raw.Bytes(), "", "  ")
	if err != nil {
		return "", err
	}

	return pretty.String(), nil
}

// #################### Stats ################################################################

func (handlerStruct *DockerSdkHandlerStruct) StartContainerStats(clientId int, containerID string) error {
	dockerId := fmt.Sprintf("%d", clientId)

	cli, baseCtx, err := handlerStruct.CatchClient(clientId)
	if err != nil {
		return err
	}

	handlerStruct.mutex.Lock()

	if handlerStruct.statsCancel[dockerId] == nil {
		handlerStruct.statsCancel[dockerId] = make(map[string]context.CancelFunc)
	}

	if oldCancel, ok := handlerStruct.statsCancel[dockerId][containerID]; ok {
		oldCancel()
	}

	ctx, cancel := context.WithCancel(baseCtx)
	handlerStruct.statsCancel[dockerId][containerID] = cancel

	appCtx := handlerStruct.contexts[dockerId]

	handlerStruct.mutex.Unlock()

	go handlerStruct.StreamStats(cli, ctx, containerID, appCtx)

	return nil
}

func (handlerStruct *DockerSdkHandlerStruct) StreamStats(dockerClient *client.Client, ctx context.Context, containerID string, appContext context.Context) {
	stats, err := dockerClient.ContainerStats(ctx, containerID, true)
	if err != nil {
		runtime.EventsEmit(appContext, "container:stats:error", map[string]string{
			"containerId": containerID,
			"error":       err.Error(),
		})
		return
	}
	defer stats.Body.Close()

	decoder := json.NewDecoder(stats.Body)

	for {
		select {
		case <-ctx.Done():
			return
		default:
			var body ctn.StatsResponse
			if err := decoder.Decode(&body); err != nil {
				if err == io.EOF || ctx.Err() != nil {
					return
				}
				runtime.EventsEmit(appContext, "container:stats:error", map[string]string{
					"containerId": containerID,
					"error":       err.Error(),
				})
				return
			}

			payload := dtos.StatsPayloadDto{
				ContainerID:      containerID,
				OSType:           "",
				CPUPercentage:    cpuPercent(&body),
				MemoryPercentage: memPercent(&body),
				MemoryUsage:      memUsage(&body),
				MemoryLimit:      body.MemoryStats.Limit,
				RxBytes:          sumRx(&body),
				TxBytes:          sumTx(&body),
				Pids:             body.PidsStats.Current,
				Time:             time.Now().UnixMilli(),
			}

			runtime.EventsEmit(appContext, "container:stats", payload)
		}
	}
}

func (handlerStruct *DockerSdkHandlerStruct) StopContainerStats(clientId int, containerID string) error {
	dockerId := fmt.Sprintf("%d", clientId)

	handlerStruct.mutex.Lock()
	defer handlerStruct.mutex.Unlock()

	cancelsMap := handlerStruct.statsCancel[dockerId]
	if cancelsMap == nil {
		return nil
	}

	if cancel, ok := cancelsMap[containerID]; ok {
		cancel()
		delete(cancelsMap, containerID)

		runtime.EventsEmit(handlerStruct.contexts[dockerId], "container:stats:stopped", map[string]string{
			"containerId": containerID,
		})
	}

	return nil
}

func cpuPercent(body *ctn.StatsResponse) float64 {
	cpuDelta := float64(body.CPUStats.CPUUsage.TotalUsage - body.PreCPUStats.CPUUsage.TotalUsage)
	sysDelta := float64(body.CPUStats.SystemUsage - body.PreCPUStats.SystemUsage)
	if cpuDelta <= 0 || sysDelta <= 0 {
		return 0
	}

	numberOfCpus := float64(body.CPUStats.OnlineCPUs)
	if numberOfCpus == 0 {
		numberOfCpus = float64(len(body.CPUStats.CPUUsage.PercpuUsage))
		if numberOfCpus == 0 {
			numberOfCpus = 1
		}
	}

	return (cpuDelta / sysDelta) * numberOfCpus * 100.0
}

func memUsage(body *ctn.StatsResponse) uint64 {
	if body.MemoryStats.Stats != nil {
		if cache, ok := body.MemoryStats.Stats["cache"]; ok && body.MemoryStats.Usage >= cache {
			return body.MemoryStats.Usage - cache
		}
	}
	return body.MemoryStats.Usage
}

func memPercent(body *ctn.StatsResponse) float64 {
	usage := float64(memUsage(body))
	limit := float64(body.MemoryStats.Limit)
	if limit == 0 {
		return 0
	}
	return (usage / limit) * 100.0
}

func sumRx(body *ctn.StatsResponse) uint64 {
	var total uint64
	for _, network := range body.Networks {
		total += network.RxBytes
	}
	return total
}

func sumTx(body *ctn.StatsResponse) uint64 {
	var total uint64
	for _, network := range body.Networks {
		total += network.TxBytes
	}
	return total
}

// ############################## Containers #########################################################

func (handlerStruct *DockerSdkHandlerStruct) ContainerStart(clientId int, containerId string) error {
	cli, ctx, err := handlerStruct.CatchClient(clientId)
	if err != nil {
		return err
	}

	if err := cli.ContainerStart(ctx, containerId, container.StartOptions{}); err != nil {
		return &APIError{Code: 500, Message: err.Error()}
	}

	return nil
}

func (handlerStruct *DockerSdkHandlerStruct) ContainerStop(clientId int, containerId string) error {
	cli, ctx, err := handlerStruct.CatchClient(clientId)
	if err != nil {
		return err
	}

	if err := cli.ContainerStop(ctx, containerId, container.StopOptions{}); err != nil {
		return &APIError{Code: 500, Message: err.Error()}
	}

	return nil
}

func (handlerStruct *DockerSdkHandlerStruct) ContainerPause(clientId int, containerId string) error {
	cli, ctx, err := handlerStruct.CatchClient(clientId)
	if err != nil {
		return err
	}

	if err := cli.ContainerPause(ctx, containerId); err != nil {
		return &APIError{Code: 500, Message: err.Error()}
	}

	return nil
}

func (handlerStruct *DockerSdkHandlerStruct) ContainerUnPause(clientId int, containerId string) error {
	cli, ctx, err := handlerStruct.CatchClient(clientId)
	if err != nil {
		return err
	}

	if err := cli.ContainerUnpause(ctx, containerId); err != nil {
		return &APIError{Code: 500, Message: err.Error()}
	}

	return nil
}

func (handlerStruct *DockerSdkHandlerStruct) ContainerRename(clientId int, containerId, newName string) error {
	cli, ctx, err := handlerStruct.CatchClient(clientId)
	if err != nil {
		return err
	}

	if err := cli.ContainerRename(ctx, containerId, newName); err != nil {
		return &APIError{Code: 500, Message: err.Error()}
	}

	return nil
}

func (handlerStruct *DockerSdkHandlerStruct) ContainerLogs(clientId int, containerId string) (string, error) {
	cli, ctx, err := handlerStruct.CatchClient(clientId)
	if err != nil {
		return "", err
	}

	logs, err := cli.ContainerLogs(ctx, containerId, ctn.LogsOptions{
		ShowStdout: true,
		ShowStderr: true,
		Follow:     false,
		Tail:       "2000",
	})
	if err != nil {
		return "", &APIError{Code: 500, Message: err.Error()}
	}
	defer logs.Close()

	return functions.LogsTreatment(logs), nil
}

func (handlerStruct *DockerSdkHandlerStruct) ContainersList(clientId int) ([]ctn.Summary, error) {
	cli, ctx, err := handlerStruct.CatchClient(clientId)
	if err != nil {
		return nil, err
	}

	containers, err := cli.ContainerList(ctx, ctn.ListOptions{All: true})
	if err != nil {
		return nil, &APIError{Code: 500, Message: err.Error()}
	}

	return containers, nil
}

func (handlerStruct *DockerSdkHandlerStruct) ContainerRemove(clientId int, containerId string) error {
	cli, ctx, err := handlerStruct.CatchClient(clientId)
	if err != nil {
		return err
	}

	if err := cli.ContainerRemove(ctx, containerId, ctn.RemoveOptions{
		Force:         true,
		RemoveVolumes: true,
	}); err != nil {
		return &APIError{Code: 500, Message: err.Error()}
	}

	return nil
}

func (handlerStruct *DockerSdkHandlerStruct) ContainerInspect(clientId int, containerId string) (string, error) {
	cli, ctx, err := handlerStruct.CatchClient(clientId)
	if err != nil {
		return "", err
	}

	inspect, err := cli.ContainerInspect(ctx, containerId)
	if err != nil {
		return "", err
	}

	bytesArray, err := json.MarshalIndent(inspect, "", "  ")
	if err != nil {
		return "", err
	}

	return string(bytesArray), nil
}

func (handlerStruct *DockerSdkHandlerStruct) ContainerRestart(clientId int, containerId string) error {
	timeoutSec := 10

	cli, ctx, err := handlerStruct.CatchClient(clientId)
	if err != nil {
		return err
	}

	if err := cli.ContainerRestart(ctx, containerId, ctn.StopOptions{
		Timeout: &timeoutSec,
		Signal:  "SIGTERM",
	}); err != nil {
		return &APIError{Code: 500, Message: err.Error()}
	}

	return nil
}

// #####################################################################################################################
// #########################################Network#####################################################################
func (handlerStruct *DockerSdkHandlerStruct) ListNetworks(clientId int) (string, error) {
	cli, ctx, err := handlerStruct.CatchClient(clientId)
	if err != nil {
		return "", err
	}
	networksList, err := cli.NetworkList(ctx, network.ListOptions{})
	if err != nil {
		return "", err
	}

	bytesArray, err := json.MarshalIndent(networksList, "", "  ")
	if err != nil {
		return "", err
	}

	return string(bytesArray), nil
}

func (handlerStruct *DockerSdkHandlerStruct) InspectNetwork(clientId int, newtworkId string) (string, error) {
	cli, ctx, err := handlerStruct.CatchClient(clientId)
	if err != nil {
		return "", err
	}
	inspect, err := cli.NetworkInspect(ctx, newtworkId, network.InspectOptions{Verbose: true})
	if err != nil {
		return "", err
	}
	bytesArray, err := json.MarshalIndent(inspect, "", "  ")
	if err != nil {
		return "", err
	}

	return string(bytesArray), nil
}
func (handlerStruct *DockerSdkHandlerStruct) DeleteNetwork(clientId int, newtworkId string) error {
	cli, ctx, err := handlerStruct.CatchClient(clientId)
	if err != nil {
		return err
	}
	err = cli.NetworkRemove(ctx, newtworkId)
	if err != nil {
		return err
	}

	return nil
}

func (handlerStruct *DockerSdkHandlerStruct) PruneNetworks(clientId int) (string, error) {
	cli, ctx, err := handlerStruct.CatchClient(clientId)
	if err != nil {
		return "", err
	}
	report, err := cli.NetworksPrune(ctx, filters.Args{})
	if err != nil {
		return "", err
	}

	bytesArray, err := json.MarshalIndent(report, "", "  ")
	if err != nil {
		return "", err
	}

	return string(bytesArray), nil
}

func (handlerStruct *DockerSdkHandlerStruct) CreateNetwork(clientId int, name string, options network.CreateOptions) (string, error) {
	cli, ctx, err := handlerStruct.CatchClient(clientId)
	if err != nil {
		return "", err
	}
	report, err := cli.NetworkCreate(ctx, name, options)
	if err != nil {
		return "", err
	}

	bytesArray, err := json.MarshalIndent(report, "", "  ")
	if err != nil {
		return "", err
	}

	return string(bytesArray), nil
}

// #####################################################################################################################
// #########################################Volume#####################################################################
func (handlerStruct *DockerSdkHandlerStruct) ListVolumes(clientId int) (string, error) {
	cli, ctx, err := handlerStruct.CatchClient(clientId)
	if err != nil {
		return "", err
	}
	volumesList, err := cli.VolumeList(ctx, volume.ListOptions{})
	if err != nil {
		return "", err
	}

	bytesArray, err := json.MarshalIndent(volumesList, "", "  ")
	if err != nil {
		return "", err
	}

	return string(bytesArray), nil
}

func (handlerStruct *DockerSdkHandlerStruct) DeleteVolume(clientId int, volumeId string) error {
	cli, ctx, err := handlerStruct.CatchClient(clientId)
	if err != nil {
		return err
	}

	err = cli.VolumeRemove(ctx, volumeId, true)
	if err != nil {
		return err
	}
	return nil
}

func (handlerStruct *DockerSdkHandlerStruct) CreateVolume(clientId int, options volume.CreateOptions) (string, error) {
	cli, ctx, err := handlerStruct.CatchClient(clientId)
	if err != nil {
		return "", err
	}
	volume, err := cli.VolumeCreate(ctx, options)

	if err != nil {
		return "", err
	}
	bytesarray, err := json.MarshalIndent(volume, "", "  ")
	if err != nil {
		return "", err
	}
	return string(bytesarray), nil

}

func (handlerStruct *DockerSdkHandlerStruct) InspectVolume(clientId int, volumeId string) (string, error) {
	cli, ctx, err := handlerStruct.CatchClient(clientId)
	if err != nil {
		return "", err
	}
	volumeInspect, err := cli.VolumeInspect(ctx, volumeId)
	if err != nil {
		return "", err
	}

	bytesArray, err := json.MarshalIndent(volumeInspect, "", "  ")
	if err != nil {
		return "", err
	}
	return string(bytesArray), nil
}

// #########################################Exec#####################################################################
func (handlerStruct *DockerSdkHandlerStruct) ContainerExec(clientId int, containerId string) (string, error) {
	cli, ctx, err := handlerStruct.CatchClient(clientId)
	if err != nil {
		return "", err
	}

	execConfig := ctn.ExecOptions{
		AttachStdin:  true,
		AttachStdout: true,
		AttachStderr: true,
		Tty:          true,
		Env:          []string{"TERM=xterm"},
		Cmd:          []string{"/bin/sh", "-c", "[ -x /bin/bash ] && exec /bin/bash || exec /bin/sh"},
	}

	execID, err := cli.ContainerExecCreate(ctx, containerId, execConfig)
	if err != nil {
		return "", &APIError{Code: 500, Message: fmt.Sprintf("Erro ao criar exec: %v", err)}
	}

	attachConfig := ctn.ExecStartOptions{
		Detach: false,
		Tty:    true,
	}

	resp, err := cli.ContainerExecAttach(ctx, execID.ID, attachConfig)
	if err != nil {
		return "", &APIError{Code: 500, Message: fmt.Sprintf("Erro ao conectar exec: %v", err)}
	}

	handlerStruct.mutex.Lock()
	handlerStruct.terminalConns[containerId] = resp.Conn
	handlerStruct.terminalExecIds[containerId] = execID.ID
	handlerStruct.mutex.Unlock()

	go func() {
		defer resp.Conn.Close()
		buf := make([]byte, 1024)
		for {
			n, err := resp.Conn.Read(buf)
			if err != nil {
				if err != io.EOF {
					fmt.Printf("Erro ao ler terminal: %v\n", err)
				}
				break
			}
			if n > 0 {
				runtime.EventsEmit(handlerStruct.appContext, "terminal:data:"+containerId, string(buf[:n]))
			}
		}
		handlerStruct.mutex.Lock()
		delete(handlerStruct.terminalConns, containerId)
		delete(handlerStruct.terminalExecIds, containerId)
		handlerStruct.mutex.Unlock()
		runtime.EventsEmit(handlerStruct.appContext, "terminal:closed:"+containerId, true)
	}()

	return "Connected", nil
}

func (handlerStruct *DockerSdkHandlerStruct) TerminalWrite(containerId string, data string) error {
	handlerStruct.mutex.Lock()
	conn, ok := handlerStruct.terminalConns[containerId]
	handlerStruct.mutex.Unlock()

	if !ok {
		return fmt.Errorf("conexão terminal não encontrada para container %s", containerId)
	}

	_, err := conn.Write([]byte(data))
	if err != nil {
		return fmt.Errorf("erro ao escrever terminal: %w", err)
	}
	return nil
}

func (handlerStruct *DockerSdkHandlerStruct) TerminalResize(clientId int, containerId string, cols, rows int) error {
	handlerStruct.mutex.Lock()
	execID, ok := handlerStruct.terminalExecIds[containerId]
	handlerStruct.mutex.Unlock()

	if !ok {
		return fmt.Errorf("exec ID não encontrado para container %s", containerId)
	}

	cli, ctx, err := handlerStruct.CatchClient(clientId)
	if err != nil {
		return err
	}

	resizeOptions := ctn.ResizeOptions{
		Height: uint(rows),
		Width:  uint(cols),
	}

	err = cli.ContainerExecResize(ctx, execID, resizeOptions)
	if err != nil {
		return &APIError{Code: 500, Message: fmt.Sprintf("Erro ao redimensionar terminal: %v", err)}
	}

	return nil
}
