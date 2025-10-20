package handlers

import (
	"context"
	"docker-manager-go/internals/src/auth"
	"docker-manager-go/internals/src/dtos"
	"docker-manager-go/internals/src/models"
	"encoding/base64"
	"fmt"

	"gorm.io/gorm"
)

type SshHandler struct {
	DB   *gorm.DB
	Sess *auth.Manager
	ctx  context.Context
}

func NewSshHandler(db *gorm.DB, sm *auth.Manager) *SshHandler {
	return &SshHandler{DB: db, Sess: sm}
}

func (s *SshHandler) Startup(ctx context.Context) {
	s.ctx = ctx
}
func (s *SshHandler) CreateSshConnection(body dtos.CreateSshConnectionInput) error {
	var port int64 = 22
	if body.Port != nil {
		port = *body.Port
	}

	var key string
	if body.Key != nil && *body.Key != "" {
		keyBytes, err := base64.StdEncoding.DecodeString(*body.Key)
		if err != nil {
			return fmt.Errorf("erro ao decodificar chave: %w", err)
		}
		key = string(keyBytes)
	}

	var known string
	if body.KnownHostsData != nil && *body.KnownHostsData != "" {
		knownBytes, err := base64.StdEncoding.DecodeString(*body.KnownHostsData)
		if err != nil {
			return fmt.Errorf("erro ao decodificar knownHosts: %w", err)
		}
		known = string(knownBytes)
	}

	conn := models.SshConnection{
		Host:           body.Host,
		SystemUser:     body.SystemUser,
		Port:           port,
		Key:            key,
		KnownHostsData: known,
		UserID:         body.UserID,
	}

	return s.DB.Create(&conn).Error
}
