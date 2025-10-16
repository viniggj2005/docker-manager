package terminal

import (
	"context"
	"errors"
	"fmt"
	"io"
	"os"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
	"golang.org/x/crypto/ssh"
	"golang.org/x/crypto/ssh/knownhosts"
)

type Terminal struct {
	ctx     context.Context
	client  *ssh.Client
	session *ssh.Session
	stdin   io.WriteCloser
}
type SSHConn struct {
	Host string
	Port int
	User string

	Password   string
	Key        []byte
	KeyPath    string
	Passphrase string

	KnownHostsPath        string
	InsecureIgnoreHostKey bool

	Cols, Rows int
	Timeout    time.Duration
}

func (t *Terminal) Startup(ctx context.Context) { t.ctx = ctx }

func (t *Terminal) ConnectWith(cfg SSHConn) error {
	if t.session != nil {
		return errors.New("já conectado")
	}

	var hkcb ssh.HostKeyCallback
	if cfg.KnownHostsPath != "" {
		cb, err := knownhosts.New(cfg.KnownHostsPath)
		if err != nil {
			return err
		}
		hkcb = cb
	} else if cfg.InsecureIgnoreHostKey {
		hkcb = ssh.InsecureIgnoreHostKey()
	} else {
		return errors.New("sem KnownHostsPath e InsecureIgnoreHostKey=false")
	}

	methods := []ssh.AuthMethod{}
	if len(cfg.Key) > 0 || cfg.KeyPath != "" {
		key := cfg.Key
		if len(key) == 0 {
			b, err := os.ReadFile(cfg.KeyPath)
			if err != nil {
				return err
			}
			key = b
		}
		var signer ssh.Signer
		var err error
		if cfg.Passphrase != "" {
			signer, err = ssh.ParsePrivateKeyWithPassphrase(key, []byte(cfg.Passphrase))
		} else {
			signer, err = ssh.ParsePrivateKey(key)
		}
		if err != nil {
			return err
		}
		methods = append(methods, ssh.PublicKeys(signer))
	} else if cfg.Password != "" {
		methods = append(methods, ssh.Password(cfg.Password))
	} else {
		return errors.New("nenhum método de autenticação fornecido")
	}

	if cfg.Timeout == 0 {
		cfg.Timeout = 10 * time.Second
	}
	if cfg.Port == 0 {
		cfg.Port = 22
	}
	if cfg.Cols == 0 {
		cfg.Cols = 80
	}
	if cfg.Rows == 0 {
		cfg.Rows = 24
	}

	conf := &ssh.ClientConfig{
		User:            cfg.User,
		Auth:            methods,
		HostKeyCallback: hkcb,
		Timeout:         cfg.Timeout,
	}

	addr := fmt.Sprintf("%s:%d", cfg.Host, cfg.Port)
	c, err := ssh.Dial("tcp", addr, conf)
	if err != nil {
		return err
	}

	s, err := c.NewSession()
	if err != nil {
		c.Close()
		return err
	}

	modes := ssh.TerminalModes{
		ssh.ECHO:          1,
		ssh.TTY_OP_ISPEED: 14400,
		ssh.TTY_OP_OSPEED: 14400,
	}
	if err := s.RequestPty("xterm-256color", cfg.Rows, cfg.Cols, modes); err != nil {
		s.Close()
		c.Close()
		return err
	}

	stdin, _ := s.StdinPipe()
	stdout, _ := s.StdoutPipe()
	stderr, _ := s.StderrPipe()

	if err := s.Shell(); err != nil {
		s.Close()
		c.Close()
		return err
	}

	t.client = c
	t.session = s
	t.stdin = stdin

	go func() {
		buf := make([]byte, 8192)
		for {
			n, err := stdout.Read(buf)
			if n > 0 {
				runtime.EventsEmit(t.ctx, "ssh:data", string(buf[:n]))
			}
			if err != nil {
				break
			}
		}
	}()
	go func() {
		buf := make([]byte, 4096)
		for {
			n, err := stderr.Read(buf)
			if n > 0 {
				runtime.EventsEmit(t.ctx, "ssh:data", string(buf[:n]))
			}
			if err != nil {
				break
			}
		}
	}()
	go func() {
		err := s.Wait()
		msg := ""
		if err != nil {
			msg = err.Error()
		}
		runtime.EventsEmit(t.ctx, "ssh:exit", msg)
	}()

	return nil
}

func (t *Terminal) Send(data string) error {
	if t.stdin == nil {
		return errors.New("não conectado")
	}
	_, err := t.stdin.Write([]byte(data))
	return err
}

func (t *Terminal) Resize(cols, rows int) error {
	if t.session == nil {
		return errors.New("não conectado")
	}
	return t.session.WindowChange(rows, cols)
}

func (t *Terminal) Disconnect() {
	if t.session != nil {
		_ = t.session.Close()
		t.session = nil
	}
	if t.client != nil {
		_ = t.client.Close()
		t.client = nil
	}
	t.stdin = nil
}
