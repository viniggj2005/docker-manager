package dtos

import "docker-manager-go/internals/src/models"

type CreateUserInput struct {
	Name     string `json:"nome"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UpdateUserInput struct {
	Name     *string `json:"nome,omitempty"`
	Email    *string `json:"email,omitempty"`
	Password *string `json:"password,omitempty"`
}

type UserDTO struct {
	ID    uint   `json:"id"`
	Name  string `json:"nome"`
	Email string `json:"email"`
}

func ToDTO(u *models.User) *UserDTO {
	return &UserDTO{ID: u.ID, Name: u.Name, Email: u.Email}
}
