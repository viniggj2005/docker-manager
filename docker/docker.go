package docker

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"log"
	"regexp"
	"strconv"
	"strings"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/docker/docker/pkg/stdcopy"
)

type Docker struct {
	ctx context.Context
	cli *client.Client
}

func NewDocker() *Docker {
	cli, err := client.NewClientWithOpts(
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

	return &Docker{
		ctx: context.Background(),
		cli: cli,
	}
}

func (d *Docker) Startup(ctx context.Context) {
	if d.ctx == nil {
		d.ctx = ctx
	}
}

func (d *Docker) ContainersList() []container.Summary {
	containers, err := d.cli.ContainerList(context.Background(), container.ListOptions{All: true})
	if err != nil {
		panic(err)
	}

	return containers
}

func (d *Docker) ContainerPause(containerId string) {
	err := d.cli.ContainerPause(context.Background(), containerId)
	if err != nil {
		fmt.Println(err)
	}
}
func (d *Docker) ContainerUnPause(containerId string) {
	err := d.cli.ContainerUnpause(context.Background(), containerId)
	if err != nil {
		fmt.Println(err)
	}
}
func (d *Docker) ContainerRename(containerId, newName string) {
	err := d.cli.ContainerRename(context.Background(), containerId, newName)
	if err != nil {
		fmt.Println(err)
	}
}

func (d *Docker) ContainerLogs(containerId string) string {
	logs, err := d.cli.ContainerLogs(context.Background(), containerId, container.LogsOptions{
		ShowStdout: true,
		ShowStderr: true,
		Follow:     false,
	})
	if err != nil {
		panic(err)
	}
	defer logs.Close()

	raw, _ := io.ReadAll(logs)
	isMux := len(raw) >= 8 && (raw[0] == 0 || raw[0] == 1 || raw[0] == 2) && raw[1] == 0 && raw[2] == 0 && raw[3] == 0

	var out string
	if isMux {
		var stdout, stderr bytes.Buffer
		_, _ = stdcopy.StdCopy(&stdout, &stderr, bytes.NewReader(raw))
		out = stdout.String() + stderr.String()
	} else {
		out = string(raw)
	}

	reANSI := regexp.MustCompile(`\x1B\[[0-9;]*[A-Za-z]`)
	out = reANSI.ReplaceAllString(out, "")

	reMethod := regexp.MustCompile(`\b(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b`)
	reStatus := regexp.MustCompile(`\b([1-5][0-9]{2})\b`)
	reIP := regexp.MustCompile(`\b\d{1,3}(?:\.\d{1,3}){3}\b`)
	reTs := regexp.MustCompile(`\b(?:\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?|\d{1,2}/\d{1,2}/\d{2,4}\s+\d{1,2}:\d{2}:\d{2}(?:\s?[AP]M)?)\b`)

	out = reMethod.ReplaceAllStringFunc(out, func(m string) string {
		switch m {
		case "GET":
			return `<span class="text-emerald-400">GET</span>`
		case "POST":
			return `<span class="text-cyan-400">POST</span>`
		case "PUT":
			return `<span class="text-amber-300">PUT</span>`
		case "PATCH":
			return `<span class="text-yellow-300">PATCH</span>`
		case "DELETE":
			return `<span class="text-rose-400 ">DELETE</span>`
		default:
			return m
		}
	})

	out = reStatus.ReplaceAllStringFunc(out, func(m string) string {
		code, _ := strconv.Atoi(m)
		switch {
		case code >= 500:
			return `<span class="text-red-500 font-semibold">` + m + `</span>`
		case code >= 400:
			return `<span class="text-rose-400 font-semibold">` + m + `</span>`
		case code >= 300:
			return `<span class="text-amber-300 ">` + m + `</span>`
		case code >= 200:
			return `<span class="text-emerald-400 ">` + m + `</span>`
		default:
			return m
		}
	})

	out = reIP.ReplaceAllString(out, `<span class="text-emerald-300">$0</span>`)
	out = reTs.ReplaceAllString(out, `<span class="text-sky-400">$0</span>`)
	out = strings.ReplaceAll(out, "\n", "<br>")

	return out
}

// func (a *App) StreamLogs(containerID string) error {
// 	reader, err := a.cli.ContainerLogs(
// 		context.Background(),
// 		containerID,
// 		container.LogsOptions{
// 			ShowStdout: true,
// 			ShowStderr: true,
// 			Follow:     true,
// 			Timestamps: false,
// 		},
// 	)
// 	if err != nil {
// 		return err
// 	}
// 	defer reader.Close()

// 	scanner := bufio.NewScanner(reader)
// 	for scanner.Scan() {
// 		line := scanner.Text()
// 		runtime.EventsEmit(a.Ctx, "container-log", line)
// 	}
// 	return scanner.Err()
// }
//#####################################################
// no frontend
// import { EventsOn } from "../wailsjs/runtime";

// useEffect(() => {
//   EventsOn("container-log", (msg: string) => {
//     console.log(msg);
//     // ou atualizar um state:
//     setLogs(prev => prev + "\n" + msg);
//   });
// }, []);
