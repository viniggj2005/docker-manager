package models

import (
	"docker-manager-go/src/types"

	"gorm.io/gorm"
)

type DockerCredentialsModel struct {
	gorm.Model
	Alias       string                `gorm:"column:alias"`
	Url         types.EncryptedString `gorm:"type:blob;not null;column:url"`
	Description string                `gorm:"column:description"`
	Ca          types.EncryptedString `gorm:"type:blob;not null;column:ca"`
	Cert        types.EncryptedString `gorm:"type:blob;not null;column:cert"`
	Key         types.EncryptedString `gorm:"type:blob;not null;column:key"`
	UserID      uint
	User        UserModel `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
