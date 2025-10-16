package main

import (
	"context"
	"docker-manager-go/internals/docker"
	"docker-manager-go/internals/terminal"
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {

	app := NewApp()
	docker := docker.NewDocker()
	term := &terminal.Terminal{}

	err := wails.Run(&options.App{
		Title:  "Docker Manager",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 0, G: 0, B: 0, A: 1},
		OnStartup: func(ctx context.Context) {
			app.startup(ctx)
			term.Startup(ctx)
			docker.Startup(ctx)
		},
		Bind: []interface{}{
			app,
			docker,
			term,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
