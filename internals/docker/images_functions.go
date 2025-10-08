package docker

import (
	"context"

	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/api/types/image"
)

func (d *Docker) ImagesList() ([]image.Summary, error) {
	images, err := d.cli.ImageList(context.Background(), image.ListOptions{All: true})
	if err != nil {
		return nil, &APIError{Code: 500, Message: err.Error()}
	}
	return images, nil
}

func (d *Docker) RemoveImage(ImageId string) ([]image.DeleteResponse, error) {
	images, err := d.cli.ImageRemove(context.Background(), ImageId, image.RemoveOptions{Force: false})
	if err != nil {
		return nil, &APIError{Code: 500, Message: err.Error()}
	}
	return images, nil
}

func (d *Docker) PruneImages() (image.PruneReport, error) {
	pruneFilters := filters.NewArgs()
	pruneFilters.Add("dangling", "false")
	images, err := d.cli.ImagesPrune(context.Background(), pruneFilters)
	if err != nil {
		return image.PruneReport{}, &APIError{Code: 500, Message: err.Error()}
	}
	return images, nil
}
