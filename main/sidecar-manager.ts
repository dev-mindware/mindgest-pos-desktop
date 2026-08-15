import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';

const SIDECAR_HOST = '127.0.0.1';
const SIDECAR_PORT = 3002;
export const LOCAL_DOC_GENERATOR_URL = `http://${SIDECAR_HOST}:${SIDECAR_PORT}`;

export class SidecarManager {
  private static process: ChildProcess | null = null;
  private static isStarting = false;

  /**
   * Verifica se o microserviço de impressão está acessível e saudável
   */
  static async isHealthy(): Promise<boolean> {
    try {
      const response = await axios.get(`${LOCAL_DOC_GENERATOR_URL}/health`, {
        timeout: 1500,
      });
      return response.status === 200 && response.data?.status === 'healthy';
    } catch {
      return false;
    }
  }

  /**
   * Obtém o caminho do executável Python disponível
   */
  private static getPythonExecutable(serviceDir: string): string {
    const isWin = process.platform === 'win32';
    const venvPython = isWin
      ? path.join(serviceDir, 'venv', 'Scripts', 'python.exe')
      : path.join(serviceDir, 'venv', 'bin', 'python3');

    if (fs.existsSync(venvPython)) {
      return venvPython;
    }

    const fallbackVenv = isWin
      ? path.resolve(process.cwd(), '..', 'MINDGEST-API', 'python-microservice', 'venv', 'Scripts', 'python.exe')
      : path.resolve(process.cwd(), '..', 'MINDGEST-API', 'python-microservice', 'venv', 'bin', 'python3');

    if (fs.existsSync(fallbackVenv)) {
      return fallbackVenv;
    }

    return isWin ? 'python' : 'python3';
  }

  /**
   * Inicia o microserviço FastAPI em background
   */
  static async start(): Promise<void> {
    if (await this.isHealthy()) {
      console.log(`✅ [DocGenerator Sidecar] Microserviço já está em execução em ${LOCAL_DOC_GENERATOR_URL}`);
      return;
    }

    if (this.isStarting) return;
    this.isStarting = true;

    try {
      const serviceDir = path.resolve(process.cwd(), 'desktop-service');
      if (!fs.existsSync(serviceDir)) {
        console.warn(`⚠️ [DocGenerator Sidecar] Diretório do microserviço não encontrado: ${serviceDir}`);
        this.isStarting = false;
        return;
      }

      const pythonPath = this.getPythonExecutable(serviceDir);
      console.log(`🚀 [DocGenerator Sidecar] A iniciar microserviço Python na porta ${SIDECAR_PORT}...`);
      console.log(`   Python: ${pythonPath}`);
      console.log(`   CWD: ${serviceDir}`);

      const child = spawn(
        pythonPath,
        ['-m', 'uvicorn', 'app.main:app', '--host', SIDECAR_HOST, '--port', String(SIDECAR_PORT), '--log-level', 'warning'],
        {
          cwd: serviceDir,
          env: {
            ...process.env,
            PYTHONPATH: serviceDir,
            SERVICE_PORT: String(SIDECAR_PORT),
            SERVICE_HOST: SIDECAR_HOST,
          },
          stdio: ['ignore', 'pipe', 'pipe'],
          detached: false,
        }
      );

      this.process = child;

      child.stdout?.on('data', (data) => {
        const msg = data.toString().trim();
        if (msg) console.log(`[DocGen Sidecar Stdout] ${msg}`);
      });

      child.stderr?.on('data', (data) => {
        const msg = data.toString().trim();
        if (msg) console.warn(`[DocGen Sidecar Stderr] ${msg}`);
      });

      child.on('error', (err) => {
        console.error(`❌ [DocGenerator Sidecar] Erro no processo:`, err);
        this.process = null;
      });

      child.on('close', (code) => {
        console.log(`🛑 [DocGenerator Sidecar] Processo encerrado com código: ${code}`);
        this.process = null;
      });

      // Aguardar até 10 segundos para o serviço responder ao health check
      let retries = 20;
      while (retries > 0) {
        await new Promise((r) => setTimeout(r, 500));
        if (await this.isHealthy()) {
          console.log(`✅ [DocGenerator Sidecar] Microserviço de impressão pronto e operacional em ${LOCAL_DOC_GENERATOR_URL}`);
          break;
        }
        retries--;
      }

      if (retries === 0) {
        console.warn(`⚠️ [DocGenerator Sidecar] O microserviço demorou mais que o esperado para responder, mas o processo foi lançado.`);
      }
    } catch (error: any) {
      console.error(`❌ [DocGenerator Sidecar] Falha ao iniciar sidecar:`, error?.message || error);
    } finally {
      this.isStarting = false;
    }
  }

  /**
   * Encerra o microserviço Python de forma segura
   */
  static stop(): void {
    if (this.process && !this.process.killed) {
      console.log('🛑 [DocGenerator Sidecar] Encerrando microserviço...');
      try {
        this.process.kill('SIGTERM');
      } catch {
        this.process.kill('SIGKILL');
      }
      this.process = null;
    }
  }
}
