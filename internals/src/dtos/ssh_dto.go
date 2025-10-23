package dtos

import "docker-manager-go/internals/src/models"

type CreateSshConnectionInput struct {
	Host           string  `json:"host" binding:"required"`
	SystemUser     string  `json:"systemUser" binding:"required"`
	Alias          *string `json:"alias,omitempty"`
	Port           *int64  `json:"port,omitempty"`
	Key            *string `json:"key,omitempty"`
	KnownHostsData *string `json:"knownHosts,omitempty"`
	UserID         uint    `json:"userId" binding:"required"`
}

type SshDto struct {
	ID             uint    `json:"id"`
	Host           string  `json:"host"`
	Alias          *string `json:"alias,omitempty"`
	SystemUser     string  `json:"systemUser"`
	Port           *int64  `json:"port,omitempty"`
	Key            *string `json:"key,omitempty"`
	KnownHostsData *string `json:"knownHosts,omitempty"`
	UserID         uint    `json:"userId"`
}

// Converte um model para DTO
func ToSshDTO(s *models.SshConnection) *SshDto {
	host := s.Host.Plaintext

	var keyPtr *string
	if s.Key.Plaintext != "" {
		keyPtr = &s.Key.Plaintext
	}

	var knownPtr *string
	if s.KnownHostsData.Plaintext != "" {
		knownPtr = &s.KnownHostsData.Plaintext
	}

	return &SshDto{
		ID:             s.ID,
		Host:           host,
		Alias:          &s.Alias,
		SystemUser:     s.SystemUser,
		Port:           &s.Port,
		Key:            keyPtr,
		KnownHostsData: knownPtr,
		UserID:         s.UserID,
	}
}

func ToSshDTOList(conns []models.SshConnection) []SshDto {
	list := make([]SshDto, 0, len(conns))
	for _, c := range conns {
		list = append(list, *ToSshDTO(&c))
	}
	return list
}

func int64Ptr(v int64) *int64 {
	return &v
}
