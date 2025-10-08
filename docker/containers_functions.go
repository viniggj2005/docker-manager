package docker

import (
	"context"
	"docker-manager-go/functions"
	"fmt"

	"github.com/docker/docker/api/types/container"
)

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

	return functions.LogsTreatment(logs)
}

func (d *Docker) ContainersList() []container.Summary {
	containers, err := d.cli.ContainerList(context.Background(), container.ListOptions{All: true})
	if err != nil {
		panic(err)
	}
	return containers
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
