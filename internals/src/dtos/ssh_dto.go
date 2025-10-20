package dtos

type CreateSshConnectionInput struct {
	Host           string  `json:"host" binding:"required"`
	SystemUser     string  `json:"systemUser" binding:"required"`
	Port           *int64  `json:"port,omitempty"`
	Key            *string `json:"key,omitempty"`
	KnownHostsData *string `json:"knownHosts,omitempty"`
	UserID         uint    `json:"userId" binding:"required"`
}
