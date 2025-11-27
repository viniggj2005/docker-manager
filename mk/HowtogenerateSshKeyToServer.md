# Como Gerar uma Chave SSH e Ativar Login sem Senha no Servidor

Este guia ensina a:

Gerar um par de chaves SSH (seguro e sem senha)

Enviar a chave pública para o servidor

Testar o acesso SSH sem senha

Compatível com **Windows, Linux e macOS.**

# 1. Gerar a chave SSH (cliente)

No seu computador, abra o terminal (PowerShell no Windows):
```bash
ssh-keygen -t ed25519 -C "seu_email_ou_identificacao"
```

Quando aparecer:
```bash
Enter file in which to save the key:
```

Pressione **ENTER.**

Quando pedir passphrase:

Pressione **ENTER** para não usar senha (login automático sem senha)

Ou digite uma senha caso queira proteção extra

Isso gera dois arquivos:

**id_ed25519** -> chave privada (NÃO compartilhe) e adicione no app ao configurar uma conexão ssh.

**id_ed25519.pub** -> chave pública (será enviada ao servidor)

Local padrão:

Windows: ```C:\Users\SEU_USUARIO\.ssh\```

Linux/macOS: ```~/.ssh/```

# 2. Visualizar a chave pública
```bash
cat ~/.ssh/id_ed25519.pub
```

Ou no PowerShell:
```bash
type $env:USERPROFILE\.ssh\id_ed25519.pub
```

Copie a linha inteira, começando com:
```bash
ssh-ed25519 AAAAC3Nz... seu_email
```
# 3. Enviar a chave pública ao servidor

Se você estiver no Linux/macOS:
```bash
ssh-copy-id usuario@IP_DO_SERVIDOR
```
## No Windows (não existe ssh-copy-id)

Acesse o servidor:
```bash
ssh usuario@IP_DO_SERVIDOR
```

No servidor, execute:
```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
```

Depois edite:
```bash
nano ~/.ssh/authorized_keys
```

Cole **somente** a chave pública.
Salve e feche.

Aplique permissões corretas:
```bash
chmod 600 ~/.ssh/authorized_keys
```

Se necessário:
```bash
chown -R usuario:usuario ~/.ssh
```
# 4. Testar o login sem senha

No computador cliente:
```bash
ssh usuario@IP_DO_SERVIDOR
```

Se tudo estiver correto, o SSH **não pedirá senha.**