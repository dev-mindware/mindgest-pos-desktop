# 🔒 Branch Protection Rule - Configuração Profissional

Guia passo a passo para configurar proteção da branch `main` no GitHub.

---

## 📋 Passos de Configuração

### 1. Acessar Settings

1. Ir para o repositório no GitHub
2. Clicar em **Settings** (aba superior)
3. Na esquerda, clicar em **Branches**

---

### 2. Adicionar Nova Regra

1. Clique em **Add branch protection rule**
2. No campo **Branch name pattern**, digite: `main`

---

### 3. Configurar Proteções (Recomendadas)

#### ✅ **Require a pull request before merging**
- [x] Require a pull request before merging
  - Número mínimo de reviews: **1** (ou mais se preferir)
  - [x] Dismiss stale pull request approvals when new commits are pushed
  - [ ] Require review from code owners

**Por quê?** Garante que todo código passa por revisão antes de entrar em `main`.

---

#### ✅ **Require status checks to pass before merging**
- [x] Require status checks to pass before merging
  - [x] Require branches to be up to date before merging
  - Status checks obrigatórios:
    - `ci` (CI workflow)
    - `build-and-release` (Release workflow)

**Por quê?** Garante que testes, lint e build passam antes de merge.

---

#### ✅ **Require conversation resolution before merging**
- [x] Require conversation resolution before merging

**Por quê?** Força resolver comments antes de fazer merge.

---

#### ❌ **Require signed commits** (Opcional)
- [ ] Require signed commits

**Por quê?** Apenas se quiser forçar assinatura GPG (mais restritivo).

---

#### ❌ **Require linear history** (Opcional)
- [ ] Require linear history

**Por quê?** Impede merge commits. Útil para histórico limpo, mas nem sempre necessário.

---

#### ❌ **Lock branch** (Não recomendado)
- [ ] Lock branch

**Por quê?** Apenas para branches em read-only temporário.

---

#### ✅ **Dismiss stale pull request approvals**
- [x] Dismiss stale pull request approvals when new commits are pushed

**Por quê?** Força re-review quando novas mudanças são feitas.

---

#### ❌ **Require deployments to succeed before merging** (Não aplicável)
- [ ] Require deployments to succeed before merging

**Por quê?** Só relevante se houver environment deploy automático.

---

### 4. Configurar Administradores

#### ✅ **Rules applied to everyone including administrators**
- [x] Do not allow bypassing the above settings

**Por quê?** Garante que até administradores respeitam as regras.

---

#### ❌ **Allow force pushes**
- [ ] Allow force pushes

**Por quê?** Nunca em `main`. Isso pode destruir histórico.

---

#### ❌ **Allow deletions**
- [ ] Allow deletions

**Por quê?** Nunca em `main`. Isso pode apagar a branch acidentalmente.

---

### 5. Salvar

Clique em **Create** ou **Update** (dependendo se é nova regra ou edição).

---

## ✅ Resumo da Configuração Ideal

| Opção | Status | Motivo |
|-------|--------|--------|
| **Require PR before merging** | ✅ | Code review obrigatório |
| **Require status checks** | ✅ | CI/testes devem passar |
| **Require branches up to date** | ✅ | Evita conflicts não detectados |
| **Dismiss stale approvals** | ✅ | Force re-review em mudanças |
| **Require conversation resolution** | ✅ | Comments devem ser resolvidos |
| **Require signed commits** | ❌ | Opcional (mais restritivo) |
| **Require linear history** | ❌ | Opcional (estético) |
| **Rules apply to admins** | ✅ | Ninguém escapa |
| **Allow force pushes** | ❌ | Nunca em main |
| **Allow deletions** | ❌ | Nunca em main |

---

## 🔄 Fluxo de Trabalho Resultante

Com esta configuração:

1. **Developer** cria branch `feature/xyz`
2. **Developer** faz push e abre PR para `main`
3. **CI Workflow** roda automaticamente
   - Lint ✅
   - Testes ✅
   - Build ✅
4. **Reviewer** analisa código e aprova (pelo menos 1 approval)
5. **System** verifica:
   - ✅ PR foi aprovado?
   - ✅ CI passou?
   - ✅ Conversations resolvidas?
6. **Developer** clica "Squash and merge" ou "Merge pull request"
7. **Branch** é merged e sincronizada com `main`
8. Próximo passo: **Tag e Release**

---

## 🏷️ Próximo Passo: Fazer Release

Depois de configurada a proteção, para fazer uma release:

```bash
# Na branch develop (ou feature)
git checkout develop
git pull origin develop

# Atualizar versão
npm version patch

# Fazer PR para main
git push origin develop

# No GitHub: Abrir PR, aguardar CI e review
# Depois: Merge para main

# Criar tag (vai disparar workflow de release)
git checkout main
git pull origin main
git tag -a v1.0.1 -m "Release v1.0.1"
git push origin v1.0.1
```

---

## 🛠️ Troubleshooting

### "Mergear não está disponível"

**Causa**: Status checks não passaram ou PR não foi aprovado.

**Solução**: 
1. Verificar **Checks** na PR - que falhou?
2. Pedir revisão novamente
3. Fazer novo commit para atualizar

### "Merge pode fazer bypass da proteção"

**Causa**: Você é administrador e a regra não está aplicada a todos.

**Solução**: Habilitar "Do not allow bypassing the above settings"

### "Branches desincronizadas"

**Causa**: `main` foi atualizada depois que você criou a branch.

**Solução**: 
1. Clicar em "Update branch" na PR
2. Ou fazer `git rebase main` localmente

---

## 📚 Referências

- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Status Checks](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-status-checks)

---

**Data**: 04 de Junho de 2026  
**Status**: 📝 Documento de referência  
**Próximo**: Fazer primeira release após configuração
