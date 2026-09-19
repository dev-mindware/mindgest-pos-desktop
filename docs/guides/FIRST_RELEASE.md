# 🚀 Primeira Release - Guia Prático

Passo a passo visual para publicar a versão `v1.0.1` do MindGest POS.

---

## Pré-requisitos

- ✅ Branch protection configurada em `main`
- ✅ Workflows criados (`.github/workflows/`)
- ✅ Git com credenciais configuradas
- ✅ pnpm instalado

---

## 📋 Passos (Passo a Passo)

### **Passo 1: Fazer commit dos arquivos de workflow**

```bash
cd ~/Documents/GitHub/mindgest-pos-desktop

git add .
git commit -m "ci: configure github actions workflow and branch protection"
git push origin main
```

**Esperado**: Commit chega em `main` sem problemas.

---

### **Passo 2: Atualizar versão para 1.0.1**

```bash
npm version patch
```

**O que acontece**:
- ✅ `package.json` muda de `"version": "1.0.0"` para `"version": "1.0.1"`
- ✅ Um commit automático é feito
- ✅ Uma tag `v1.0.1` é criada localmente

**Verificar**:
```bash
git log --oneline -3
# Deve mostrar: chore(release): 1.0.1
```

---

### **Passo 3: Fazer push da versão para main**

```bash
git push origin main
```

**O que acontece**:
- ✅ Commit de versão vai para `main`
- ✅ CI workflow roda (lint, testes, build)
- ✅ Aguardar ~5-10 min

**Verificar no GitHub**:
- Ir para **Actions**
- Ver workflow `CI` em execução
- Quando terminar, deve estar ✅

---

### **Passo 4: Fazer push da tag**

```bash
git push origin v1.0.1
```

**O que acontece**:
- ✅ Tag é enviada para GitHub
- ✅ GitHub Actions **automaticamente** dispara o workflow `Release`
- ✅ Build multiplataforma começa (leva ~15-20 min)

**Verificar no GitHub**:
- Ir para **Actions**
- Ver workflow `Release` em execução
- Status para cada OS (Windows, macOS, Linux)

---

### **Passo 5: Acompanhar o build**

| Fase | Tempo | Status |
|------|-------|--------|
| Checkout | 30s | ✅ |
| Setup Node + pnpm | 1-2 min | ✅ |
| Install dependencies | 2-3 min | ✅ |
| Lint & Test | 1-2 min | ✅ |
| Build (Windows) | 5-8 min | ⏳ |
| Build (macOS) | 5-8 min | ⏳ |
| Build (Linux) | 5-8 min | ⏳ |
| **Total** | **~20-25 min** | 🕐 |

---

### **Passo 6: Verificar Release Publicada**

Quando o workflow terminar (🟢 todos os jobs):

1. Ir para **Releases** do repositório
2. Clicar em tag `v1.0.1`
3. Verificar assets publicados:

```
✅ MindGest POS-1.0.1.exe
✅ MindGest POS-1.0.1.msi
✅ MindGest POS-1.0.1.dmg
✅ MindGest POS-1.0.1.AppImage
✅ MindGest POS-1.0.1.tar.gz
✅ latest.yml (para auto-update)
```

Se alguns assets faltam, pode estar ainda gerando. Aguardar mais um pouco.

---

## ⚠️ Troubleshooting

### ❌ Erro: "Tag já existe"

```
fatal: tag 'v1.0.1' already exists
```

**Causa**: Tag foi criada antes. **Solução**:
```bash
git tag -d v1.0.1           # Deletar localmente
git push origin --delete v1.0.1  # Deletar remotamente
npm version patch           # Recriar versão
git push origin v1.0.1      # Re-fazer push
```

---

### ❌ Erro: "CI falhou"

```
Status checks failed - CI
```

**Causa**: Lint, testes ou build falhou.

**Solução**:
1. Ir para **Actions** → workflow que falhou
2. Ver logs detalhados
3. Corrigir problema locally
4. Fazer novo commit e push
5. Re-criar tag com bump (e.g., `v1.0.2`)

---

### ❌ Erro: "Pode't push - branch protection"

```
[rejected] main -> main (protected branch hook declined)
```

**Causa**: Tentou fazer push direto sem PR.

**Solução**:
1. Fazer branch feature: `git checkout -b release/v1.0.1`
2. Fazer push: `git push origin release/v1.0.1`
3. Abrir PR em GitHub
4. Aguardar CI + review
5. Fazer merge
6. Depois criar tag: `git tag -a v1.0.1 -m "..."`

---

### ⚠️ Release publicada mas assets faltam

**Causa**: Job de build falhou silenciosamente.

**Solução**:
1. Ir para **Actions** → `Release` workflow
2. Clicar no job que falhou (ex: `build-and-release [windows-latest]`)
3. Ver logs de erro
4. Corrigir locally
5. Fazer novo release com versão `v1.0.2`

---

## 🔄 Depois da Primeira Release

### Validar auto-update (Teste F7)

1. **Desinstalar** versão atual
2. **Instalar** `v1.0.1` do GitHub Releases
3. Abrir app
4. App deve detectar novo update (se houver `v1.0.2`)
5. Mostrar notificação: "Nova versão disponível"
6. Download e install automático

---

### Próximas Releases

Agora que a primeira está feita:

```bash
# Para versão 1.0.2 (correção)
npm version patch
git push origin main
git push origin v1.0.2

# Para versão 1.1.0 (nova feature)
npm version minor
git push origin main
git push origin v1.1.0

# Para versão 2.0.0 (breaking change)
npm version major
git push origin main
git push origin v2.0.0
```

---

## ✅ Checklist Pós-Release

- [ ] Release visible em GitHub Releases
- [ ] Todos os assets downloadáveis
- [ ] `latest.yml` presente (para auto-update)
- [ ] Testar instalador em máquina limpa
- [ ] Testar auto-update (se versão anterior instalada)
- [ ] Anunciar release em canal apropriado (Slack, Discord, etc.)

---

## 📞 Suporte

Se ficar preso em algum passo:

1. Consultar [GITHUB_WORKFLOW.md](GITHUB_WORKFLOW.md) para contexto geral
2. Consultar [BRANCH_PROTECTION_GUIDE.md](BRANCH_PROTECTION_GUIDE.md) para branch protection
3. Verificar logs em GitHub **Actions**
4. Reler [README.md](README.md) seção "Workflow de Releases"

---

**Data**: 04 de Junho de 2026  
**Versão**: v1.0.1  
**Status**: 🟢 Pronto para primeira release
