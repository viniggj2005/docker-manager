package handlers

import (
	"context"
	"docker-manager-go/src/auth"

	"gorm.io/gorm"
)

type DockerHandlerStruct struct {
	DataBase *gorm.DB
	context  context.Context
	Session  *auth.ManagerStruct
}

func NewDockerHandler(dataBase *gorm.DB, sessionManager *auth.ManagerStruct) *DockerHandlerStruct {
	return &DockerHandlerStruct{DataBase: dataBase, Session: sessionManager}
}

func (handlerStruct *DockerHandlerStruct) Startup(context context.Context) {
	handlerStruct.context = context
}
