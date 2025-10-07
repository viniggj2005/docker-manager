package docker

import (
	"context"
	"docker-manager-go/functions"
	"fmt"

	"github.com/docker/docker/api/types/container"
)

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

	return functions.LogsTreatment(logs)
}
