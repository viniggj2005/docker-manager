package handlers

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"docker-manager-go/src/auth"
	"docker-manager-go/src/dtos"
	"docker-manager-go/src/models"
	"docker-manager-go/src/types"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type AuthHandlerStruct struct {
	DataBase *gorm.DB
	context  context.Context
	Session  *auth.ManagerStruct
}

func NewAuthHandler(dataBase *gorm.DB, sessionManager *auth.ManagerStruct) *AuthHandlerStruct {
	return &AuthHandlerStruct{DataBase: dataBase, Session: sessionManager}
}

func (handlerStruct *AuthHandlerStruct) Startup(context context.Context) {
	handlerStruct.context = context
}

func (handlerStruct *AuthHandlerStruct) Login(body dtos.LoginInputDto) (*dtos.LoginResponseDto, error) {
	var userModel models.UserModel
	if err := handlerStruct.DataBase.WithContext(handlerStruct.context).Where("email = ?", body.Email).First(&userModel).Error; err != nil {
		return nil, errors.New("credenciais inválidas")
	}

	if bcrypt.CompareHashAndPassword([]byte(userModel.Password), []byte(body.Password)) != nil {
		return nil, errors.New("credenciais inválidas")
	}

	key := deriveSessionKey(body.Password, userModel.Email)
	if err := types.SetSessionKey(key); err != nil {
		return nil, err
	}

	token, _, err := handlerStruct.Session.Create(userModel.ID)
	if err != nil {
		return nil, err
	}

	runtime.EventsEmit(handlerStruct.context, "auth:changed", true)
	uDTO := dtos.ToDTO(&userModel)

	return &dtos.LoginResponseDto{
		Token: token,
		User:  *uDTO,
	}, nil
}

func (handlerStruct *AuthHandlerStruct) Logout(token string) {
	handlerStruct.Session.Destroy(token)
	runtime.EventsEmit(handlerStruct.context, "auth:changed", false)
}

func deriveSessionKey(password, email string) string {
	hash := sha256.Sum256([]byte(password + ":" + email))
	return hex.EncodeToString(hash[:])
}
