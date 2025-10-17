package auth

func MustAuth(m *Manager, token string) error {
	_, err := m.Validate(token)
	return err
}
