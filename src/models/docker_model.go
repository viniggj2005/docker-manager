package models

import (
	"docker-manager-go/src/types"

	"gorm.io/gorm"
)

type DockerCredentialsModel struct {
	gorm.Model
	Url    types.EncryptedString `gorm:"type:blob;not null;column:url"`
	Ca     types.EncryptedString `gorm:"type:blob;not null;column:ca"`
	Cert   types.EncryptedString `gorm:"type:blob;not null;column:cert"`
	Key    types.EncryptedString `gorm:"type:blob;not null;column:key"`
	UserID uint
	User   UserModel `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
