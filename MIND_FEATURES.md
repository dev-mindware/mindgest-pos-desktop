# Sistema MIND - Inteligência e Prevenção para o POS

O sistema **MIND** é um módulo de inteligência e automação desenhado para otimizar vendas, reduzir o desperdício de stock e prevenir fraudes operacionais.

Para máxima performance e isolamento do resto do sistema POS, a MIND corre no seu próprio ecossistema independente: o **Mind Microservice (Python)**, comunicando localmente com o Nextron na **porta 5001**.

---

## 1. Precificação Dinâmica (Dynamic Pricing Engine)

Recalcula e reduz automaticamente os preços de produtos perecíveis com base em múltiplos fatores — **só ativa se o switch estiver ligado nas Configurações**.

**Fatores de Desconto:**

- **Tempo para Fecho da Loja:** Desconto progressivo nas últimas 2h de operação.
- **Excesso de Stock:** Produtos com mais de 50 unidades sofrem ajuste promocional.
- **Proximidade da Validade:** O fator mais agressivo — produtos a expirar hoje/amanhã recebem o maior corte.
- **Sensibilidade Local (Ticket Médio):** Lojas em zonas de menor poder de compra ativam descontos maiores; lojas premium têm o teto limitado.

> **Configuração:** Pode ser totalmente suspensa pelo Administrador via toggle "Precificação Dinâmica Automática" nas Configurações MIND.

---

## 2. Motor de Recomendação (Cross-Selling AI)

Treina um modelo de Machine Learning (**Apriori / Association Rules**) com base nas faturas reais emitidas, para sugerir produtos ao operador de caixa de forma não intrusiva.

**Como funciona:**

1. Ao **ativar o switch** "Motor de Recomendação Inteligente" nas Configurações, o sistema faz fetch autenticado às últimas 1000 faturas (`/invoice/invoice-receipt`) e treina o modelo em background no microserviço Python.
2. As regras geradas (ex: "Quem compra Cerveja, também leva Amendoins") ficam guardadas em cache (`rules_cache.json`).
3. No ecrã de Vendas (Counter), ao adicionar produtos ao cesto, um botão ✨ pulsa discretamente.
4. Ao clicar, abre um tooltip **com no máximo 2 sugestões** para não distrair o operador.
5. O operador pode adicionar os itens sugeridos à fatura com um toque.

> **Configuração:** Pode ser ativado/desativado via toggle nas Configurações MIND. Quando desativado, o frontend não efetua nenhum pedido ao microserviço.

---

## 3. Prevenção de Fraude (Visão Computacional - YOLOv8)

Camada de segurança física ligada à WebCam da loja.

**Como funciona:**

- Ativa silenciosamente durante comportamentos de risco (cancelamento de artigos, abertura de gaveta sem venda).
- A IA **YOLOv8n** conta quantas pessoas estão presentes no campo visual.
- Se apenas 1 pessoa for detectada (sem cliente à frente), um **Alerta de Fraude** é reportado na gestão central.

> Obrigatório pelo sistema. Não pode ser desativado pelo Operador local.

---

## 4. Assistente MIND AI (Chatbot)

Assistente virtual integrado no cabeçalho do POS, com acesso a qualquer momento sem quebrar o contexto de venda.

**Funcionalidades:**

- **Motor IA:** Google Gemini 1.5 Flash via API Cloud (requer GEMINI_API_KEY no `.env` do microserviço).
- **Conhecimento Profundo do POS:** Treinado com mapeamento completo das telas e fluxos de trabalho do Mindgest POS (abertura/fecho de sessão, emissão de faturas e proformas, etc.).
- **Sugestões Contextuais:** O painel inicial exibe perguntas frequentes baseadas no treino real ("Como abro uma sessão?", "Como crio uma fatura?", etc.).
- **Efeito de Digitação:** As respostas da IA aparecem com animação de escrita progressiva (typewriter).
- **Histórico Persistente:** Conversas gravadas localmente (`localStorage`) com aba dedicada de "Histórico".
- **Limites de Sessão:** Máximo de **150 caracteres por prompt** e **10 mensagens de lifetime por utilizador**.
- **Botão "Fale com MIND":** Botão animado no cabeçalho que abre o painel lateral de chat.

---

## Arquitetura Técnica

| Componente        | Tecnologia                                      |
| ----------------- | ----------------------------------------------- |
| Microserviço MIND | Python 3, FastAPI (porta 5001)                  |
| Recomendações ML  | Pandas, Mlxtend (Apriori)                       |
| Prevenção Fraude  | OpenCV, Ultralytics YOLOv8n                     |
| Assistente IA     | Google Gemini 1.5 Flash                         |
| Frontend          | Next.js, React, Zustand, shadcn/ui              |
| Persistência      | localStorage (chat), rules_cache.json (Apriori) |

---

> **Nota de Operação:** As funcionalidades MIND requerem que o **Mind Microservice** esteja a correr localmente (`uvicorn main:app --port 5001`). A comunicação é exclusivamente local para garantir velocidade e privacidade dos dados de venda.
