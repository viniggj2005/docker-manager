package db

import (
	"docker-manager-go/internals/src/models"
	"fmt"
	"log"
	"os"
	"strings"

	sqlcipher "github.com/whatisusername/gorm-sqlcipher"
	"gorm.io/gorm"
)

var (
	DB  *gorm.DB
	err error
)

func InitDb() {
	key := os.Getenv("DB_KEY")
	if key == "" {
		log.Fatal("DB_KEY não definida")
	}
	escaped := strings.ReplaceAll(key, "'", "''")
	dsn := fmt.Sprintf("file:secure.db?_journal_mode=WAL&_pragma=key('%s')&_pragma=cipher_page_size=4096&_pragma=foreign_keys(ON)", escaped)
	DB, err = gorm.Open(sqlcipher.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	if err := DB.AutoMigrate(&models.User{}, &models.DockerCredentials{}); err != nil {
		log.Fatal(err)
	}
}
