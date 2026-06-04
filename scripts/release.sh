#!/bin/bash

# Script para automatizar releases profissionais
# Uso: ./scripts/release.sh [major|minor|patch]

set -e

COLOR_RESET='\033[0m'
COLOR_GREEN='\033[0;32m'
COLOR_YELLOW='\033[1;33m'
COLOR_BLUE='\033[0;34m'

log_info() {
    echo -e "${COLOR_BLUE}ℹ ${1}${COLOR_RESET}"
}

log_success() {
    echo -e "${COLOR_GREEN}✓ ${1}${COLOR_RESET}"
}

log_warning() {
    echo -e "${COLOR_YELLOW}⚠ ${1}${COLOR_RESET}"
}

# Validar argumento
if [ -z "$1" ]; then
    log_warning "Uso: ./scripts/release.sh [major|minor|patch]"
    echo "Exemplos:"
    echo "  ./scripts/release.sh patch   # 1.0.0 → 1.0.1"
    echo "  ./scripts/release.sh minor   # 1.0.0 → 1.1.0"
    echo "  ./scripts/release.sh major   # 1.0.0 → 2.0.0"
    exit 1
fi

BUMP_TYPE=$1

# Validar tipo
if [[ ! "$BUMP_TYPE" =~ ^(major|minor|patch)$ ]]; then
    log_warning "Tipo inválido: $BUMP_TYPE"
    echo "Deve ser: major, minor ou patch"
    exit 1
fi

log_info "Iniciando release workflow..."

# 1. Verificar se está em branch limpa
log_info "Verificando status do repositório..."
if [ -n "$(git status --porcelain)" ]; then
    log_warning "Há mudanças não commitadas. Por favor, commit ou stash primeiro."
    git status
    exit 1
fi

log_success "Repositório limpo"

# 2. Sincronizar com main
log_info "Sincronizando com main..."
git checkout main
git pull origin main

log_success "Main sincronizado"

# 3. Atualizar versão
log_info "Atualizando versão ($BUMP_TYPE)..."
npm version $BUMP_TYPE

# Obter nova versão
NEW_VERSION=$(node -p "require('./package.json').version")
log_success "Nova versão: $NEW_VERSION"

# 4. Push com versão
log_info "Fazendo push de versão..."
git push origin main

log_success "Versão commitada e pushada"

# 5. Criar tag
log_info "Criando tag v$NEW_VERSION..."
git tag -a "v$NEW_VERSION" -m "Release v$NEW_VERSION"
git push origin "v$NEW_VERSION"

log_success "Tag criada e pushada"

# 6. Info final
echo ""
echo -e "${COLOR_GREEN}═══════════════════════════════════════${COLOR_RESET}"
log_success "Release iniciado com sucesso!"
echo -e "${COLOR_GREEN}═══════════════════════════════════════${COLOR_RESET}"
echo ""
echo "Próximos passos:"
echo "  1. Ir para GitHub Actions: https://github.com/dev-mindware/mindgest-pos-desktop/actions"
echo "  2. Acompanhar workflow de Release"
echo "  3. Verificar assets em: https://github.com/dev-mindware/mindgest-pos-desktop/releases/tag/v$NEW_VERSION"
echo ""
echo "Versão: v$NEW_VERSION"
echo ""
