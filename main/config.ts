import path from "path";
import fs from "fs";

/**
 * Lê o URL da API Cloud de forma robusta e dinâmica tanto em Dev como em Produção/Empacotado
 */
function resolveCloudApiUrl(): string {
  // 1. Variável de ambiente em memória (injetada no build ou no processo)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // 2. Procurar arquivos .env em ordem de prioridade
  const possiblePaths = [
    path.join(__dirname, "..", ".env.production.local"),
    path.join(__dirname, "..", ".env.staging"),
    path.join(__dirname, "..", ".env.production"),
    path.join(__dirname, "..", ".env"),
    path.join(process.cwd(), ".env.staging"),
    path.join(process.cwd(), ".env.production"),
    path.join(process.cwd(), ".env"),
  ];

  if ((process as any).resourcesPath) {
    possiblePaths.unshift(
      path.join((process as any).resourcesPath, ".env.staging"),
      path.join((process as any).resourcesPath, ".env")
    );
  }

  for (const envPath of possiblePaths) {
    try {
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, "utf-8");
        const match = content.match(/NEXT_PUBLIC_API_URL\s*=\s*(.+)/);
        if (match && match[1]) {
          const url = match[1].trim().replace(/^["']|["']$/g, "");
          if (url) {
            console.log(`🌐 [Config] API URL carregada de ${envPath}: ${url}`);
            return url;
          }
        }
      }
    } catch {}
  }

  return "https://mindgest.mindware-vps.cloud/api";
}

export const CLOUD_API_URL = resolveCloudApiUrl();
