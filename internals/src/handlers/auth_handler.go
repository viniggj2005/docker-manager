package handlers

import (
	"context"
	"errors"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"docker-manager-go/internals/src/auth"
	"docker-manager-go/internals/src/dtos"
	"docker-manager-go/internals/src/models"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type AuthHandler struct {
	DB   *gorm.DB
	ctx  context.Context
	Sess *auth.Manager
}

type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string       `json:"token"`
	User  dtos.UserDTO `json:"user"`
}

func NewAuthHandler(db *gorm.DB, sm *auth.Manager) *AuthHandler {
	return &AuthHandler{DB: db, Sess: sm}
}

func (h *AuthHandler) Startup(ctx context.Context) {
	h.ctx = ctx
}

func (h *AuthHandler) Login(in LoginInput) (*LoginResponse, error) {
	var u models.User
	if err := h.DB.WithContext(h.ctx).Where("email = ?", in.Email).First(&u).Error; err != nil {
		return nil, errors.New("credenciais inválidas")
	}
	if bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(in.Password)) != nil {
		return nil, errors.New("credenciais inválidas")
	}
	token, _, err := h.Sess.Create(u.ID)
	if err != nil {
		return nil, err
	}

	runtime.EventsEmit(h.ctx, "auth:changed", true)
	uDTO := dtos.ToDTO(&u)
	return &LoginResponse{
		Token: token,
		User:  *uDTO,
	}, nil
}

func (h *AuthHandler) Logout(token string) {
	h.Sess.Destroy(token)

	runtime.EventsEmit(h.ctx, "auth:changed", false)
}
