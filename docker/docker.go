package docker

import (
	"context"
	"io"
	"log"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
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

func (d *Docker) ContainerLogs(containerId string) string {
	logs, err := d.cli.ContainerLogs(context.Background(), containerId, container.LogsOptions{ShowStdout: true,
		ShowStderr: true,
		Follow:     false,
		Timestamps: false,
		Details:    false})
	if err != nil {
		panic(err)
	}
	defer logs.Close()

	buf, err := io.ReadAll(logs)
	if err != nil {
		panic(err)
	}
	return string(buf)
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
