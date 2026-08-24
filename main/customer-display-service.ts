import path from 'path';
import { BrowserWindow, screen, shell, app } from 'electron';

export interface CustomerDisplayItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  total: number;
  image?: string;
}

export interface CustomerDisplayStateSnapshot {
  status: 'idle' | 'scanning' | 'payment' | 'completed';
  items: CustomerDisplayItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  receivedValue?: number;
  change?: number;
  paymentMethod?: string;
  storeName?: string;
  clientName?: string;
  customMessage?: string;
}

export class CustomerDisplayService {
  private static window: BrowserWindow | null = null;
  private static isProd = process.env.NODE_ENV === 'production' || app.isPackaged;
  private static currentState: CustomerDisplayStateSnapshot = {
    status: 'idle',
    items: [],
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    storeName: 'Mindgest POS',
  };

  /**
   * Inicializa listeners de monitores (display-added e display-removed)
   */
  static initDisplayListeners(onDisplayChange?: (event: 'added' | 'removed') => void) {
    screen.on('display-added', () => {
      console.log('🖥️ [CustomerDisplay] Novo monitor detectado no sistema.');
      onDisplayChange?.('added');
    });

    screen.on('display-removed', () => {
      console.log('🖥️ [CustomerDisplay] Monitor secundário desconectado.');
      if (this.window && !this.window.isDestroyed()) {
        const displays = screen.getAllDisplays();
        if (displays.length <= 1) {
          this.close();
        }
      }
      onDisplayChange?.('removed');
    });
  }

  /**
   * Retorna o snapshot de estado atual
   */
  static getState(): CustomerDisplayStateSnapshot {
    return this.currentState;
  }

  /**
   * Abre ou reabre a janela do Ecrã de Cliente
   */
  static open(port?: string): boolean {
    if (this.window && !this.window.isDestroyed()) {
      this.window.show();
      this.window.focus();
      return true;
    }

    const displays = screen.getAllDisplays();
    const primaryDisplay = screen.getPrimaryDisplay();
    // Procura monitor secundário diferente do primário
    const secondaryDisplay = displays.find((d) => d.id !== primaryDisplay.id);

    let windowBounds = {
      x: primaryDisplay.bounds.x + 50,
      y: primaryDisplay.bounds.y + 50,
      width: 1024,
      height: 768,
    };

    let isKiosk = false;

    if (secondaryDisplay) {
      windowBounds = {
        x: secondaryDisplay.bounds.x,
        y: secondaryDisplay.bounds.y,
        width: secondaryDisplay.bounds.width,
        height: secondaryDisplay.bounds.height,
      };
      isKiosk = this.isProd; // Kiosk no segundo ecrã em produção
    }

    this.window = new BrowserWindow({
      ...windowBounds,
      kiosk: isKiosk,
      fullscreen: isKiosk,
      frame: !isKiosk,
      autoHideMenuBar: true,
      backgroundColor: '#09090b',
      title: 'Mindgest POS - Ecrã de Cliente',
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        devTools: !this.isProd,
      },
    });

    // Bloquear atalhos do SO no modo kiosk virado ao público
    this.window.webContents.on('before-input-event', (event, input) => {
      if (
        input.key === 'F12' ||
        (input.control && input.shift && input.key.toLowerCase() === 'i') ||
        (input.alt && input.key === 'F4') ||
        input.key === 'F5' ||
        input.key === 'F11'
      ) {
        event.preventDefault();
      }
    });

    // Impedir que o utilizador feche acidentalmente sem o POS principal
    this.window.on('close', (e) => {
      // Se a app não estiver a fechar, apenas oculta ou permite fecho controlado
    });

    this.window.on('closed', () => {
      this.window = null;
    });

    const devPort = port || process.argv[2] || '8888';
    if (!this.isProd) {
      this.window.loadURL(`http://localhost:${devPort}/customer-display`);
    } else {
      this.window.loadURL(`app://./customer-display`);
    }

    return true;
  }

  /**
   * Fecha a janela do Ecrã de Cliente
   */
  static close() {
    if (this.window && !this.window.isDestroyed()) {
      this.window.close();
      this.window = null;
    }
  }

  /**
   * Alterna entre aberto e fechado
   */
  static toggle(port?: string): boolean {
    if (this.isOpen()) {
      this.close();
      return false;
    } else {
      return this.open(port);
    }
  }

  /**
   * Verifica se a janela está aberta
   */
  static isOpen(): boolean {
    return Boolean(this.window && !this.window.isDestroyed());
  }

  /**
   * Atualiza o estado completo e transmite para a janela
   */
  static updateState(partialState: Partial<CustomerDisplayStateSnapshot>) {
    this.currentState = {
      ...this.currentState,
      ...partialState,
    };

    if (this.window && !this.window.isDestroyed()) {
      this.window.webContents.send('customer-display:on-update', this.currentState);
    }
  }

  /**
   * Limpa o estado e volta para a tela de espera
   */
  static clear(storeName?: string) {
    this.currentState = {
      status: 'idle',
      items: [],
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
      storeName: storeName || this.currentState.storeName || 'Mindgest POS',
    };

    if (this.window && !this.window.isDestroyed()) {
      this.window.webContents.send('customer-display:on-update', this.currentState);
    }
  }
}
