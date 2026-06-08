# Topologia Multi-Terminal Implementada (Fase 6)

A arquitetura para suportar múltiplos terminais na mesma rede local (LAN) foi implementada com sucesso.

## O que foi implementado?

### 1. Extensão da Base de Dados Local (Prisma)
- Foram adicionadas três novas colunas à tabela `Settings` do SQLite:
  - `terminalMode`: Define se o PC é um `MASTER` ou um `TERMINAL`.
  - `masterIp`: Guarda o endereço IP do PC principal (usado pelo Terminal para saber onde ligar).
  - `lanSecret`: Um token partilhado opcional para autenticar as ligações na rede local.

### 2. IPCs e Background Process (Electron)
- Adicionados canais IPC (`lan:get-local-ip`, `lan:get-config`, `lan:set-config`) para permitir ao Frontend interagir com as definições de rede.
- O arranque do Servidor Express Local (em `background.ts`) foi condicionado: **só arranca se o modo for MASTER** (evitando conflitos de portas e garantindo que os Terminais são apenas clientes).

### 3. Servidor Local REST (API do Master)
- O `server.ts` foi expandido para escutar na interface `0.0.0.0` (acessível na rede LAN, não apenas em localhost).
- Implementado o **Middleware de Autenticação LAN**, que verifica o header `X-LAN-Secret`. Se configurado, qualquer PC cliente terá que enviar a mesma password para aceder aos dados.
- Foram criadas as rotas `GET /api/items`, `GET /api/clients`, `GET /api/cash-sessions/current` e `POST /api/invoice` para permitir ao Terminal consultar os dados vitais diretamente na base de dados do Master e registar facturas.

### 4. Cliente Dinâmico no Frontend (Axios)
- O ficheiro `api.ts` foi refatorado. Foi criada uma nova instância `localApi` com um interceptor inteligente.
- O `localApi` verifica automaticamente a configuração: se o modo for `TERMINAL`, injeta dinamicamente o `baseURL` do Master (`http://<ip-do-master>:3333/api`) e o header `X-LAN-Secret`. Se for `MASTER`, aponta para `http://127.0.0.1:3333/api`.
- Também injeta automaticamente o `storeId` nas requisições.

### 5. Interface de Configuração (Setup UI)
- Criada uma nova aba **"Rede Local"** nas Definições do POS.
- Nesta página, o utilizador pode:
  - Ver o IP Local da sua máquina.
  - Alternar entre os modos **Master** e **Terminal**.
  - Configurar o IP do Master e o Segredo LAN.
  - Testar a ligação diretamente no ecrã antes de guardar.

## Melhorias de Estabilidade Offline (Ajustes de Sessão)

- **Expiração de Sessão Alinhada com a Licença Offline**: A expiração do token de sessão no frontend foi aumentada de **24 horas para 30 dias**. Isto previne que utilizadores a operar em modo offline prolongado (dentro do período da licença offline de 30 dias) sejam subitamente desconectados sem internet para re-autenticação.
- **Tratamento Silencioso de Sessão Expirada (`JWTExpired`)**: O erro `JWTExpired` lançado pela biblioteca `jose` ao validar o token de sessão local passa a ser capturado de forma limpa. A aplicação gera um aviso controlado em vez de lançar uma exceção vermelha com stack trace no console, limpando de seguida a sessão local inválida para evitar repetições no arranque.

## Como testar?

> [!TIP]
> **Simulação num único PC (Development)**
> 1. Inicie a aplicação normalmente.
> 2. Vá a **Definições > Rede Local**.
> 3. Altere o modo para **Terminal** e defina o IP do Master para `127.0.0.1` (o próprio PC).
> 4. Clique em "Testar" para validar que a ligação ao servidor funciona.
> 5. Para testar com dois PCs: Instale noutro PC na mesma rede de Wi-Fi/Cabo, selecione Terminal e coloque o IP exibido no ecrã do PC Master.

A partir de agora, as fundações estão preparadas. Para as próximas iterações (se necessário), podemos aplicar o `localApi` a todas as chamadas de items/clients no POS, para que o fluxo de checkout use ativamente esta rota.
