# Como expor o Docker em `tcp://<host>:2376` com TLS (CA/Cert/Key)

Este guia mostra como:

- Gerar **CA**, **certificado do servidor** e **certificado do cliente** (`.pem`)
- Configurar o **Docker Engine** para escutar em `tcp://0.0.0.0:2376` com TLS
- Testar a conexão de uma máquina cliente
- Usar os arquivos gerados nos campos **CA (PEM)**, **Cert (PEM)** e **Key (PEM)**

> Todos os comandos abaixo são executados no **servidor** onde o Docker Engine roda
> (Linux). Ajuste `SEU_IP` para o IP real dessa máquina.

---

# 1. Preparar o diretório

No servidor:

```bash
sudo mkdir -p /etc/docker/ssl
cd /etc/docker/ssl
```
# 2. Gerar CA, cert e key (modelo “oficial” do Docker)
## 2.1. Gerar CA (autoridade certificadora)
```bash
# chave privada da CA
openssl genrsa -aes256 -out ca-key.pem 4096

# certificado da CA
openssl req -new -x509 -days 365 -key ca-key.pem -sha256 -out ca.pem
```
Ele vai pedir algumas informações (Country, Org, etc.).
Pode preencher qualquer coisa, mas guarde ca.pem e ca-key.pem com cuidado (não envie para o cliente).

## 2.2. Gerar chave e certificado do servidor Docker
```bash
# chave privada do servidor
sudo openssl genrsa -out server-key.pem 4096

# CSR do servidor
sudo openssl req -subj "/CN=meu-docker" -new -key server-key.pem -out server.csr
```
Agora você define em quais IPs/hostnames o certificado será válido.

Crie o arquivo extfile.cnf:

```bash
cat > extfile.cnf <<EOF
subjectAltName = IP:IP_DO_SEU_SERVIDOR,IP:127.0.0.1,DNS:meu-docker
extendedKeyUsage = serverAuth
EOF
```
Substitua SEU_IP pelo IP real do servidor, por exemplo:

```bash
cat > extfile.cnf <<EOF
subjectAltName = IP:192.168.155.19,IP:127.0.0.1,DNS:meu-docker
extendedKeyUsage = serverAuth
EOF
```
Agora assine o certificado do servidor com a CA:

```bash
openssl x509 -req -days 365 -sha256 \
    -in server.csr \
    -CA ca.pem -CAkey ca-key.pem -CAcreateserial \
    -out server-cert.pem \
    -extfile extfile.cnf
```
Arquivos importantes do servidor:

ca.pem

server-key.pem

server-cert.pem

## 2.3. Gerar certificado e chave do cliente (para seu app)
Esses são os arquivos que vão alimentar os campos Cert (PEM) e Key (PEM) da sua tela.

```bash
# chave privada do cliente
openssl genrsa -out key.pem 4096

# CSR do cliente
openssl req -subj "/CN=client" -new -key key.pem -out client.csr
```
Crie o arquivo extfile-client.cnf:

```bash
cat > extfile-client.cnf <<EOF
extendedKeyUsage = clientAuth
EOF
```
Assine com a CA:

```bash
openssl x509 -req -days 365 -sha256 \
    -in client.csr \
    -CA ca.pem -CAkey ca-key.pem -CAcreateserial \
    -out cert.pem \
    -extfile extfile-client.cnf
```
Arquivos que você vai usar no cliente (app / máquina externa):

ca.pem → certificado da CA

cert.pem → certificado do cliente

key.pem → chave privada do cliente

Nunca copie ca-key.pem (chave da CA) para fora do servidor.

# 3. Configurar o Docker Engine em tcp://0.0.0.0:2376 com TLS
No servidor, edite /etc/docker/daemon.json:

```bash
sudo nano /etc/docker/daemon.json
```
Conteúdo sugerido (ajuste paths se usar outra pasta):

```json
{
  "hosts": [
    "unix:///var/run/docker.sock",
    "tcp://0.0.0.0:2376"
  ],
  "tls": true,
  "tlsverify": true,
  "tlscacert": "/etc/docker/ssl/ca.pem",
  "tlscert": "/etc/docker/ssl/server-cert.pem",
  "tlskey": "/etc/docker/ssl/server-key.pem"
}
```
Permissões adequadas nos arquivos:

```bash
sudo chown root:root /etc/docker/ssl/*.pem
sudo chmod 600 /etc/docker/ssl/*key.pem
sudo chmod 644 /etc/docker/ssl/*.pem
```
Recarregue e reinicie o Docker:

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```
Verifique se a porta 2376 está escutando:

```bash
sudo ss -lntp | grep 2376
```
Saída esperada (algo como):
```bash
LISTEN 0 128 0.0.0.0:2376 ...
```
# 4. Testar a conexão TLS a partir de outra máquina
Na máquina cliente, copie apenas:

ca.pem

cert.pem

key.pem

Coloque-os em uma pasta, por exemplo: /home/usuario/docker-certs.

## 4.1. Teste usando variáveis de ambiente
```bash
export DOCKER_HOST=tcp://SEU_IP:2376
export DOCKER_TLS_VERIFY=1
export DOCKER_CERT_PATH=/home/usuario/docker-certs

docker version
```
Troque SEU_IP pelo IP do servidor, ex: 192.168.155.19.

## 4.2. Teste com flags explícitas
```bash
docker --host tcp://SEU_IP:2376 \
       --tlsverify \
       --tlscacert=/home/usuario/docker-certs/ca.pem \
       --tlscert=/home/usuario/docker-certs/cert.pem \
       --tlskey=/home/usuario/docker-certs/key.pem \
       version
```
Se docker version funcionar, as credenciais estão corretas.

# 5. Usando os certificados no seu app (Docker Manager)
Na tela de Nova credencial:

Endpoint
tcp://SEU_IP:2376
ou tcp://meu-docker:2376 (se o DNS/hostname estiver configurado).

CA (PEM)
Arquivo: ca.pem
Conteúdo começa com -----BEGIN CERTIFICATE-----.

Cert (PEM)
Arquivo: cert.pem (certificado do cliente).

Key (PEM)
Arquivo: key.pem (chave privada do cliente, começa com -----BEGIN PRIVATE KEY-----).

Você pode:

arrastar os arquivos .pem para cada área correspondente, ou

abrir o arquivo e colar o conteúdo no textarea de cada campo.
