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

func (d *Docker) ContainerRestart(containerId string) error {
	time := 10
	err := d.cli.ContainerRestart(context.Background(), containerId, container.StopOptions{Timeout: &time, Signal: "SIGTERM"})
	if err != nil {
		return err
	}
	return nil
}
