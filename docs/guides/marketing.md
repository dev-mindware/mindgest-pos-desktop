# 🧠 MindGest POS Desktop — Documento de Marketing

> **Sistema corporativo de Faturação e Ponto de Venda com Inteligência Artificial, Resiliência Offline e Conformidade Fiscal AGT.**

---

## 📌 Visão Geral do Produto

O **MindGest POS Desktop** é uma solução de Ponto de Venda (POS) de nível empresarial, desenvolvida para o mercado angolano, que combina robustez offline com inteligência artificial integrada. Construída para negócios que não podem parar — mesmo sem internet.

Ao contrário de soluções SaaS dependentes de nuvem, o MindGest POS funciona **100% offline** e sincroniza de forma invisível quando a conectividade retorna, garantindo que cada venda, fatura e recibo é registado com segurança, mesmo em falhas de energia ou rede.

---

## 🎯 Público-Alvo

| Segmento | Perfil |
|---|---|
| **Pequeno Comércio** | Lojas únicas, mercearias, boutiques, cafés |
| **Médias Empresas** | Supermercados, redes de lojas com múltiplos terminais |
| **Retalho Alimentar** | Negócios com produtos perecíveis e controlo de validade |
| **Setores Regulados** | Empresas obrigadas a emissão fiscal AGT (Angola) |
| **Franquias** | Redes com necessidade de gestão centralizada e terminais distribuídos |

---

## 💡 Proposta de Valor Única (USP)

### "A caixa que nunca para — com inteligência que maximiza cada venda."

1. **Zero downtime de faturação** — Opera offline sem limitações. Quando a internet volta, sincroniza automaticamente.
2. **Conformidade fiscal nativa** — Totalmente integrado com as exigências da AGT (Angola), incluindo séries, hashes encadeados e assinaturas RSA.
3. **Inteligência de vendas embutida** — Motor de recomendação por ML, preços dinâmicos e deteção de fraude por visão computacional.
4. **Licença anti-pirataria física** — Hardware fingerprinting impede cópias não autorizadas do software.
5. **Assistente IA no caixa** — Suporte contextual com IA generativa (Gemini) sem sair do ecrã de vendas.

---

## 🌟 Funcionalidades Principais

### 🔴 Core — Ponto de Venda

- **Ecrã de Counter/Caixa** — Interface tátil otimizada para velocidade de operação
- **Pesquisa rápida de produtos** — Por código de barras, nome ou referência
- **Carrinho de compras inteligente** — Adição, remoção e edição em tempo real
- **Múltiplos métodos de pagamento** — Numerário, transferência, cartão e mixtos
- **Cálculo automático de troco** — Com validação em tempo real
- **Teclado virtual integrado** — Para ecrãs táteis sem teclado físico
- **Impressão térmica de talão** — Suporte a impressoras térmicas nativas

### 🟡 Faturação & Documentos Fiscais

- **Faturas Fiscais (FR/FT)** — Com numeração AGT oficial e hashes encadeados
- **Proformas** — Orçamentos antes da confirmação de venda
- **Notas de Crédito (NC)** — Gestão de devoluções e cancelamentos
- **Recibos** — Emissão automática pós-pagamento
- **Geração de PDF profissional** — Formato A4 e talão térmico
- **Exportação SAF-T** — Arquivo XML para auditoria fiscal
- **Assinatura RSA local** — Documentos assinados digitalmente offline
- **Séries AGT atômicas** — Numeração garantida sem duplicados em multi-terminal

### 🟢 Gestão Offline-First

- **Persistência local em SQLite** — Dados nunca se perdem (sem internet, sem servidor)
- **Outbox Pattern** — Fila de sincronização que garante a ordem correta de envio
- **Sincronização bidirecional** — Cloud → Local (preços, produtos) e Local → Cloud (faturas, movimentos)
- **Deteção automática de conectividade** — UI adapta-se silenciosamente ao estado da rede
- **Pull de atualizações em background** — Preços e catálogo atualizados sem interrupção

### 🔵 Gestão de Caixa

- **Abertura e fecho de turnos** — Com saldo inicial e final
- **Movimentos de caixa** — Reforços (IN), sangrias (OUT) e vendas (SALE)
- **Relatórios de sessão** — Totais de venda e caixa por turno
- **Histórico de documentos** — Arquivo completo de FR, PP e NC

### 🟣 Catálogo & Clientes

- **Gestão de produtos** — Com categorias, código de barras, preço e IVA
- **Base de clientes** — Com NIF, contacto e histórico de compras
- **Sincronização automática** — Catálogo e clientes importados da cloud
- **Controlo de stock** — Baixa JIT (Just-In-Time) por linha de fatura

---

## 🧠 Módulo MIND — Inteligência Artificial Integrada

O sistema **MIND** é o diferencial competitivo do MindGest POS. É um motor de IA local que opera em paralelo, sem impactar a performance do caixa.

### 1. 🏷️ Precificação Dinâmica Automática

O sistema reduz automaticamente preços de produtos com base em:

| Fator | Ação |
|---|---|
| Últimas 2h antes do fecho | Desconto progressivo por tempo |
| Stock > 50 unidades | Ajuste promocional automático |
| Produto a expirar hoje/amanhã | Corte máximo de preço |
| Poder de compra local | Desconto calibrado por zona |

> Pode ser ativado/desativado pelo administrador. Protege a margem sem esforço humano.

### 2. 🛒 Motor de Recomendação por Machine Learning

- Treina um modelo **Apriori (Association Rules)** com as últimas 1.000 faturas reais
- Sugere **no máximo 2 produtos complementares** ao operador de caixa
- Exemplo de regra aprendida: *"Quem compra Cerveja, também leva Amendoins"*
- Interface discreta — botão ✨ que pulsa ao adicionar produtos ao cesto
- Aumenta o **ticket médio** de forma não intrusiva

### 3. 👁️ Prevenção de Fraude por Visão Computacional (YOLOv8)

- Ligado à webcam da loja
- Ativa-se automaticamente em momentos de risco:
  - Cancelamento de artigos em linha
  - Abertura de gaveta sem venda registada
- Usa **YOLOv8n** (modelo ultraligeiro) para contar pessoas no campo visual
- Se apenas 1 pessoa for detetada (sem cliente), gera **Alerta de Fraude** na gestão central
- **Não pode ser desativado pelo operador** — segurança obrigatória

### 4. 💬 Assistente IA (MIND Chat)

- Assistente contextual disponível em qualquer ecrã do POS
- Motor: **Google Gemini 1.5 Flash** (cloud) + **Ollama local** (offline)
- Conhecimento profundo dos fluxos de trabalho do MindGest POS
- Respostas com efeito de digitação progressiva (typewriter effect)
- Histórico persistente por utilizador (localStorage)
- Sugestões de perguntas frequentes no painel inicial

---

## 🔐 Segurança e Anti-Pirataria

### Hardware Fingerprinting + JWT Offline

```
Login Online → Recolha CPU/Motherboard Serial → Cloud emite JWT RSA → Guardado localmente
                                                                    ↓
                                              Validação em cada arranque (offline)
```

- JWT contém: `tenant_id`, `expire_date`, `hardware_id`, `permissions`
- Se hardware mudar ou licença expirar → **Lockdown automático**

### Relógio Monotónico (Anti-Time-Travel)

- Protege contra fraude de datas (ex: retroceder relógio do Windows para falsificar faturas ou evitar expiração de subscrição)
- Cada transação regista timestamp absoluto
- Se hora do sistema < hora da última fatura → **Aplicação bloqueada**

### Encriptação de Dados

- Base de dados SQLite encriptada com **SQLCipher (AES-256)**
- Chave RSA Privada (AGT) protegida no **Windows Credential Manager**
- Nunca exposta em texto limpo no sistema de ficheiros

---

## 🏗️ Arquitetura Técnica

```
┌─────────────────────────────────────────────────────────────────┐
│                    MindGest POS Desktop                         │
│                                                                 │
│  ┌─────────────┐    IPC    ┌──────────────────────────────────┐ │
│  │  Frontend   │ ←──────→  │    Main Process (Node.js)        │ │
│  │  Next.js 15 │           │    + Express API local           │ │
│  │  React 19   │           │    + Prisma ORM                  │ │
│  │  TailwindCSS│           │    + SQLite (better-sqlite3)     │ │
│  │  Zustand    │           │    + SQLCipher (AES-256)         │ │
│  └─────────────┘           └──────────────────────────────────┘ │
│         │                             │                          │
│         │ HTTP localhost              │ Sync                     │
│         ↓                             ↓                          │
│  ┌──────────────┐         ┌──────────────────────────────────┐  │
│  │ Python MS    │         │  MIND Microservice (Python)      │  │
│  │ (porta 3002) │         │  (porta 5001)                    │  │
│  │ FastAPI      │         │  FastAPI + YOLOv8 + Apriori ML  │  │
│  │ ReportLab    │         │  + Gemini API + Ollama LLM      │  │
│  │ PDFs/XMLs    │         └──────────────────────────────────┘  │
│  └──────────────┘                                               │
└─────────────────────────────────────────────────────────────────┘
                         ↕ Outbox Sync (quando há internet)
                    ┌────────────────────────┐
                    │    MindGest Cloud API  │
                    │    (PostgreSQL + AGT)  │
                    └────────────────────────┘
```

### Stack Tecnológica Completa

| Camada | Tecnologia |
|---|---|
| Framework Desktop | Electron 33 via Nextron |
| Frontend | Next.js 15, React 19, TailwindCSS |
| Estado Local | Zustand 5 |
| Estado Servidor | TanStack Query (React Query) |
| UI Components | Radix UI + shadcn/ui |
| Base de Dados Local | SQLite via better-sqlite3 |
| ORM | Prisma 5 |
| Encriptação DB | SQLCipher |
| Geração PDFs | Python FastAPI + ReportLab |
| ML Recomendações | Pandas + MLxtend (Apriori) |
| Visão Computacional | OpenCV + YOLOv8n (Ultralytics) |
| IA Assistente | Google Gemini 1.5 Flash + Ollama |
| Licenciamento | JWT RS256 + Hardware ID |
| Auto-Update | electron-updater |
| Comunicação Inter-Process | IPC Electron + Express REST |

---

## 🖥️ Topologias de Implementação

### Cenário A — Single Terminal (Loja Pequena)

```
[PC Único] → SQLite Local → Printer → Sync Cloud
```

Ideal para: Cafés, boutiques, lojas de bairro, prestadores de serviços.

### Cenário B — Multi-Terminal (Supermercados)

```
[PC Master] ←─ LAN REST API ─→ [Caixa 2]
     ↓                              ↓
 SQLite Master               (usa DB do Master)
     ↓
 Sync Cloud
```

Ideal para: Supermercados, minimercados, redes de loja com múltiplos caixas.

- **Terminal Master**: Aloja a base de dados oficial e expõe API REST na LAN
- **Terminais Slave**: Conectam ao IP do Master via configuração
- **Concorrência**: Node.js gere escritas atômicas sem bloqueios de base de dados

---

## 🔄 Conformidade Fiscal AGT (Angola)

O MindGest POS é construído de raiz para o mercado angolano e cumpre rigorosamente os requisitos da **AGT (Administração Geral Tributária)**:

- ✅ **Séries AGT** solicitadas diretamente à AGT via API oficial
- ✅ **Numeração atómica** sem duplicados em multi-terminal
- ✅ **Hashes encadeados** entre documentos da mesma série
- ✅ **Assinatura JWS** com chave do software produtor e chave do contribuinte
- ✅ **Exportação SAF-T** em formato XML para auditoria
- ✅ **Tipos de documento**: Fatura, Fatura-Recibo, Proforma, Nota de Crédito
- ✅ **Operação offline**: Faturas com número AGT atribuído localmente, sync posterior sem renumeração

---

## 📊 Diferenciação Competitiva

| Funcionalidade | MindGest POS | POS Genérico (SaaS) | Solução Local Simples |
|---|:---:|:---:|:---:|
| Funciona sem internet | ✅ Total | ❌ Depende | ✅ Parcial |
| Conformidade AGT nativa | ✅ | ❌ Raramente | ❌ |
| IA de Recomendações | ✅ | ❌ | ❌ |
| Preços Dinâmicos Automáticos | ✅ | ❌ | ❌ |
| Deteção de Fraude Visual | ✅ | ❌ | ❌ |
| Assistente IA no Caixa | ✅ | ❌ | ❌ |
| Anti-pirataria Hardware Lock | ✅ | N/A | ❌ |
| Multi-terminal LAN | ✅ | ✅ (cloud) | ❌ |
| Auto-update silencioso | ✅ | ✅ | ❌ |
| Impressão térmica nativa | ✅ | Limitado | ✅ |
| Encriptação de base de dados | ✅ AES-256 | ❌ | ❌ |

---

## 🚀 Atualizações Automáticas (Zero Downtime)

O sistema de auto-update garante que os clientes sempre têm a versão mais recente:

1. Ao iniciar (com internet), verifica silenciosamente nova versão
2. Download em background — o operador continua a faturar
3. Notificação discreta: *"Nova versão pronta. Reinicie para aplicar"*
4. Instalação atómica ao reiniciar — sem intervenção técnica necessária

---

## 📦 Modelo de Distribuição

- **Instalador nativo** — `.exe` (Windows) / `.dmg` (macOS)
- **Licença por hardware** — Ligada ao número de série da máquina
- **Subscrição com renovação** — Validação via JWT com data de expiração
- **Microserviços bundled** — Python MS pode ser distribuído junto ou como container Docker
- **Updates via GitHub Releases** ou S3 Bucket privado

---

## 📈 Argumentos de Venda por Segmento

### Para Donos de Negócio
> *"Nunca perca uma venda por falha de internet. O MindGest POS fatura mesmo sem rede — e quando a internet volta, sincroniza tudo automaticamente."*

### Para Gestores de Loja
> *"Deteção automática de fraude na caixa. Saiba em tempo real se algo suspeito está a acontecer, sem precisar de câmeras extra ou pessoal de segurança."*

### Para Contabilistas / Responsáveis Fiscais
> *"Conformidade AGT nativa, faturas com hashes encadeados, exportação SAF-T e assinatura digital. Auditoria fiscal sem dores de cabeça."*

### Para Redes de Lojas / Franchisados
> *"Um sistema que escala: do terminal único à rede de 20 caixas em LAN, sem mudar de software nem de servidor."*

---

## 🗺️ Roadmap Atual (Estado do Desenvolvimento)

| Fase | Estado | Descrição |
|---|:---:|---|
| Fase 1 — Fundação Core | ✅ Completo | Prisma, SQLite, IPC, esquema base |
| Fase 2 — Segurança & Auth | ✅ Completo | Hardware Fingerprint, JWT, Relógio Monotónico |
| Fase 3 — Master Data & Sync | 🔄 Em progresso | Catálogo, Clientes, SyncWorker |
| Fase 4 — Invoicing & AGT | 🔄 Em progresso | Counter UI, Checkout, PDFs AGT |
| Fase 5 — Sync Bidirecional | ✅ Completo | Outbox, CronJob, Pull de Cloud |
| Fase 6 — Multi-Terminal | ⏳ Planeado | API LAN, Master/Slave setup |
| Fase 7 — Auto-Updater | ⏳ Planeado | electron-updater, UI de update |
| Fase 8 — Piloto & Homologação | ⏳ Planeado | E2E testing, build final |

---

## 🔑 Mensagens-Chave de Marketing

### Taglines Sugeridas
- *"Fatura sempre. Mesmo sem internet."*
- *"O POS que pensa — e nunca para."*
- *"Inteligência no caixa. Segurança no negócio."*
- *"A solução POS feita para Angola."*
- *"Do talão à AGT: tudo automático."*

### Pontos de Dor Resolvidos

| Problema do Cliente | Solução MindGest |
|---|---|
| "A internet caiu e não consigo faturar" | Opera 100% offline, sincroniza depois |
| "Tenho medo que os funcionários me roubem" | YOLOv8 deteta comportamento suspeito |
| "Perco vendas porque não sei o que recomendar" | ML sugere produtos complementares |
| "A conformidade fiscal é uma dor de cabeça" | AGT 100% nativo e automatizado |
| "Tenho várias caixas e elas não comunicam" | Multi-terminal via LAN sem servidor externo |
| "O software pirata vai destruir o meu negócio" | Licença ligada ao hardware — intransferível |
| "Não sei usar o sistema" | Assistente IA responde em tempo real no caixa |

---

## 📞 Canais de Marketing Recomendados

### Digital
- **LinkedIn B2B** — Gestores de negócio, diretores financeiros, contabilistas
- **Facebook/Instagram** — Pequenos e médios negócios (targeting Angola)
- **YouTube** — Demos do produto: offline mode, MIND AI, impressão de talão
- **WhatsApp Business** — Canal de suporte e demonstrações

### Conteúdo
- Vídeo demo: *"O que acontece quando a internet cai durante uma venda"*
- Case study: *"Como um supermercado em Luanda aumentou 15% o ticket médio com recomendações IA"*
- Webinar: *"Conformidade AGT 2026 — o que precisa de saber"*
- Blog: *"Offline-First: por que os melhores POS não dependem de internet"*

### Parcerias Estratégicas
- **Contabilistas e TOCs** — Referência direta para clientes que precisam de conformidade fiscal
- **Distribuidores de hardware POS** — Bundle com impressoras térmicas e terminais
- **Câmaras de Comércio** — Eventos B2B e networking em Angola
- **AGT/Governo** — Certificação e promoção como solução compliant

---

## 📋 Ficha Técnica Resumida

| Campo | Detalhe |
|---|---|
| **Nome do Produto** | MindGest POS Desktop |
| **Versão Atual** | 1.0.0 |
| **Plataforma** | Windows (principal), macOS (suportado) |
| **Tipo de Licença** | Proprietária — uso exclusivo MindGest |
| **Modelo de Negócio** | Subscrição + Licença por hardware |
| **Linguagem Base** | TypeScript (Electron/Next.js) + Python (microserviços) |
| **Base de Dados** | SQLite local (encriptado) + Cloud (PostgreSQL) |
| **Requisitos Mínimos** | Node.js 18+, Python 3.10+, Windows 10+ |
| **Mercado Principal** | Angola (conformidade AGT) |
| **Idioma** | Português |
| **App ID** | com.mindgest.pos |

---

*Documento gerado automaticamente a partir da análise técnica do repositório `mindgest-pos-desktop`. Última revisão: Julho 2026.*
