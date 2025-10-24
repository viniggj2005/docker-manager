package types

import (
	"context"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"database/sql/driver"
	"encoding/hex"
	"fmt"
	"io"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

var sessionKey []byte

type EncryptedString struct {
	Ciphertext []byte
	Plaintext  string `gorm:"-"`
}

func (es *EncryptedString) Scan(value interface{}) error {
	if b, ok := value.([]byte); ok {
		pt, err := decrypt(b, currentKey())
		if err != nil {
			return err
		}
		es.Ciphertext = b
		es.Plaintext = string(pt)
		return nil
	}
	return fmt.Errorf("invalid type for EncryptedString")
}

func (es *EncryptedString) Value() (driver.Value, error) {
	ct, err := encrypt([]byte(es.Plaintext), currentKey())
	if err != nil {
		return nil, err
	}
	return ct, nil
}

func (EncryptedString) GormDataType() string                    { return "blob" }
func (EncryptedString) GormDBDataType(*gorm.DB, *schema) string { return "BLOB" }

func (es EncryptedString) GormValue(ctx context.Context, db *gorm.DB) clause.Expr {
	v, _ := (&es).Value()
	return gorm.Expr("?", v)
}

type schema struct{}

func SetSessionKey(keyHex string) error {
	key, err := hex.DecodeString(keyHex)
	if err != nil {
		return fmt.Errorf("invalid hex key: %w", err)
	}
	sessionKey = key
	return nil
}

func currentKey() []byte { return sessionKey }

func encrypt(plaintext []byte, key []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}
	nonce := make([]byte, aesgcm.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return nil, err
	}
	return aesgcm.Seal(nonce, nonce, plaintext, nil), nil
}

func decrypt(ciphertext []byte, key []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}
	nonceSize := aesgcm.NonceSize()
	if len(ciphertext) < nonceSize {
		return nil, fmt.Errorf("malformed ciphertext")
	}
	nonce, ct := ciphertext[:nonceSize], ciphertext[nonceSize:]
	return aesgcm.Open(nil, nonce, ct, nil)
}
