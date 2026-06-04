
## Checklist

### Fase 1: Fundação do Sistema (Local Core)
- [x] Configurar Prisma ORM e estabelecer a ligação base com SQLite.
- [x] Criar o esquema base no Prisma (Users, Items, Clients, Invoices, SyncOutbox).
- [x] Implementar as pontes de comunicação (IPC) seguras entre Frontend (React) e Main (Node.js).
- [x] Teste F1: Conexão DB, leitura, escrita e log no terminal.

### Fase 2: Segurança & Autenticação (Anti-Tampering)
- [x] Desenvolver gerador de Hardware Fingerprint (Node.js/Electron).
- [x] Integrar Login Online com MindGest API.
- [x] Implementar a recepção, armazenamento e decodificação do JWT Offline.
- [x] Implementar o "Relógio Monotónico" (Validação de timestamp preventivo).
- [x] Implement PosSessionGuard com bypass para Administração (OWNER/MANAGER).
- [x] Teste F2: Validação de Login Online em Produção, Hardware Fingerprinting e Licenciamento Offline (30 dias).

### Fase 3: Operação e Sincronização (Master Data)
- [x] Visualização de Catálogo de Items (Sincronizado da Cloud).
- [x] Visualização de Base de Clientes (Sincronizado da Cloud).
- [x] Implementar Gestão de Sessões de Caixa (Abertura/Fecho de Turnos Local).
- [2/3] Redesenhar Arquivo de Documentos (Tabs FR/PP/NC) com leitura SQLite.
- [x] Implementar SyncWorker (Background process para enviar SyncOutbox para API).
- [ ] Teste F3: Sincronizar 1000 itens da Cloud e consultar offline com performance.

### Fase 4: O Coração do POS (Invoicing & AGT)
- [1/2] UI do Counter (Carrinho, Pesquisa Rápida de Produtos).
- [1/2] Fluxo de Checkout (Métodos de Pagamento, Troco).
- [x] Lógica de Hashes AGT (Gerar Chaves RSA offline, encadear Hashes de faturas).
- [1/2] Comunicação com o Python Microservice Offline para gerar e imprimir o PDF da Fatura.
- [ ] Teste F4: Emitir 10 faturas seguidas. Validar Nº da Factura AGT e integridade da impressão térmica.

### Fase 5: Sincronização Bidirecional (Outbox & Sync)
- [x] Implementar a tabela e lógica `sync_outbox` no Prisma.
- [x] Criar o CronJob em background para deteção de conectividade (Network Polling).
- [x] Implementar rotas na Cloud (MINDGEST-API) para receber os lotes (Batch Processing).
- [x] Implementar o Pull (Cloud -> Local) para atualizações de preços em tempo real.
- [x] Teste F5: Faturar offline. Ligar internet. Confirmar na Cloud se dados chegaram. Mudar preço na cloud, verificar se POS localizou.

### Fase 6: Topologia Multi-Terminal
- [x] Criar API Server (Express/Next API) no Main Process para aceitar ligações LAN.
- [x] Adicionar ecrã de setup inicial: "Este PC é Master ou Terminal?".
- [x] Configurar o cliente Axios no Frontend para suportar BaseURL dinâmico.
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
