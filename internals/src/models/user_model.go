package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name     string `json:"nome" gorm:"not null"`
	Email    string `json:"email" gorm:"uniqueIndex;not null"`
	Password string `json:"-" gorm:"uniqueIndex;not null"`
	Docker   []DockerCredentials
	Ssh      []SshConnection
}
