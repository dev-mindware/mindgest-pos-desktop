# 📦 Workflow de Release Profissional

Este projeto utiliza GitHub Actions para automatizar o processo de build, testes e publicação de releases.

## Workflows Configurados

### 1. **CI Workflow** (`.github/workflows/ci.yml`)
- **Dispara em:** Push para `main` e `develop`, e em Pull Requests
- **Executa:**
  - Lint do código
  - Testes
  - Build da aplicação
- **Objetivo:** Validar qualidade do código antes de mergear

### 2. **Release Workflow** (`.github/workflows/release.yml`)
- **Dispara em:** Push de tags com padrão `v*` (ex: `v1.0.0`, `v1.0.1`)
- **Executa em:** Windows, Ubuntu e macOS (builds multiplataforma)
- **Publica:**
  - Instaladores `.exe`, `.msi` (Windows)
  - Binários `.dmg`, `.AppImage`, `.zip`, `.tar.gz`
  - Arquivo de configuração `.yml` para auto-update
- **Objetivo:** Gerar e publicar releases automaticamente

---

## Como publicar uma nova versão

### Passo 1: Atualizar versão no `package.json`

```bash
# Opção A: Automático (recomendado)
npm version patch    # para correção (1.0.0 → 1.0.1)
npm version minor    # para nova feature (1.0.0 → 1.1.0)
npm version major    # para breaking change (1.0.0 → 2.0.0)
```

Isso atualiza `package.json` e cria o commit automaticamente.

Ou manualmente:
```json
"version": "1.0.1"
```

### Passo 2: Commit e push para `main`

```bash
git add package.json
git commit -m "chore: bump version to 1.0.1"
git push origin develop  # ou main, conforme seu workflow
```

### Passo 3: Abrir Pull Request e fazer merge

1. Abrir PR em GitHub
2. Aguardar CI passar (lint, testes, build)
3. Fazer merge para `main`

### Passo 4: Criar tag e fazer push

```bash
# Na branch main
git pull origin main

# Criar tag anotada
git tag -a v1.0.1 -m "Release v1.0.1: correção de bug no checkout"

# Fazer push da tag
git push origin v1.0.1
```

Isso dispara automaticamente o workflow de release.

### Passo 5: Acompanhar o build

No GitHub:
- Ir para **Actions**
- Ver o workflow `Release` em execução
- Aguardar conclusão (leva ~10-15 min por OS)
- Verificar assets publicados na **Release**

---

## Configuração do Token GitHub

Para que o workflow funcione corretamente, o `GITHUB_TOKEN` já está disponível automaticamente no GitHub Actions.

Se precisar de permissões adicionais:

1. Ir para **Settings** → **Secrets and variables** → **Actions**
2. Verificar se `GITHUB_TOKEN` está presente (já vem por padrão)
3. Nada precisa ser feito manualmente!

---

## Estrutura de versão (SemVer)

- `1.0.0` → Versão base
- `1.0.1` → Correção (patch)
- `1.1.0` → Nova feature (minor)
- `2.0.0` → Breaking change (major)

---

## Verificar e testar localmente (opcional)

```bash
# Build local (antes de fazer tag)
pnpm run build:publish

# Isso vai criar instaladores em dist/
```

---

## Troubleshooting

### Build falha no GitHub Actions

1. Verificar logs da action: **Actions** → Workflow → Job
2. Causas comuns:
   - Dependências não instaladas: `pnpm install --frozen-lockfile`
   - Permissões: Verificar `permissions: contents: write` no workflow
   - Token expirado: GitHub Token renovado automaticamente

### Assets não aparecem na release

1. Verificar se os arquivos existem em `dist/`
2. Confirmar padrão de glob no workflow em `files:`
3. Ver logs da action `Upload artifacts to release`

### Auto-update não detecta nova versão

1. Verificar se versão em `package.json` é maior que instalada
2. Confirmar que arquivo `.yml` foi publicado como asset
3. Testar com versão de antes: desinstalar, reinstalar antiga, testar update

---

## Próximos passos

- ✅ Workflows configurados
- ✅ Scripts test/lint adicionados
- ⏳ Adicionar testes reais (Jest/Vitest)
- ⏳ Configurar linting (ESLint rules)
- ⏳ Adicionar notificações de release (Discord/Slack)

