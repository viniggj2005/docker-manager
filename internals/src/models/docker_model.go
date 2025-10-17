package models

import "gorm.io/gorm"

type DockerCredentials struct {
	gorm.Model
	Url    string `json:"url" gorm:"not null"`
	Ca     string `json:"ca" gorm:"not null"`
	Cert   string `json:"cert" gorm:"not null"`
	Key    string `json:"key" gorm:"not null"`
	UserID uint
	User   User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
