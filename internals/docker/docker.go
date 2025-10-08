package docker

import (
	"context"
	"fmt"
	"log"

	"github.com/docker/docker/client"
)

type Docker struct {
	cli *client.Client
	ctx context.Context
}
type APIError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

func (e *APIError) Error() string {
	return fmt.Sprintf("code %d: %s", e.Code, e.Message)
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
