package auth

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"sync"
	"time"
)

type Session struct {
	Token     string
	UserID    uint
	ExpiresAt time.Time
}

type Manager struct {
	mu       sync.RWMutex
	sessions map[string]*Session
	ttl      time.Duration
}

func NewManager(ttl time.Duration) *Manager {
	m := &Manager{sessions: make(map[string]*Session), ttl: ttl}
	go m.gc()
	return m
}

func (m *Manager) newToken() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	return hex.EncodeToString(b), err
}

func (m *Manager) Create(userID uint) (string, *Session, error) {
	token, err := m.newToken()
	if err != nil {
		return "", nil, err
	}
	s := &Session{Token: token, UserID: userID, ExpiresAt: time.Now().Add(m.ttl)}
	m.mu.Lock()
	m.sessions[token] = s
	m.mu.Unlock()
	return token, s, nil
}

func (m *Manager) Validate(token string) (*Session, error) {
	m.mu.RLock()
	s, ok := m.sessions[token]
	m.mu.RUnlock()
	if !ok {
		return nil, errors.New("token inválido")
	}
	if time.Now().After(s.ExpiresAt) {
		m.Destroy(token)
		return nil, errors.New("sessão expirada")
	}
	return s, nil
}

func (m *Manager) Destroy(token string) {
	m.mu.Lock()
	delete(m.sessions, token)
	m.mu.Unlock()
}

func (m *Manager) gc() {
	t := time.NewTicker(time.Minute)
	for range t.C {
		now := time.Now()
		m.mu.Lock()
		for k, v := range m.sessions {
			if now.After(v.ExpiresAt) {
				delete(m.sessions, k)
			}
		}
		m.mu.Unlock()
	}
}
