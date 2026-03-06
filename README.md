# MindGest POS - Desktop Edition

Sistema corporativo de Faturação e Ponto de Venda (POS), construído como uma aplicação nativa para Desktop focada em **Resiliência Offline** e **Alta Performance**.

## 🚀 Tecnologias e Arquitetura

Este projeto utiliza uma arquitetura híbrida de múltiplos processos:

- **Frontend (Renderer)**: Next.js (React), TailwindCSS, Zustand (State Management).
- **Backend (Main Process)**: Electron, Node.js.
- **Persistência Offline**: `better-sqlite3` rodando diretamente no processo nativo do Electron via ponte IPC. Garante que os dados (Faturas, Clientes, Produtos) nunca se percam mesmo em caso de falha de energia.
- **Motores de Documentos**: Microserviço local em Python (FastAPI) dedicado à geração de PDFs complexos (A4, Talão, SAF-T) quando o sistema está offline.

---

## 🛠️ Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- **Node.js** (v18 ou superior)
- **pnpm** (Gerenciador de pacotes rápido)
- **Python** (v3.10 ou superior) - _Necessário para o microserviço de PDFs e compilação do SQLite nativo_.

---

## 📦 Inicialização Rápida (Quick Start)

Para inicializar o ambiente de desenvolvimento pela primeira vez, siga estes passos:

### 1. Aplicação Principal (Electron + Next.js)

1. Clone o repositório e acesse a pasta raiz:
   ```bash
   cd mindgest-pos-desktop
   ```
2. Instale as dependências. Como este projeto compila módulos nativos C++ (`better-sqlite3`), é essencial usar o comando completo para reconstruir os binários para a arquitetura local:
   ```bash
   pnpm install
   npx electron-builder install-app-deps
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   pnpm dev
   ```

### 2. Microserviço de Geração de PDFs (Python)

A aplicação POS _precisa_ deste serviço rodando localmente para emitir documentos quando a internet cair.

1. Abra uma **nova janela** no terminal e acesse a pasta do microserviço:
   ```bash
   cd python-microservice
   ```
2. Instale as dependências (cria o ambiente virtual automaticamente):
   ```bash
   .\setup.bat
   ```
3. Inicie o servidor localmente (Porta 3002):
   ```bash
   .\start.bat
   ```

### 3. Microserviço MIND (Inteligência & Prevenção)

A aplicação comunica com este serviço na porta 5001 para gerar recomendações, checar fraudes e comunicar com a IA do Chat.

1. Abra uma **nova janela** no terminal e acesse a pasta do microserviço:
   ```bash
   cd mind-microservice
   ```
2. Ative o ambiente virtual e instale as dependências:

   ```bash
   # No Windows (PowerShell/CMD):
   .\venv\Scripts\activate

   # Em seguida, instale os pacotes:
   pip install -r requirements.txt
   ```

3. Inicie o servidor localmente (Porta 5001):
   ```bash
   uvicorn main:app --port 5001 --reload
   ```

### 4. Motor de IA Local (Ollama)

O Assistente MIND AI no frontend precisa que o Ollama esteja ativado na máquina como motor _LLM_.

1. Baixe e instale do site oficial [Ollama](https://ollama.com/).
2. Abra um terminal e inicie o modelo base escolhido (ex: `llama3`):
   ```bash
   ollama run llama3
   ```
3. A API do Ollama deve ficar a escutar automaticamente na porta (11434) onde o `mind-microservice` se conectará em background.

---

## ⚡ Fluxo de Modo Offline (Resiliência)

Esta aplicação foi desenhada para nunca parar de faturar:

1. Se a internet falhar (`navigator.onLine` e ping a servidores reais), a UI muda silenciosamente para o modo **Offline**.
2. Faturas, Proformas e Recibos são gravados de forma _assíncrona_ no SQLite nativo.
3. A impressão de PDFs é interceptada e enviada para o Microserviço Python Local.
4. Quando a internet volta, o _Sync Handler_ envia a fila de documentos estocada no SQLite para o servidor da Nuvem na ordem correta, em background.

---

## 📦 Criação de Executável (Build p/ Produção)

Para criar o instalador `.exe` (ou `.dmg` no Mac) para distribuir aos clientes:

1. Certifique-se de estar na raiz do projeto (`mindgest-pos-desktop`).
2. Rode o comando de compilação do Nextron:
   ```bash
   pnpm build
   ```
3. **Atenção**: O comando acima criará, por padrão, as pastas `dist/` ou `release/` contendo o instalador compilado do sistema, empacotando junto o banco de dados nativo do SQLite. O microserviço Python precisa ser distribuído paralelamente no ambiente de produção do cliente caso desejem geração local autônoma.

---

## 📄 Licença

Uso exclusivo MindGest. Proibida distribuição não autorizada.
