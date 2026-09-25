# 📦 Distribuição e Ciclo de Releases - Mindgest POS

Este documento descreve o fluxo de publicação automática de versões, distribuição contínua via **GitHub Releases**, integração com o **electron-updater** e a gestão de links de download para a landing page do Mindgest.

---

## 🔗 Link de Download Estável para a Landing Page

O `artifactName` do instalador Windows foi configurado sem número de versão (`Mindgest-POS-Setup.exe`), garantindo que o link direto para a versão estável mais recente nunca muda:

```text
https://github.com/dev-mindware/mindgest-pos-desktop/releases/latest/download/Mindgest-POS-Setup.exe
```

### ⚠️ Importante: Repositórios Privados vs. Downloads Públicos

Se o repositório `dev-mindware/mindgest-pos-desktop` for **privado**:
- O link `https://github.com/.../releases/latest/download/...` **NÃO é acessível publicamente** sem autenticação prévia via token/cookie do GitHub.
- Utilizadores anónimos ou clientes finais que cliquem no botão de download na landing page receberão um erro `404 Not Found`.

#### Estratégias recomendadas para distribuição pública (Propostas):

1. **Repositório Público Dedicado a Releases (Recomendado)**:
   - Criar um repositório público (ex: `dev-mindware/mindgest-pos-releases`).
   - O workflow de CI/CD do repositório principal compila o código em ambiente privado e publica os binários e os ficheiros `latest.yml` no repositório público através de um `PERSONAL_ACCESS_TOKEN` com escopo restrito a esse repositório.
   - O código-fonte permanece 100% privado e os instaladores ficam acessíveis a qualquer cliente sem autenticação.

2. **Bucket de Armazenamento Dedicado (S3 / Cloudflare R2 / MinIO)**:
   - O mesmo workflow do GitHub Actions, após compilar e gerar a release, envia o `Mindgest-POS-Setup.exe` e o `latest.yml` para um bucket S3/R2 público (ex: `https://download.mindgest.ao/pos/Mindgest-POS-Setup.exe`).
   - O `electron-updater` pode apontar para o bucket como provedor genérico (`provider: "generic", url: "https://download.mindgest.ao/pos"`).

---

## 🔄 Funcionamento do Auto-Updater no Cliente (POS)

O Mindgest POS opera em ambientes de balcão de retalho crítico. A política de atualização foi desenhada para **nunca interromper uma venda em curso**:

1. **Verificação no Arranque**:
   - 5 segundos após a janela principal carregar, o processo principal executa `autoUpdater.checkForUpdatesAndNotify()`.
2. **Download em Background (`autoDownload: true`)**:
   - O download ocorre silenciosamente sem degradar a performance da interface.
3. **Pendente para Instalação Segura (`quitAndInstall` controlado)**:
   - Quando o evento `update-downloaded` é disparado, a aplicação **NÃO reinicia automaticamente**.
   - Emite um evento IPC `update:downloaded` para notificar o operador com um toast sonoro/visual discreto.
   - Antes de qualquer reinicialização, o sistema consulta a tabela `CashSession` no SQLite local:
     ```ts
     const activeSession = await prisma.cashSession.findFirst({
       where: { status: "OPEN" },
     });
     ```
   - Se houver sessão de caixa aberta, a instalação é rejeitada e adiada:
     > *"Existe uma sessão de caixa aberta. Feche a sessão de caixa antes de reiniciar para instalar a atualização."*
   - O update é aplicado no encerramento limpo do operador ou no próximo arranque da app.
4. **Logs Diagnósticos**:
   - Integrado com `electron-log`. Os ficheiros de log de diagnóstico em campo residem em:
     - **Windows**: `%USERPROFILE%\AppData\Roaming\mindgest-pos-desktop\logs\main.log`

---

## 🚀 Como Publicar uma Nova Versão

O pipeline de release ([`.github/workflows/release-pos.yml`](../.github/workflows/release-pos.yml)) opera em duas fases estritas:

> [!IMPORTANT]
> **Garantia de Integridade**: Uma release não é publicada enquanto a validação obrigatória e os testes de artefacto não terminarem com sucesso.

1. **Disparo**:
   - Automático: push para a branch `main`.
   - Manual: via `workflow_dispatch` na interface do GitHub Actions, permitindo escolher o tipo de incremento (`patch`, `minor` ou `major`).
2. **Fase 1: Portão de Qualidade Reutilizável (`validate`)**:
   - Checkout do código.
   - Instalação determinística com `pnpm install --frozen-lockfile` (Node 22 / pnpm 11.22.0).
   - Validação de tipos com `npx tsc --noEmit`.
   - Compilação estática Next.js + Webpack sem empacotamento (`nextron build --no-pack`).
3. **Fase 2: Build, Verificação do Artefacto e Publicação (`build-and-release`)**:
   - Só inicia se a **Fase 1 passar com 100% de sucesso**.
   - Calcula a próxima versão e verifica se a tag já existe no Git (prevenção de colisões).
   - Compila o instalador NSIS localmente com `nextron build --win`.
   - **Artifact Gate**:
     - Confirma existência e tamanho do executável `Mindgest-POS-Setup.exe`.
     - Confirma existência e integridade do manifesto `latest.yml`.
     - Valida que a versão e o caminho do manifesto correspondem exatamente ao pacote.
     - **Calcula o hash SHA-512 do executável** e valida a correspondência exata com o valor registado no `latest.yml`.
   - **Smoke Test**: Executa teste de instalação silenciosa (`/S`).
   - **Artifact Attestation**: Gera atestação criptográfica de proveniência de cadeia de fornecimento via Sigstore.
   - **Draft Release**: Cria a release no GitHub em estado de rascunho (`--draft`) anexando os binários.
   - **Rastreabilidade Git**: Regista o commit de bump (`[skip ci]`) e cria a tag `vX.Y.Z` na `main`.
   - **Publicação**: Torna a release pública no GitHub (`--draft=false`). Se qualquer passo anterior falhar, o rascunho é descartado e nenhuma tag inválida é enviada.
