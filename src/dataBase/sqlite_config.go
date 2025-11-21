package database

import (
	"docker-manager-go/src/models"
	"fmt"
	"log"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

var (
	DataBase *gorm.DB
	err      error
)

func InitDb() {
	dataBasePath := "secure.db"
	dsn := fmt.Sprintf("file:%s?_journal_mode=WAL&_foreign_keys=on", dataBasePath)

	DataBase, err = gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("erro ao abrir banco SQLite: %v", err)
	}

	if err := DataBase.AutoMigrate(
		&models.UserModel{},
		&models.DockerCredentialsModel{},
		&models.SshConnectionModel{},
	); err != nil {
		log.Fatalf("erro ao migrar modelos: %v", err)
	}
}
