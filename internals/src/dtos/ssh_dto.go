package dtos

import "docker-manager-go/internals/src/models"

type CreateSshConnectionInput struct {
	Host           string  `json:"host" binding:"required"`
	SystemUser     string  `json:"systemUser" binding:"required"`
	Port           *int64  `json:"port,omitempty"`
	Key            *string `json:"key,omitempty"`
	KnownHostsData *string `json:"knownHosts,omitempty"`
	UserID         uint    `json:"userId" binding:"required"`
}
type SshDto struct {
	ID             uint    `json:"id"`
	Host           string  `json:"host"`
	SystemUser     string  `json:"systemUser"`
	Port           *int64  `json:"port,omitempty"`
	Key            *string `json:"key,omitempty"`
	KnownHostsData *string `json:"knownHosts,omitempty"`
	UserID         uint    `json:"userId"`
}

func ToSshDTO(s *models.SshConnection) *SshDto {
	return &SshDto{
		ID:             s.ID,
		Host:           s.Host,
		SystemUser:     s.SystemUser,
		Port:           int64Ptr(s.Port),
		Key:            strPtr(s.Key),
		KnownHostsData: strPtr(s.KnownHostsData),
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
func strPtr(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}

func int64Ptr(v int64) *int64 {
	return &v
}
