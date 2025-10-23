package handlers

import (
	"context"
	"encoding/base64"
	"fmt"

	"gorm.io/gorm"

	"docker-manager-go/internals/src/auth"
	"docker-manager-go/internals/src/dtos"
	"docker-manager-go/internals/src/models"
	"docker-manager-go/internals/types"
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

func (s *SshHandler) UpdateSshConnection(token string, id uint, body dtos.CreateSshConnectionInput) error {
	if err := auth.MustAuth(s.Sess, token); err != nil {
		return err
	}

	var existing models.SshConnection
	if err := s.DB.First(&existing, id).Error; err != nil {
		return fmt.Errorf("conexão não encontrada: %w", err)
	}

	if body.Host != "" {
		existing.Host.Plaintext = body.Host
	}
	if body.SystemUser != "" {
		existing.SystemUser = body.SystemUser
	}
	if body.Port != nil {
		existing.Port = *body.Port
	}
	if body.Alias != nil {
		existing.Alias = *body.Alias
	}

	if body.Key != nil && *body.Key != "" {
		keyBytes, err := base64.StdEncoding.DecodeString(*body.Key)
		if err != nil {
			return fmt.Errorf("erro ao decodificar chave: %w", err)
		}
		existing.Key.Plaintext = string(keyBytes)
	}

	if body.KnownHostsData != nil && *body.KnownHostsData != "" {
		knownBytes, err := base64.StdEncoding.DecodeString(*body.KnownHostsData)
		if err != nil {
			return fmt.Errorf("erro ao decodificar knownHosts: %w", err)
		}
		existing.KnownHostsData.Plaintext = string(knownBytes)
	}

	existing.UserID = body.UserID

	if err := s.DB.Save(&existing).Error; err != nil {
		return fmt.Errorf("erro ao atualizar conexão: %w", err)
	}

	return nil
}

func (s *SshHandler) CreateSshConnection(token string, body dtos.CreateSshConnectionInput) error {
	if err := auth.MustAuth(s.Sess, token); err != nil {
		return err
	}

	if body.Host == "" {
		return fmt.Errorf("o campo 'host' é obrigatório")
	}

	var port int64 = 22
	if body.Port != nil {
		port = *body.Port
	}

	var keyStr string
	if body.Key != nil && *body.Key != "" {
		keyBytes, err := base64.StdEncoding.DecodeString(*body.Key)
		if err != nil {
			return fmt.Errorf("erro ao decodificar chave: %w", err)
		}
		keyStr = string(keyBytes)
	}

	var knownStr string
	if body.KnownHostsData != nil && *body.KnownHostsData != "" {
		knownBytes, err := base64.StdEncoding.DecodeString(*body.KnownHostsData)
		if err != nil {
			return fmt.Errorf("erro ao decodificar knownHosts: %w", err)
		}
		knownStr = string(knownBytes)
	}

	var alias string
	if body.Alias != nil {
		alias = *body.Alias
	}

	conn := models.SshConnection{
		Alias:          alias,
		Host:           types.EncryptedString{Plaintext: body.Host},
		SystemUser:     body.SystemUser,
		Port:           port,
		Key:            types.EncryptedString{Plaintext: keyStr},
		KnownHostsData: types.EncryptedString{Plaintext: knownStr},
		UserID:         body.UserID,
	}

	if conn.Host.Plaintext == "" {
		return fmt.Errorf("erro: host está vazio antes do insert")
	}

	if err := s.DB.Select("*").Create(&conn).Error; err != nil {
		return fmt.Errorf("erro ao criar conexão: %w", err)
	}

	return nil
}

func (s *SshHandler) FindAllConnectionByUser(token string, userId int) ([]dtos.SshDto, error) {
	if err := auth.MustAuth(s.Sess, token); err != nil {
		return nil, err
	}

	var conns []models.SshConnection
	if err := s.DB.WithContext(s.ctx).
		Where("user_id = ?", userId).
		Find(&conns).Error; err != nil {
		return nil, err
	}

	return dtos.ToSshDTOList(conns), nil
}

func (s *SshHandler) GetById(token string, id int) (dtos.SshDto, error) {
	if err := auth.MustAuth(s.Sess, token); err != nil {
		return dtos.SshDto{}, err
	}

	var conn models.SshConnection
	if err := s.DB.WithContext(s.ctx).
		Where("id = ?", id).
		First(&conn).Error; err != nil {
		return dtos.SshDto{}, err
	}

	return *dtos.ToSshDTO(&conn), nil
}

func (s *SshHandler) DeleteConnection(token string, id int) error {
	if err := auth.MustAuth(s.Sess, token); err != nil {
		return err
	}

	if err := s.DB.WithContext(s.ctx).
		Where("id = ?", id).
		Delete(&models.SshConnection{}).Error; err != nil {
		return err
	}

	return nil
}
