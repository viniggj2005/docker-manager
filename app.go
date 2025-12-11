package main

import (
	"context"
	"encoding/base64"
	"os"
	"path/filepath"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) LoadImage(name string) (string, error) {
	execPath, _ := os.Getwd()
	imgPath := filepath.Join(execPath, "uploads", name)

	data, err := os.ReadFile(imgPath)
	if err != nil {
		return "", err
	}
	base64Str := "data:image/png;base64," + base64.StdEncoding.EncodeToString(data)
	return base64Str, nil
}

func (a *App) SaveImage(base64Str, path string) error {
	parts := strings.Split(base64Str, ",")
	data, err := base64.StdEncoding.DecodeString(parts[len(parts)-1])
	if err != nil {
		return err
	}
	return os.WriteFile(path, data, 0644)
}

func (a *App) GetFilePath() string {
	selection, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Selecione um arquivo",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Dockerfile",
				Pattern:     "Dockerfile",
			},
			{
				DisplayName: "Todos os arquivos (*.*)",
				Pattern:     "*.*",
			},
		},
	})

	if err != nil {
		return ""
	}
	return selection
}
