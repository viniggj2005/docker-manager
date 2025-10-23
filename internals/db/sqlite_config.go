package db

import (
	"docker-manager-go/internals/src/models"
	"fmt"
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var (
	DB  *gorm.DB
	err error
)

func InitDb() {
	dbPath := "secure.db"
	dsn := fmt.Sprintf("file:%s?_journal_mode=WAL&_foreign_keys=on", dbPath)

	DB, err = gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("erro ao abrir banco SQLite: %v", err)
	}

	if err := DB.AutoMigrate(
		&models.User{},
		&models.DockerCredentials{},
		&models.SshConnection{},
	); err != nil {
		log.Fatalf("erro ao migrar modelos: %v", err)
	}
}
