@echo off
REM Script para automatizar releases profissionais no Windows
REM Uso: release.bat [major|minor|patch]

setlocal enabledelayedexpansion

set "RESET=[0m"
set "GREEN=[32m"
set "YELLOW=[33m"
set "BLUE=[34m"

if "%1"=="" (
    echo.
    echo %YELLOW%[!] Uso: release.bat [major^|minor^|patch]%RESET%
    echo.
    echo Exemplos:
    echo   release.bat patch   # 1.0.0 -^> 1.0.1
    echo   release.bat minor   # 1.0.0 -^> 1.1.0
    echo   release.bat major   # 1.0.0 -^> 2.0.0
    echo.
    exit /b 1
)

set "BUMP_TYPE=%1"

if not "%BUMP_TYPE%"=="major" if not "%BUMP_TYPE%"=="minor" if not "%BUMP_TYPE%"=="patch" (
    echo %YELLOW%[!] Tipo invalido: %BUMP_TYPE%%RESET%
    echo Deve ser: major, minor ou patch
    exit /b 1
)

echo.
echo %BLUE%[i] Iniciando release workflow...%RESET%

REM 1. Verificar status do repositorio
echo %BLUE%[i] Verificando status do repositorio...%RESET%
git status --porcelain >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%[!] Erro ao verificar status do Git%RESET%
    exit /b 1
)

for /f %%A in ('git status --porcelain') do (
    echo %YELLOW%[!] Ha mudancas nao commitadas. Por favor, commit ou stash primeiro.%RESET%
    git status
    exit /b 1
)

echo %GREEN%[*] Repositorio limpo%RESET%

REM 2. Sincronizar com main
echo %BLUE%[i] Sincronizando com main...%RESET%
git checkout main >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%[!] Erro ao fazer checkout de main%RESET%
    exit /b 1
)

git pull origin main >nul 2>&1
echo %GREEN%[*] Main sincronizado%RESET%

REM 3. Atualizar versao
echo %BLUE%[i] Atualizando versao (%BUMP_TYPE%)...%RESET%
call npm version %BUMP_TYPE%

REM Obter nova versao
for /f %%i in ('node -p "require('./package.json').version"') do set "NEW_VERSION=%%i"
echo %GREEN%[*] Nova versao: %NEW_VERSION%%RESET%

REM 4. Push com versao
echo %BLUE%[i] Fazendo push de versao...%RESET%
git push origin main
echo %GREEN%[*] Versao commitada e pushada%RESET%

REM 5. Criar tag
echo %BLUE%[i] Criando tag v%NEW_VERSION%...%RESET%
git tag -a v%NEW_VERSION% -m "Release v%NEW_VERSION%"
git push origin v%NEW_VERSION%
echo %GREEN%[*] Tag criada e pushada%RESET%

REM 6. Info final
echo.
echo %GREEN%======================================%RESET%
echo %GREEN%[*] Release iniciado com sucesso!%RESET%
echo %GREEN%======================================%RESET%
echo.
echo Proximos passos:
echo   1. Ir para GitHub Actions: https://github.com/dev-mindware/mindgest-pos-desktop/actions
echo   2. Acompanhar workflow de Release
echo   3. Verificar assets em: https://github.com/dev-mindware/mindgest-pos-desktop/releases/tag/v%NEW_VERSION%
echo.
echo Versao: v%NEW_VERSION%
echo.
