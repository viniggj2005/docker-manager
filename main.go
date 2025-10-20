package main

import (
	"context"
	"docker-manager-go/internals/db"
	"docker-manager-go/internals/docker"
	"docker-manager-go/internals/src/auth"
	"docker-manager-go/internals/src/handlers"
	"docker-manager-go/internals/terminal"
	"embed"
	"log"
	"time"

	"github.com/joho/godotenv"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	e := godotenv.Load()
	if e != nil {
		log.Fatalf("Erro ao carregar env .env file: %s", e)
	}

	db.InitDb()
	app := NewApp()
	docker := docker.NewDocker()
	term := &terminal.Terminal{}
	sm := auth.NewManager(8 * time.Hour)
	sshHandler := handlers.NewSshHandler(db.DB, sm)
	authHandler := handlers.NewAuthHandler(db.DB, sm)
	userHandler := handlers.NewUserHandler(db.DB, sm)

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
			sshHandler.Startup(ctx)
			authHandler.Startup(ctx)
			userHandler.Startup(ctx)

		},
		Bind: []interface{}{
			app,
			term,
			docker,
			sshHandler,
			authHandler,
			userHandler,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
