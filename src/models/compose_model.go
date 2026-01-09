package models

type ComposeModel struct {
	Name     string `json:"name" binding:"required"`
	Content  string `json:"content" binding:"required"`
	DockerID uint
	Docker   DockerCredentialsModel `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
