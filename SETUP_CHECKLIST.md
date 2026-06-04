# ✅ GitHub Workflow Setup - Checklist de Configuração

## Arquivos Criados

- ✅ `.github/workflows/release.yml` - Workflow para publicar releases em tags `v*`
- ✅ `.github/workflows/ci.yml` - Workflow de CI contínua em push/PR
- ✅ `electron-builder.json` - Configuração otimizada de build
- ✅ `GITHUB_WORKFLOW.md` - Documentação completa do processo
- ✅ `scripts/release.sh` - Script auxiliar para releases (Linux/macOS)
- ✅ `scripts/release.bat` - Script auxiliar para releases (Windows)
- ✅ `package.json` - Atualizado com scripts `test`, `lint`, `build:publish`
- ✅ `README.md` - Seção de releases adicionada

---

## Próximos Passos - Configurar no GitHub

### 1. **Habilitar branch protection para `main`**

1. Ir para **Settings** → **Branches**
2. Adicionar regra para `main`:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging

### 2. **Verificar Secrets**

1. Ir para **Settings** → **Secrets and variables** → **Actions**
2. Confirmar que `GITHUB_TOKEN` está disponível (automático)
3. Se quiser adicionar `GH_TOKEN` customizado (opcional):
   - Criar Personal Access Token no GitHub
   - Adicionar como secret `GH_TOKEN`

### 3. **Habilitar Releases**

1. Ir para **Settings** → **General**
2. Verificar que "Releases" está habilitado

---

## Testar o Workflow (Recomendado)

### Teste 1: CI em Pull Request

```bash
git checkout -b feature/test-ci
echo "test" >> test.txt
git add test.txt
git commit -m "test: ci workflow"
git push origin feature/test-ci
```

Ir para GitHub e abrir PR. Deve rodar CI automaticamente.

### Teste 2: Release Simulado

```bash
# Atualizar versão
npm version patch

# Fazer push
git push origin main

# Criar tag (vai disparar workflow de release)
git tag -a v1.0.1 -m "Release v1.0.1"
git push origin v1.0.1
```

Acompanhar em **Actions** → **Release**

---

## Próximas Melhorias (Opcional)

### Adicionar verdadeiros testes

Instalar Jest e configurar:
```bash
pnpm add -D jest @testing-library/react
```

Atualizar `package.json`:
```json
"test": "jest --coverage"
```

### Adicionar Changelog automático

Usar `changesets` ou `conventional-changelog` para gerar CHANGELOG.md automático.

### Notificações em Slack/Discord

Adicionar step no workflow:
```yaml
- name: Notify Slack
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Referências Úteis

- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Electron Builder Docs](https://www.electron.build/)
- [Semantic Versioning](https://semver.org/)
- [electron-updater](https://www.electron.build/auto-update)

---

## Support

Se houver problemas com o workflow:

1. Verificar logs em **Actions** → Workflow → Job
2. Consultar [GITHUB_WORKFLOW.md](GITHUB_WORKFLOW.md) para troubleshooting
3. Fazer commit de testes locais antes de fazer push

---

**Data**: 04 de Junho de 2026  
**Status**: ✅ Configuração concluída  
**Próximo passo**: Fazer primeira release com tag `v1.0.1`
