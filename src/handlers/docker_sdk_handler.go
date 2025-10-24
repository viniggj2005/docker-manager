package handlers

import (
	"bytes"
	"context"
	"docker-manager-go/src/dtos"
	"docker-manager-go/src/functions"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"sync"
	"time"

	"github.com/docker/docker/api/types/container"
	ctn "github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/client"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type DockerSdkHandlerStruct struct {
	commandLineInterface *client.Client
	context              context.Context
	statsCancel          map[string]context.CancelFunc
	mutex                sync.Mutex
}

type APIError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

func (err *APIError) Error() string {
	return fmt.Sprintf("code %d: %s", err.Code, err.Message)
}

func NewDockerSdkHandler() *DockerSdkHandlerStruct {
	commandLineInterface, err := client.NewClientWithOpts(
		client.WithHost("tcp://18.229.133.72:2376"),
		client.WithTLSClientConfig(
			"/home/vinicius-gabriel-graupmann-juras/Desktop/dockerapi/ca.pem",
			"/home/vinicius-gabriel-graupmann-juras/Desktop/dockerapi/cert.pem",
			"/home/vinicius-gabriel-graupmann-juras/Desktop/dockerapi/key-nopass.pem",
		),
		client.WithAPIVersionNegotiation(),
	)
	if err != nil {
		log.Fatalf("Erro criando Docker client: %v", err)
	}

	return &DockerSdkHandlerStruct{
		context:              context.Background(),
		commandLineInterface: commandLineInterface,
		statsCancel:          make(map[string]context.CancelFunc),
	}
}

func (handlerStruct *DockerSdkHandlerStruct) Startup(context context.Context) {
	handlerStruct.context = context
}

// ##################Images##################################################################
func (handlerStruct *DockerSdkHandlerStruct) ImagesList() ([]image.Summary, error) {
	images, err := handlerStruct.commandLineInterface.ImageList(context.Background(), image.ListOptions{All: true})
	if err != nil {
		return nil, &APIError{Code: 500, Message: err.Error()}
	}
	return images, nil
}

func (handlerStruct *DockerSdkHandlerStruct) RemoveImage(ImageId string) ([]image.DeleteResponse, error) {
	images, err := handlerStruct.commandLineInterface.ImageRemove(context.Background(), ImageId, image.RemoveOptions{Force: false})
	if err != nil {
		return nil, &APIError{Code: 500, Message: err.Error()}
	}
	return images, nil
}

func (handlerStruct *DockerSdkHandlerStruct) PruneImages() (image.PruneReport, error) {
	pruneFilters := filters.NewArgs()
	pruneFilters.Add("dangling", "false")
	images, err := handlerStruct.commandLineInterface.ImagesPrune(context.Background(), pruneFilters)
	if err != nil {
		return image.PruneReport{}, &APIError{Code: 500, Message: err.Error()}
	}
	return images, nil
}

func (handlerStruct *DockerSdkHandlerStruct) InspectImage(imageId string) (string, error) {
	var raw bytes.Buffer

	_, err := handlerStruct.commandLineInterface.ImageInspect(
		context.Background(),
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

//#########################################################################################################

// ####################Stats##############################################################################
func (handlerStruct *DockerSdkHandlerStruct) StartContainerStats(containerID string) {
	handlerStruct.mutex.Lock()
	if handlerStruct.statsCancel == nil {
		handlerStruct.statsCancel = make(map[string]context.CancelFunc)
	}
	if container, ok := handlerStruct.statsCancel[containerID]; ok {
		container()
	}
	context, cancel := context.WithCancel(handlerStruct.context)
	handlerStruct.statsCancel[containerID] = cancel
	handlerStruct.mutex.Unlock()

	go handlerStruct.StreamStats(context, containerID)
}

func (handlerStruct *DockerSdkHandlerStruct) StreamStats(context context.Context, containerID string) {
	response, err := handlerStruct.commandLineInterface.ContainerStats(context, containerID, true)
	if err != nil {
		runtime.EventsEmit(handlerStruct.context, "container:stats:error", map[string]string{
			"containerId": containerID, "error": err.Error(),
		})
		return
	}
	defer response.Body.Close()

	decoded := json.NewDecoder(response.Body)
	for {
		select {
		case <-context.Done():
			return
		default:
			var body ctn.StatsResponse
			if err := decoded.Decode(&body); err != nil {
				if err == io.EOF || context.Err() != nil {
					return
				}
				runtime.EventsEmit(handlerStruct.context, "container:stats:error", map[string]string{
					"containerId": containerID, "error": err.Error(),
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
			runtime.EventsEmit(handlerStruct.context, "container:stats", payload)
		}
	}
}

func (handlerStruct *DockerSdkHandlerStruct) StopContainerStats(containerID string) {
	handlerStruct.mutex.Lock()
	defer handlerStruct.mutex.Unlock()

	if handlerStruct.statsCancel == nil {
		return
	}
	if cancel, ok := handlerStruct.statsCancel[containerID]; ok {
		cancel()
		delete(handlerStruct.statsCancel, containerID)
		runtime.EventsEmit(handlerStruct.context, "container:stats:stopped", map[string]string{
			"containerId": containerID,
		})
	}
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

// #################################################################################################
// ##############################Containers#########################################################
func (handlerStruct *DockerSdkHandlerStruct) ContainerPause(containerId string) {
	err := handlerStruct.commandLineInterface.ContainerPause(context.Background(), containerId)
	if err != nil {
		fmt.Println(err)
	}
}
func (handlerStruct *DockerSdkHandlerStruct) ContainerUnPause(containerId string) {
	err := handlerStruct.commandLineInterface.ContainerUnpause(context.Background(), containerId)
	if err != nil {
		fmt.Println(err)
	}
}
func (handlerStruct *DockerSdkHandlerStruct) ContainerRename(containerId, newName string) error {
	err := handlerStruct.commandLineInterface.ContainerRename(context.Background(), containerId, newName)
	if err == nil {
	}
	return &APIError{Code: 500, Message: err.Error()}
}

func (handlerStruct *DockerSdkHandlerStruct) ContainerLogs(containerId string) (string, error) {
	logs, err := handlerStruct.commandLineInterface.ContainerLogs(context.Background(), containerId, container.LogsOptions{
		ShowStdout: true,
		ShowStderr: true,
		Follow:     false,
	})
	if err != nil {
		return "", &APIError{Code: 500, Message: err.Error()}
	}
	defer logs.Close()

	return functions.LogsTreatment(logs), nil
}

func (handlerStruct *DockerSdkHandlerStruct) ContainersList() ([]container.Summary, error) {
	containers, err := handlerStruct.commandLineInterface.ContainerList(context.Background(), container.ListOptions{All: true})
	if err != nil {
		return nil, &APIError{Code: 500, Message: err.Error()}
	}
	return containers, nil
}

func (handlerStruct *DockerSdkHandlerStruct) ContainerRemove(containerId string) error {
	err := handlerStruct.commandLineInterface.ContainerRemove(context.Background(), containerId, container.RemoveOptions{Force: true, RemoveVolumes: true})
	if err != nil {
		return &APIError{Code: 500, Message: err.Error()}
	}
	return nil
}

func (handlerStruct *DockerSdkHandlerStruct) ContainerInspect(containerId string) (string, error) {
	inspect, err := handlerStruct.commandLineInterface.ContainerInspect(context.Background(), containerId)
	if err != nil {
		return "", err
	}

	bytesArray, err := json.MarshalIndent(inspect, "", "  ")
	if err != nil {
		return "", err
	}

	return string(bytesArray), nil
}

func (handlerStruct *DockerSdkHandlerStruct) ContainerRestart(containerId string) error {
	time := 10
	err := handlerStruct.commandLineInterface.ContainerRestart(context.Background(), containerId, container.StopOptions{Timeout: &time, Signal: "SIGTERM"})
	if err != nil {
		return err
	}
	return nil
}

//###########################################################################################################
