package handlers

import (
	"context"
	"docker-manager-go/internals/src/auth"
	"docker-manager-go/internals/src/dtos"
	"docker-manager-go/internals/src/models"
	"errors"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserHandler struct {
	DB   *gorm.DB
	Sess *auth.Manager
	ctx  context.Context
}

func NewUserHandler(db *gorm.DB, sess *auth.Manager) *UserHandler {
	return &UserHandler{DB: db, Sess: sess}
}
func (h *UserHandler) Startup(ctx context.Context) {
	h.ctx = ctx
}

func (h *UserHandler) Create(in dtos.CreateUserInput) (*dtos.UserDTO, error) {
	if in.Name == "" || in.Email == "" || in.Password == "" {
		return nil, errors.New("nome, email e password são obrigatórios")
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(in.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	user := &models.User{Name: in.Name, Email: in.Email, Password: string(hash)}
	if err := h.DB.WithContext(h.ctx).Create(user).Error; err != nil {
		return nil, err
	}
	return dtos.ToDTO(user), nil
}

func (h *UserHandler) GetByID(token string, id uint) (*dtos.UserDTO, error) {
	if err := auth.MustAuth(h.Sess, token); err != nil {
		return nil, err
	}
	var u models.User
	if err := h.DB.WithContext(h.ctx).First(&u, id).Error; err != nil {
		return nil, err
	}
	return dtos.ToDTO(&u), nil
}

func (h *UserHandler) Update(token string, id uint, in dtos.UpdateUserInput) (*dtos.UserDTO, error) {

	if err := auth.MustAuth(h.Sess, token); err != nil {
		return nil, err
	}

	var u models.User
	if err := h.DB.WithContext(h.ctx).First(&u, id).Error; err != nil {
		return nil, err
	}
	if in.Name != nil {
		u.Name = *in.Name
	}
	if in.Email != nil {
		u.Email = *in.Email
	}
	if in.Password != nil && *in.Password != "" {
		hash, err := bcrypt.GenerateFromPassword([]byte(*in.Password), bcrypt.DefaultCost)
		if err != nil {
			return nil, err
		}
		u.Password = string(hash)
	}
	if err := h.DB.WithContext(h.ctx).Save(&u).Error; err != nil {
		return nil, err
	}
	return dtos.ToDTO(&u), nil
}

func (h *UserHandler) MyInfo(token string) (*dtos.UserDTO, error) {
	s, err := h.Sess.Validate(token)
	if err != nil {
		return nil, err
	}

	var u models.User
	if err := h.DB.WithContext(h.ctx).First(&u, s.UserID).Error; err != nil {
		return nil, err
	}
	return dtos.ToDTO(&u), nil
}
