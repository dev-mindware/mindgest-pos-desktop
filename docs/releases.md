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

Com o workflow `.github/workflows/release-pos.yml` configurado:

1. Fazer merge das alterações validadas para a branch `main`.
2. O workflow executa:
   - Incrementa a versão patch em `package.json` (`npm version patch --no-git-tag-version`).
   - Faz commit com `[skip ci]` e cria a tag `vX.Y.Z`.
   - Compila o binário Windows NSIS com `nextron build --win --publish always`.
   - Gera e anexa à Release do GitHub:
     - `Mindgest-POS-Setup.exe`
     - `latest.yml` (metadados com hash SHA-512 e versão para o electron-updater)
