package handlers

import (
	"context"
	"docker-manager-go/src/auth"
	"docker-manager-go/src/dtos"
	"errors"
	"fmt"
	"io"
	"os"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
	"golang.org/x/crypto/ssh"
	"golang.org/x/crypto/ssh/knownhosts"
)

type TerminalHandlerStruct struct {
	context       context.Context
	client        *ssh.Client
	sshSession    *ssh.Session
	Session       *auth.ManagerStruct
	standardInput io.WriteCloser
}

func (handlerStruct *TerminalHandlerStruct) Startup(context context.Context) {
	handlerStruct.context = context
}
func NewTerminalHandler(sessionManager *auth.ManagerStruct) *TerminalHandlerStruct {
	return &TerminalHandlerStruct{Session: sessionManager}
}

func (handlerStruct *TerminalHandlerStruct) ConnectWith(configure dtos.SSHConnectionDto) error {
	if handlerStruct.sshSession != nil {
		return errors.New("já conectado")
	}

	var hostKeyCallBack ssh.HostKeyCallback
	if configure.KnownHostsPath != "" {
		callBack, err := knownhosts.New(configure.KnownHostsPath)
		if err != nil {
			return err
		}
		hostKeyCallBack = callBack
	} else if configure.InsecureIgnoreHostKey {
		hostKeyCallBack = ssh.InsecureIgnoreHostKey()
	} else {
		return errors.New("sem KnownHostsPath e InsecureIgnoreHostKey=false")
	}

	methods := []ssh.AuthMethod{}
	if len(configure.Key) > 0 || configure.KeyPath != "" {
		key := configure.Key
		if len(key) == 0 {
			documentInBytes, err := os.ReadFile(configure.KeyPath)
			if err != nil {
				return err
			}
			key = documentInBytes
		}
		var signer ssh.Signer
		var err error
		if configure.Passphrase != "" {
			signer, err = ssh.ParsePrivateKeyWithPassphrase(key, []byte(configure.Passphrase))
		} else {
			signer, err = ssh.ParsePrivateKey(key)
		}
		if err != nil {
			return err
		}
		methods = append(methods, ssh.PublicKeys(signer))
	} else if configure.Password != "" {
		methods = append(methods, ssh.Password(configure.Password))
	} else {
		return errors.New("nenhum método de autenticação fornecido")
	}

	if configure.Timeout == 0 {
		configure.Timeout = 10 * time.Second
	}
	if configure.Port == 0 {
		configure.Port = 22
	}
	if configure.Cols == 0 {
		configure.Cols = 80
	}
	if configure.Rows == 0 {
		configure.Rows = 24
	}

	sshConfigure := &ssh.ClientConfig{
		User:            configure.User,
		Auth:            methods,
		HostKeyCallback: hostKeyCallBack,
		Timeout:         configure.Timeout,
	}

	addr := fmt.Sprintf("%s:%d", configure.Host, configure.Port)
	sshClient, err := ssh.Dial("tcp", addr, sshConfigure)
	if err != nil {
		return err
	}

	session, err := sshClient.NewSession()
	if err != nil {
		sshClient.Close()
		return err
	}

	modes := ssh.TerminalModes{
		ssh.ECHO:          1,
		ssh.TTY_OP_ISPEED: 14400,
		ssh.TTY_OP_OSPEED: 14400,
	}
	if err := session.RequestPty("xterm-256color", configure.Rows, configure.Cols, modes); err != nil {
		session.Close()
		sshClient.Close()
		return err
	}

	standardInput, _ := session.StdinPipe()
	stdout, _ := session.StdoutPipe()
	stderr, _ := session.StderrPipe()

	if err := session.Shell(); err != nil {
		session.Close()
		sshClient.Close()
		return err
	}

	handlerStruct.client = sshClient
	handlerStruct.sshSession = session
	handlerStruct.standardInput = standardInput

	go func() {
		standardOutputBuffer := make([]byte, 8192)
		for {
			n, err := stdout.Read(standardOutputBuffer)
			if n > 0 {
				runtime.EventsEmit(handlerStruct.context, "ssh:data", string(standardOutputBuffer[:n]))
			}
			if err != nil {
				break
			}
		}
	}()
	go func() {
		standardErrorBuffer := make([]byte, 4096)
		for {
			n, err := stderr.Read(standardErrorBuffer)
			if n > 0 {
				runtime.EventsEmit(handlerStruct.context, "ssh:data", string(standardErrorBuffer[:n]))
			}
			if err != nil {
				break
			}
		}
	}()
	go func() {
		err := session.Wait()
		message := ""
		if err != nil {
			message = err.Error()
		}
		runtime.EventsEmit(handlerStruct.context, "ssh:exit", message)
	}()

	return nil
}

func (handlerStruct *TerminalHandlerStruct) Send(data string) error {
	if handlerStruct.standardInput == nil {
		return errors.New("não conectado")
	}
	_, err := handlerStruct.standardInput.Write([]byte(data))
	return err
}

func (handlerStruct *TerminalHandlerStruct) Resize(cols, rows int) error {
	if handlerStruct.sshSession == nil {
		return errors.New("não conectado")
	}
	return handlerStruct.sshSession.WindowChange(rows, cols)
}

func (handlerStruct *TerminalHandlerStruct) Disconnect() {
	if handlerStruct.sshSession != nil {
		_ = handlerStruct.sshSession.Close()
		handlerStruct.sshSession = nil
	}
	if handlerStruct.client != nil {
		_ = handlerStruct.client.Close()
		handlerStruct.client = nil
	}
	handlerStruct.standardInput = nil
}
