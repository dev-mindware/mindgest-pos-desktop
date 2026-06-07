# Guia de Build e Instalação - MindGest POS Desktop

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:
- **Node.js** (v18 ou superior) - [Download](https://nodejs.org/)
- **pnpm** (v8 ou superior) - `npm install -g pnpm`
- **Git** (para clonar o repositório)

## 🔨 Passo 1: Preparar o Ambiente

### 1.1 Clonar o repositório
```bash
git clone https://github.com/dev-mindware/mindgest-pos-desktop.git
cd mindgest-pos-desktop
```

### 1.2 Instalar dependências
```bash
pnpm install
```

### 1.3 Configurar variáveis de ambiente
Criar arquivo `.env.local` na raiz do projeto:
```env
DATABASE_URL="file:./prisma/dev.db"
NEXT_PUBLIC_API_URL="http://localhost:3001"
NODE_ENV="production"
```

## 🏗️ Passo 2: Gerar o Executável

### Opção A: Build Local (Recomendado para desenvolvimento)

```bash
pnpm run build
```

**O que isso faz:**
1. Limpa builds anteriores
2. Compila Next.js para produção
3. Compila TypeScript para Electron
4. Empacota tudo em um executável Windows (.exe) usando electron-builder
5. Gera instalador NSIS (.exe installer)

**Onde encontrar:**
- Executável portável: `dist/MindGest POS 1.0.0.exe`
- Instalador NSIS: `dist/MindGest POS Setup 1.0.0.exe`

### Opção B: Build com Publicação automática (CI/CD)

```bash
pnpm run build:publish
```

Isto irá:
1. Gerar o executável
2. Publicar automaticamente no GitHub Releases
3. Permitir atualizações automáticas nos clientes

**Requer:**
- Token GitHub com permissões de release
- Variável de ambiente: `GH_TOKEN`

## 📦 Passo 3: Distribuir e Instalar

### Opção 1: Instalador NSIS (Recomendado)

O instalador NSIS é mais profissional e user-friendly:

**Para distribuir:**
1. Copiar `dist/MindGest POS Setup 1.0.0.exe`
2. Enviar aos PCs
3. Executar o instalador

**Vantagens:**
- Cria atalho no Desktop
- Instala no Program Files
- Pode desinstalar via Control Panel
- Permite atualizações automáticas

### Opção 2: Executável Portável

```bash
# Copiar o executável
dist/MindGest POS 1.0.0.exe
```

**Vantagens:**
- Sem instalação
- Funciona direto ao executar
- Ideal para testes rápidos

## 🖥️ Passo 4: Instalação em Massa nos PCs

### Método 1: Com PowerShell (Recomendado)

Criar script `install_mindgest.ps1`:

```powershell
# Criar pasta de instalação
$installPath = "C:\Program Files\MindGest POS"
New-Item -ItemType Directory -Path $installPath -Force

# Copiar instalador
Copy-Item -Path "\\servername\share\MindGest POS Setup 1.0.0.exe" -Destination "$env:TEMP\MindGest_Setup.exe"

# Executar instalador silenciosamente
& "$env:TEMP\MindGest_Setup.exe" /S /D=$installPath

# Limpar
Remove-Item "$env:TEMP\MindGest_Setup.exe"

Write-Host "MindGest POS instalado com sucesso!"
```

Executar em cada PC:
```powershell
powershell -ExecutionPolicy Bypass -File install_mindgest.ps1
```

### Método 2: Com GPO (Group Policy) - Ambiente Corporativo

1. Colocar instalador em compartilhamento de rede: `\\servername\share\`
2. Criar GPO para executar na inicialização
3. Apontar para: `\\servername\share\MindGest POS Setup 1.0.0.exe /S /D=C:\Program Files\MindGest POS`

### Método 3: Manual por PC

1. Compartilhar pasta `dist` na rede
2. Em cada PC:
   - Abrir `\\servername\share\dist\`
   - Duplo clique em `MindGest POS Setup 1.0.0.exe`
   - Seguir assistente de instalação

## 🔄 Passo 5: Atualizações

### Automáticas (Se configurado electron-updater)

1. Gerar nova versão
2. Atualizar `version` em `package.json`
3. Executar `pnpm run build:publish`
4. GitHub cria novo Release automaticamente
5. Clientes recebem notificação de atualização

### Manuais

1. Desinstalar versão anterior
2. Instalar nova versão usando os mesmos passos acima

## 🛠️ Troubleshooting

### Erro: "Build failed"

```bash
# Limpar caches
rm -rf .next node_modules .pnpm-store
pnpm install
pnpm run build
```

### Erro: "better-sqlite3 compilation failed"

```bash
# Reinstalar dependências nativas
npm run postinstall
```

### Aplicação não inicia

1. Verificar logs em: `%APPDATA%\MindGest POS\logs\`
2. Certificar-se que SQLite database está acessível
3. Verificar configuração .env

### Porta já em uso

Se porta 3000 ou outra estiver ocupada:
```bash
# Encontrar processo
netstat -ano | findstr :3000
# Matar processo
taskkill /PID <PID> /F
```

## 📊 Estrutura de Arquivos após Build

```
mindgest-pos-desktop/
├── dist/
│   ├── MindGest POS 1.0.0.exe          # Executável portável
│   ├── MindGest POS Setup 1.0.0.exe    # Instalador NSIS
│   ├── builder-effective-config.yaml
│   └── win-unpacked/                   # Arquivos desempacotados
├── app/dev/                            # Build temporário
└── ...
```

## 🔐 Segurança

### Certificado de Código (Opcional - Profissional)

Para assinar o executável (evita warning do Windows):

```bash
# Adionar ao package.json build section
"certificateFile": "path/to/certificate.pfx",
"certificatePassword": "password"
```

## 📝 Versioning

Atualizar versão em `package.json`:

```json
{
  "version": "1.0.1"
}
```

Isto afetará o nome do instalador e será refletido na aplicação.

## 💡 Dicas

- ✅ Sempre testar o build localmente antes de distribuir
- ✅ Manter backup da versão anterior antes de atualizar
- ✅ Documentar versões principais no GitHub Releases
- ✅ Coletar feedback dos usuários após distribuição
- ✅ Usar sistema de versionamento semântico (MAJOR.MINOR.PATCH)

## 📞 Suporte

Se encontrar problemas:
1. Verificar logs da aplicação
2. Consultar [Electron Builder Docs](https://www.electron.build/)
3. Abrir issue no GitHub: https://github.com/dev-mindware/mindgest-pos-desktop/issues

---

**Última atualização:** 2026-06-07
**Versão atual:** 1.0.0
