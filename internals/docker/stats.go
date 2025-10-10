package docker

import (
	"context"
	"encoding/json"
	"io"
	"time"

	ctn "github.com/docker/docker/api/types/container"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type StatsPayload struct {
	ContainerID string  `json:"containerId"`
	OSType      string  `json:"osType"`
	CPUPercent  float64 `json:"cpuPercent"`
	MemPercent  float64 `json:"memPercent"`
	MemUsage    uint64  `json:"memUsage"`
	MemLimit    uint64  `json:"memLimit"`
	RxBytes     uint64  `json:"rxBytes"`
	TxBytes     uint64  `json:"txBytes"`
	Pids        uint64  `json:"pids"`
	Time        int64   `json:"time"`
}

func (d *Docker) StartContainerStats(containerID string) {
	d.mu.Lock()
	if d.statsCancel == nil {
		d.statsCancel = make(map[string]context.CancelFunc)
	}
	if c, ok := d.statsCancel[containerID]; ok {
		c()
	}
	ctx, cancel := context.WithCancel(d.ctx)
	d.statsCancel[containerID] = cancel
	d.mu.Unlock()

	go d.StreamStats(ctx, containerID)
}

func (d *Docker) StreamStats(ctx context.Context, containerID string) {
	resp, err := d.cli.ContainerStats(ctx, containerID, true)
	if err != nil {
		runtime.EventsEmit(d.ctx, "container:stats:error", map[string]string{
			"containerId": containerID, "error": err.Error(),
		})
		return
	}
	defer resp.Body.Close()

	dec := json.NewDecoder(resp.Body)
	for {
		select {
		case <-ctx.Done():
			return
		default:
			var v ctn.StatsResponse
			if err := dec.Decode(&v); err != nil {
				if err == io.EOF || ctx.Err() != nil {
					return
				}
				runtime.EventsEmit(d.ctx, "container:stats:error", map[string]string{
					"containerId": containerID, "error": err.Error(),
				})
				return
			}

			payload := StatsPayload{
				ContainerID: containerID,
				OSType:      "",
				CPUPercent:  cpuPercent(&v),
				MemPercent:  memPercent(&v),
				MemUsage:    memUsage(&v),
				MemLimit:    v.MemoryStats.Limit,
				RxBytes:     sumRx(&v),
				TxBytes:     sumTx(&v),
				Pids:        v.PidsStats.Current,
				Time:        time.Now().UnixMilli(),
			}
			runtime.EventsEmit(d.ctx, "container:stats", payload)
		}
	}
}

func (d *Docker) StopContainerStats(containerID string) {
	d.mu.Lock()
	defer d.mu.Unlock()

	if d.statsCancel == nil {
		return
	}
	if cancel, ok := d.statsCancel[containerID]; ok {
		cancel()
		delete(d.statsCancel, containerID)
		runtime.EventsEmit(d.ctx, "container:stats:stopped", map[string]string{
			"containerId": containerID,
		})
	}
}

func cpuPercent(v *ctn.StatsResponse) float64 {
	cpuDelta := float64(v.CPUStats.CPUUsage.TotalUsage - v.PreCPUStats.CPUUsage.TotalUsage)
	sysDelta := float64(v.CPUStats.SystemUsage - v.PreCPUStats.SystemUsage)
	if cpuDelta <= 0 || sysDelta <= 0 {
		return 0
	}
	ncpu := float64(v.CPUStats.OnlineCPUs)
	if ncpu == 0 {
		ncpu = float64(len(v.CPUStats.CPUUsage.PercpuUsage))
		if ncpu == 0 {
			ncpu = 1
		}
	}
	return (cpuDelta / sysDelta) * ncpu * 100.0
}

func memUsage(v *ctn.StatsResponse) uint64 {
	if v.MemoryStats.Stats != nil {
		if cache, ok := v.MemoryStats.Stats["cache"]; ok && v.MemoryStats.Usage >= cache {
			return v.MemoryStats.Usage - cache
		}
	}
	return v.MemoryStats.Usage
}

func memPercent(v *ctn.StatsResponse) float64 {
	u := float64(memUsage(v))
	lim := float64(v.MemoryStats.Limit)
	if lim == 0 {
		return 0
	}
	return (u / lim) * 100.0
}

func sumRx(v *ctn.StatsResponse) uint64 {
	var t uint64
	for _, n := range v.Networks {
		t += n.RxBytes
	}
	return t
}

func sumTx(v *ctn.StatsResponse) uint64 {
	var t uint64
	for _, n := range v.Networks {
		t += n.TxBytes
	}
	return t
}
