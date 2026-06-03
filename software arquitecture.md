# MindGest POS - Arquitetura de Software e Roadmap de Implementação

Este documento detalha a arquitetura técnica, os fluxos de dados, os mecanismos de segurança e o roadmap de implementação para a versão Desktop do MindGest POS (Offline-First).

---

## 1. Visão Geral do Sistema

O MindGest POS Desktop é uma aplicação corporativa desenhada para operar de forma resiliente em ambientes com conectividade de rede instável (Offline-First). O foco central é garantir a continuidade das operações de venda (Ponto de Venda), salvaguardando a integridade fiscal (AGT) e a segurança contra adulterações (Anti-Tampering).

## 2. Arquitetura Core

O sistema assenta numa arquitetura híbrida de múltiplos processos, operando num único executável (`.exe`), com microserviços acoplados para tarefas pesadas.

*   **Host Framework:** Electron (via Nextron).
*   **Frontend (Renderer):** Next.js 15, TailwindCSS, Zustand (Gestão de Estado Local), TanStack Query (Gestão de Estado de Servidor/Cache).
*   **Backend Embutido (Main Process):** Node.js operando como servidor local.
*   **Base de Dados:** SQLite (`better-sqlite3`) gerido através do **Prisma ORM**.
*   **Segurança de Dados:** SQLCipher (Encriptação da base de dados em repouso).
*   **Microserviço Externo:** Python Microservice para processamento pesado (Geração de PDFs, parsing de XML/SAF-T).

## 3. Topologia de Implementação (Single & Multi-Terminal)

A arquitetura foi desenhada para se adaptar ao tamanho do retalhista sem alterar a stack tecnológica.

### Cenário A: Single Terminal (Loja Pequena)
*   O executável (Electron) corre numa única máquina.
*   O Frontend comunica diretamente com o Backend embutido via IPC (Inter-Process Communication) ou API REST em `localhost`.
*   A base de dados SQLite reside localmente no disco.

### Cenário B: Multi-Terminal (Supermercados)
*   **Terminal Master (Servidor Local):** A aplicação corre no PC principal da loja. Este PC alberga a base de dados SQLite oficial e expõe uma API REST local (ex: `http://192.168.1.100:3000/api`).
*   **Terminais Slave (Caixas Secundárias):** Instalam o mesmo executável, mas configurados em "Modo Terminal". O Axios (Frontend) não acede a uma base local, mas sim ao IP do Terminal Master.
*   **Concorrência:** O Node.js no Terminal Master recebe os pedidos concorrentes e gere as escritas no SQLite de forma assíncrona, evitando bloqueios (Database Locks) e garantindo integridade de stock (Just-In-Time validation).

---

## 4. Segurança e Anti-Craqueamento (Anti-Tampering)

O ambiente offline é altamente suscetível a pirataria. Foram desenhados três pilares de proteção:

### 4.1. Hardware Fingerprinting & Licenciamento JWT
1.  **Online Login Inicial:** O utilizador faz login (requer internet). O Main Process (Electron) recolhe o Serial Number da Motherboard e CPU.
2.  **Emissão de Licença:** A Cloud do MindGest recebe o Hardware ID e emite um **JWT Offline** assinado com uma Chave RSA Privada. O JWT contém: `tenant_id`, `expire_date`, `hardware_id`, `permissions`.
3.  **Validação de Arranque:** Sempre que o POS abre (Offline), verifica a assinatura do JWT (com a Chave Pública embutida no código) e compara o Hardware ID atual com o do JWT. Se falhar, a app entra em *Lockdown*.

### 4.2. Relógio Monotónico (Proteção contra Time-Travel)
Para evitar que o utilizador atrase a data do Windows para não pagar a subscrição ou falsificar datas na AGT:
*   Cada transação no SQLite regista o timestamp absoluto. Se o sistema detectar que a hora do Sistema Operativo atual é **inferior** à hora da última fatura emitida, a aplicação é bloqueada.

### 4.3. Encriptação de Chaves Fiscais
A Chave RSA Privada da Empresa (para assinar os hashes da AGT localmente) nunca fica exposta em texto limpo. É encriptada usando AES-256 e protegida no Windows Credential Manager.

---

## 5. Fluxo de Sincronização (Outbox Pattern)

O sistema deve operar 100% offline e sincronizar de forma invisível quando a rede volta.

1.  **Operação Local:** Faturas, criação de clientes e baixas de stock são escritas no SQLite.
2.  **Tabela Outbox:** Por cada ação, é criado um registo na tabela `sync_outbox` com o formato JSON do payload e o status `PENDING`.
3.  **CronJob de Sincronização:** Um processo em background verifica a cada 30 segundos se há internet (via ping).
4.  **Batch Upload:** Se houver internet, envia os registos em fila para a Cloud (MindGest API). Após sucesso, marca como `SYNCED`.
5.  **Pull de Cloud:** Paralelamente, descarrega alterações feitas no backoffice web (novos produtos, alterações de preços) e atualiza o SQLite local via *Upsert*.

---

## 6. Sistema de Atualizações Automáticas (Auto-Updater)

A flexibilidade de instalar novas features sem intervenção técnica será gerida pelo `electron-updater`.

1.  **Distribuição:** Os builds finais são alojados no GitHub Releases ou num S3 Bucket.
2.  **Verificação em Background:** Ao iniciar (com internet), o Electron verifica silenciosamente a versão.
3.  **Download Invisível:** A atualização é descarregada em background. O utilizador continua a faturar.
4.  **Aviso de Update:** Um ícone na UI notifica: "Nova versão pronta. Reinicie para aplicar".
5.  **Instalação Segura:** Ao reiniciar, o executável é substituído de forma atómica.

---

## 7. Roadmap de Implementação e Checklist

Esta checklist assegura um desenvolvimento iterativo. A regra é: **Não avançar para a próxima fase sem a fase atual estar 100% testada e robusta.**

### Fase 1: Fundação do Sistema (Local Core)
- [x] Configurar Prisma ORM e estabelecer a ligação base com SQLite.
- [x] Criar o esquema base no Prisma (Users, Items, Clients, Invoices, SyncOutbox).
- [x] Implementar as pontes de comunicação (IPC) seguras entre Frontend (React) e Main (Node.js).
- [x] Teste F1: Conexão DB, leitura, escrita e log no terminal.

### Fase 2: Segurança & Autenticação (Anti-Tampering)
- [x] Desenvolver gerador de Hardware Fingerprint (Node.js/Electron).
- [x] Integrar Login Online com MindGest API.
- [x] Implementar a receção, armazenamento e decodificação do JWT Offline.
- [x] Implementar o "Relógio Monotónico" (Validação de timestamp preventivo).
- [x] Implement PosSessionGuard com bypass para Administração (OWNER/MANAGER).
- [x] Teste F2: Validação de Login Online em Produção, Hardware Fingerprinting e Licenciamento Offline (30 dias).

### Fase 3: Operação e Sincronização (Master Data)
- [x] Visualização de Catálogo de Items (Sincronizado da Cloud).
- [x] Visualização de Base de Clientes (Sincronizado da Cloud).
- [x] Implementar Gestão de Sessões de Caixa (Abertura/Fecho de Turnos Local).
- [x] Redesenhar Arquivo de Documentos (Tabs FR/PP/NC) com leitura SQLite.
- [x] Implementar SyncWorker (Background process para enviar SyncOutbox para API).
- [] Teste F3: Sincronizar 1000 itens da Cloud e consultar offline com performance.

### Fase 4: O Coração do POS (Invoicing & AGT)
- [ ] UI do Counter (Carrinho, Pesquisa Rápida de Produtos).
- [ ] Fluxo de Checkout (Métodos de Pagamento, Troco).
- [x] Lógica de Criação de Facturas Offline.
- [ ] Comunicação com o Python Microservice para gerar e imprimir o PDF da Fatura.
- [ ] Teste F4: Emitir 10 faturas seguidas. Validar Hashes AGT e integridade da impressão térmica.

### Fase 5: Sincronização Bidirecional (Outbox & Sync)
- [x] Implementar a tabela e lógica `sync_outbox` no Prisma.
- [x] Criar o CronJob em background para deteção de conectividade (Network Polling).
- [x] Implementar rotas na Cloud (MINDGEST-API) para receber os lotes (Batch Processing).
- [x] Implementar o Pull (Cloud -> Local) para atualizações de preços em tempo real.
- [x] Teste F5: Faturar offline. Ligar internet. Confirmar na Cloud se dados chegaram. Mudar preço na cloud, verificar se POS localizou.

### Fase 6: Topologia Multi-Terminal
- [ ] Criar API Server (Express/Next API) no Main Process para aceitar ligações LAN.
- [ ] Adicionar ecrã de setup inicial: "Este PC é Master ou Terminal?".
- [ ] Configurar o cliente Axios no Frontend para suportar BaseURL dinâmico.
- [ ] Teste F6: Ligar PC 2 ao PC 1. Faturar num, confirmar se o stock desconta no outro instantaneamente.

### Fase 7: Auto-Updater e Polimento
- [ ] Integrar `electron-updater` e configurar provedor de releases (ex: GitHub).
- [ ] Criar UI para notificar atualizações e estado de progresso de download.
- [ ] Refinar as notificações locais (Sonner/Toast).
- [ ] Teste F7: Publicar versão 1.0.1 falsa, abrir a v1.0.0 e ver o auto-update a atuar.

### Fase 8: Teste Piloto e Homologação
- [ ] End-to-End Testing (E2E).
- [ ] Auditoria final de performance no SQLite (Índices).
- [ ] Preparar instaladores finais (.exe / .dmg).
