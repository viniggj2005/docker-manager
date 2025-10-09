package docker

import (
	"context"
	"docker-manager-go/internals/functions"
	"encoding/json"

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
func (d *Docker) ContainerRename(containerId, newName string) error {
	err := d.cli.ContainerRename(context.Background(), containerId, newName)
	if err == nil {
	}
	return &APIError{Code: 500, Message: err.Error()}
}

func (d *Docker) ContainerLogs(containerId string) (string, error) {
	logs, err := d.cli.ContainerLogs(context.Background(), containerId, container.LogsOptions{
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

func (d *Docker) ContainersList() ([]container.Summary, error) {
	containers, err := d.cli.ContainerList(context.Background(), container.ListOptions{All: true})
	if err != nil {
		return nil, &APIError{Code: 500, Message: err.Error()}
	}
	return containers, nil
}

func (d *Docker) ContainerRemove(containerId string) error {
	err := d.cli.ContainerRemove(context.Background(), containerId, container.RemoveOptions{Force: true, RemoveVolumes: true})
	if err != nil {
		return &APIError{Code: 500, Message: err.Error()}
	}
	return nil
}

func (d *Docker) ContainerInspect(containerId string) (string, error) {
	inspect, err := d.cli.ContainerInspect(context.Background(), containerId)
	if err != nil {
		return "", err
	}

	b, err := json.MarshalIndent(inspect, "", "  ")
	if err != nil {
		return "", err
	}

	return string(b), nil
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
