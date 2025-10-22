package models

import (
	"gorm.io/gorm"
)

type SshConnection struct {
	gorm.Model
	Alias          string `json:"alias"`
	Host           string `json:"host" gorm:"not null"`
	SystemUser     string `json:"systemUser" gorm:"column:system_user"`
	Port           int64  `json:"port" gorm:"default:22"`
	Key            string `json:"key"`
	KnownHostsData string `json:"known_hosts" gorm:"type:text"`
	UserID         uint
	User           User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
