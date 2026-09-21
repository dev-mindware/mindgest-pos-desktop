import Database from "better-sqlite3";
import path from "path";
import crypto from "crypto";
import { app } from "electron";
import { SafeVault } from "./storage-key";

const isProd = process.env.NODE_ENV === "production";
const dbPath = isProd
  ? path.join(app.getPath("userData"), "mindgest-pos.db")
  : path.join(process.cwd(), "mindgest-pos-dev.db");

const db = new Database(dbPath);

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS offline_documents (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    payload TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS cache_products (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS cache_clients (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event TEXT NOT NULL,
    actor_id TEXT,
    details TEXT,
    ts DATETIME DEFAULT CURRENT_TIMESTAMP,
    prev_hash TEXT NOT NULL DEFAULT '',
    row_hash TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS db_metadata (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Migration: add user_id column if it doesn't exist yet (for existing DBs)
try {
  db.exec(
    `ALTER TABLE offline_documents ADD COLUMN user_id TEXT NOT NULL DEFAULT 'unknown'`,
  );
} catch {
  // Column already exists — safe to ignore
}

// ==========================================
// In-Memory Decryption Cache (TTL-based)
// ==========================================
interface CacheEntry<T> {
  data: T;
  ts: number;
}

let cachedClientsEntry: CacheEntry<any[]> | null = null;
const CLIENTS_CACHE_TTL_MS = 60 * 1000; // 60 segundos

const cachedDocsByUser = new Map<string, CacheEntry<any[]>>();
const DOCS_CACHE_TTL_MS = 120 * 1000; // 120 segundos

// ==========================================
// Payload Encoding / Decoding Helpers
// ==========================================

export function encodePayload(obj: any): string {
  const jsonStr = JSON.stringify(obj);
  const encrypted = SafeVault.encrypt(jsonStr);
  return `enc:v1:${encrypted}`;
}

export function decodePayload(raw: string, recordId?: string, tableName?: string): any {
  if (!raw || typeof raw !== 'string') return null;

  // Estado 1: Encriptado com prefixo de versão
  if (raw.startsWith('enc:v1:')) {
    const ciphertext = raw.substring('enc:v1:'.length);
    try {
      const decryptedJson = SafeVault.decrypt(ciphertext);
      return JSON.parse(decryptedJson);
    } catch (err: any) {
      console.error(`❌ [Database] Erro ao desencriptar payload (${tableName || 'unknown'}:${recordId || 'unknown'}):`, err);
      database.logAuditEvent('PAYLOAD_CORRUPTED', 'SYSTEM', {
        table: tableName,
        recordId,
        error: err?.message || String(err)
      });
      const error: any = new Error(`ERR_PAYLOAD_CORRUPTED: Falha ao decifrar registo ${recordId || ''}`);
      error.code = 'ERR_PAYLOAD_CORRUPTED';
      throw error;
    }
  }

  // Estado 2: Legado / Não encriptado (começa por '{' ou '[')
  const trimmed = raw.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      return JSON.parse(raw);
    } catch (err: any) {
      console.error(`❌ [Database] Erro ao analisar JSON legado (${tableName || 'unknown'}:${recordId || 'unknown'}):`, err);
      database.logAuditEvent('PAYLOAD_CORRUPTED', 'SYSTEM', {
        table: tableName,
        recordId,
        error: err?.message || String(err)
      });
      const error: any = new Error(`ERR_PAYLOAD_CORRUPTED: Formato JSON inválido no registo ${recordId || ''}`);
      error.code = 'ERR_PAYLOAD_CORRUPTED';
      throw error;
    }
  }

  // Estado 3: Corrompido / Formato desconhecido
  database.logAuditEvent('PAYLOAD_CORRUPTED', 'SYSTEM', {
    table: tableName,
    recordId,
    preview: raw.substring(0, 50)
  });
  const error: any = new Error(`ERR_PAYLOAD_CORRUPTED: Conteúdo corrompido no registo ${recordId || ''}`);
  error.code = 'ERR_PAYLOAD_CORRUPTED';
  throw error;
}

export const database = {
  // Document Operations — always scoped by userId
  saveDocument: (id: string, userId: string, type: string, payload: any) => {
    const stmt = db.prepare(
      "INSERT OR REPLACE INTO offline_documents (id, user_id, type, payload) VALUES (?, ?, ?, ?)",
    );
    const encoded = encodePayload(payload);
    const result = stmt.run(id, userId, type, encoded);
    // Invalidar cache de documentos do utilizador
    cachedDocsByUser.delete(userId);
    return result;
  },

  getAllDocuments: (userId: string) => {
    const now = Date.now();
    const cached = cachedDocsByUser.get(userId);
    if (cached && (now - cached.ts) < DOCS_CACHE_TTL_MS) {
      return cached.data;
    }

    const stmt = db.prepare(
      "SELECT * FROM offline_documents WHERE user_id = ? ORDER BY created_at ASC",
    );
    const rows = stmt.all(userId);
    const documents = rows.map((doc: any) => ({
      ...doc,
      payload: decodePayload(doc.payload, doc.id, 'offline_documents'),
    }));

    cachedDocsByUser.set(userId, { data: documents, ts: now });
    return documents;
  },

  deleteDocument: (id: string, userId: string) => {
    const stmt = db.prepare(
      "DELETE FROM offline_documents WHERE id = ? AND user_id = ?",
    );
    const result = stmt.run(id, userId);
    cachedDocsByUser.delete(userId);
    return result;
  },

  clearAllDocuments: (userId: string) => {
    const stmt = db.prepare("DELETE FROM offline_documents WHERE user_id = ?");
    const result = stmt.run(userId);
    cachedDocsByUser.delete(userId);
    return result;
  },

  // Cache Operations (store-level, not user-level)
  updateProductsCache: (products: any[]) => {
    const deleteStmt = db.prepare("DELETE FROM cache_products");
    const insertStmt = db.prepare(
      "INSERT INTO cache_products (id, data) VALUES (?, ?)",
    );

    db.transaction(() => {
      deleteStmt.run();
      for (const product of products) {
        insertStmt.run(product.id, JSON.stringify(product));
      }
    })();
  },

  updateClientsCache: (clients: any[]) => {
    const deleteStmt = db.prepare("DELETE FROM cache_clients");
    const insertStmt = db.prepare(
      "INSERT INTO cache_clients (id, data) VALUES (?, ?)",
    );

    db.transaction(() => {
      deleteStmt.run();
      for (const client of clients) {
        insertStmt.run(client.id, encodePayload(client));
      }
    })();

    cachedClientsEntry = { data: clients, ts: Date.now() };
  },

  getCachedProducts: () => {
    const stmt = db.prepare("SELECT data FROM cache_products");
    return stmt.all().map((p: any) => JSON.parse(p.data));
  },

  getCachedClients: () => {
    const now = Date.now();
    if (cachedClientsEntry && (now - cachedClientsEntry.ts) < CLIENTS_CACHE_TTL_MS) {
      return cachedClientsEntry.data;
    }

    const stmt = db.prepare("SELECT id, data FROM cache_clients");
    const rows = stmt.all();
    const clients = rows.map((c: any) => decodePayload(c.data, c.id, 'cache_clients'));

    cachedClientsEntry = { data: clients, ts: now };
    return clients;
  },

  // ==========================================
  // Audit Log com Encadeamento Criptográfico (Hash Chaining)
  // ==========================================
  logAuditEvent: (event: string, actorId?: string, details?: any) => {
    try {
      const lastRow = db.prepare("SELECT row_hash FROM audit_log ORDER BY id DESC LIMIT 1").get() as { row_hash: string } | undefined;
      const prevHash = lastRow?.row_hash || "";
      const detailsStr = details ? (typeof details === "string" ? details : JSON.stringify(details)) : "";
      const ts = new Date().toISOString();

      const rowHash = crypto
        .createHash("sha256")
        .update(prevHash + event + (actorId || "") + detailsStr + ts)
        .digest("hex");

      const insertStmt = db.prepare(
        "INSERT INTO audit_log (event, actor_id, details, ts, prev_hash, row_hash) VALUES (?, ?, ?, ?, ?, ?)"
      );
      insertStmt.run(event, actorId || null, detailsStr, ts, prevHash, rowHash);
      return { success: true, rowHash };
    } catch (err) {
      console.error("❌ [Database] Falha ao registar evento de auditoria:", err);
      return { success: false, error: err };
    }
  },

  getAuditLogs: (limit: number = 100) => {
    const stmt = db.prepare("SELECT * FROM audit_log ORDER BY id DESC LIMIT ?");
    return stmt.all(limit);
  },

  /**
   * Verifica a integridade da cadeia do Audit Log a partir do último checkpoint confirmado localmente.
   */
  verifyAuditChain: (fromCheckpointHash?: string): {
    valid: boolean;
    brokenAt?: number;
    lastRowHash: string;
    lastCheckpointHash: string;
    firstNewPrevHash?: string;
  } => {
    try {
      let checkpointHash = fromCheckpointHash || "";
      if (!checkpointHash) {
        const meta = db.prepare("SELECT value FROM db_metadata WHERE key = 'lastConfirmedCheckpointHash'").get() as { value: string } | undefined;
        checkpointHash = meta?.value || "";
      }

      let rows: any[] = [];
      if (checkpointHash) {
        const startRow = db.prepare("SELECT id FROM audit_log WHERE row_hash = ?").get(checkpointHash) as { id: number } | undefined;
        if (startRow) {
          rows = db.prepare("SELECT * FROM audit_log WHERE id >= ? ORDER BY id ASC").all(startRow.id);
        } else {
          rows = db.prepare("SELECT * FROM audit_log ORDER BY id ASC").all();
        }
      } else {
        rows = db.prepare("SELECT * FROM audit_log ORDER BY id ASC").all();
      }

      if (rows.length === 0) {
        return { valid: true, lastRowHash: "", lastCheckpointHash: checkpointHash };
      }

      let expectedPrevHash = rows[0].prev_hash;
      const firstNewPrevHash = rows[0].prev_hash;

      for (const row of rows) {
        // Se encontramos uma quebra intencional registada após reset
        if (row.event === 'CHAIN_INTEGRITY_RESET' && row.prev_hash === '') {
          expectedPrevHash = row.row_hash;
          continue;
        }

        if (row.prev_hash !== expectedPrevHash) {
          console.error(`🚨 [AuditLog] Cadeia corrompida no ID ${row.id}: prev_hash esperado ${expectedPrevHash}, obtido ${row.prev_hash}`);
          // Registar re-ancoragem da cadeia
          database.logAuditEvent('CHAIN_INTEGRITY_RESET', 'SYSTEM', { brokenAtId: row.id, expectedPrevHash, actualPrevHash: row.prev_hash });
          return { valid: false, brokenAt: row.id, lastRowHash: row.row_hash, lastCheckpointHash: checkpointHash, firstNewPrevHash };
        }

        // Recomputar hash da linha
        const recomputed = crypto
          .createHash("sha256")
          .update(row.prev_hash + row.event + (row.actor_id || "") + (row.details || "") + row.ts)
          .digest("hex");

        if (recomputed !== row.row_hash) {
          console.error(`🚨 [AuditLog] Hash de linha adulterado no ID ${row.id}!`);
          database.logAuditEvent('CHAIN_INTEGRITY_RESET', 'SYSTEM', { tamperedRowId: row.id });
          return { valid: false, brokenAt: row.id, lastRowHash: row.row_hash, lastCheckpointHash: checkpointHash, firstNewPrevHash };
        }

        expectedPrevHash = row.row_hash;
      }

      const lastRow = rows[rows.length - 1];
      return {
        valid: true,
        lastRowHash: lastRow ? lastRow.row_hash : "",
        lastCheckpointHash: checkpointHash,
        firstNewPrevHash
      };
    } catch (err) {
      console.error("❌ [Database] Erro ao verificar cadeia de auditoria:", err);
      return { valid: false, lastRowHash: "", lastCheckpointHash: "" };
    }
  },

  /**
   * Guarda o último hash de checkpoint confirmado
   */
  setConfirmedCheckpointHash: (hash: string) => {
    const stmt = db.prepare("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('lastConfirmedCheckpointHash', ?)");
    stmt.run(hash);
  },

  /**
   * Cria um checkpoint de auditoria semestral se devido
   */
  createCheckpointIfDue: () => {
    try {
      const lastCheckpoint = db.prepare(
        "SELECT * FROM audit_log WHERE event = 'AUDIT_CHECKPOINT' ORDER BY id DESC LIMIT 1"
      ).get() as any;

      const SIX_MONTHS_MS = 180 * 24 * 60 * 60 * 1000;
      const now = Date.now();

      if (!lastCheckpoint || (now - new Date(lastCheckpoint.ts).getTime()) > SIX_MONTHS_MS) {
        console.log("📌 [AuditLog] Criando checkpoint semestral de auditoria...");
        database.logAuditEvent('AUDIT_CHECKPOINT', 'SYSTEM', {
          reason: 'SEMI_ANNUAL_CHECKPOINT',
          createdAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.warn("⚠️ [AuditLog] Erro ao verificar/criar checkpoint semestral:", err);
    }
  },

  /**
   * Migração One-Shot: Encripta todos os registos existentes em lotes de 500
   */
  runPayloadEncryptionMigration: () => {
    try {
      const meta = db.prepare("SELECT value FROM db_metadata WHERE key = 'payloadEncryptionDone'").get() as { value: string } | undefined;
      if (meta && meta.value === 'true') {
        return { status: 'already_migrated' };
      }

      console.log("🔐 [Migration] Iniciando migração de encriptação de payloads (offline_documents & cache_clients)...");
      let totalDocsMigrated = 0;
      let totalClientsMigrated = 0;

      // 1. Migrar offline_documents em lotes de 500
      const selectDocsStmt = db.prepare("SELECT id, payload FROM offline_documents WHERE payload NOT LIKE 'enc:v1:%' LIMIT 500");
      const updateDocStmt = db.prepare("UPDATE offline_documents SET payload = ? WHERE id = ?");

      while (true) {
        const batch = selectDocsStmt.all() as { id: string; payload: string }[];
        if (batch.length === 0) break;

        db.transaction(() => {
          for (const row of batch) {
            try {
              let parsed: any;
              const trimmed = row.payload.trim();
              if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
                parsed = JSON.parse(row.payload);
              } else {
                continue;
              }
              const encrypted = encodePayload(parsed);
              updateDocStmt.run(encrypted, row.id);
              totalDocsMigrated++;
            } catch (e) {
              console.warn(`⚠️ [Migration] Falha ao migrar documento ${row.id}:`, e);
            }
          }
        })();
      }

      // 2. Migrar cache_clients em lotes de 500
      const selectClientsStmt = db.prepare("SELECT id, data FROM cache_clients WHERE data NOT LIKE 'enc:v1:%' LIMIT 500");
      const updateClientStmt = db.prepare("UPDATE cache_clients SET data = ? WHERE id = ?");

      while (true) {
        const batch = selectClientsStmt.all() as { id: string; data: string }[];
        if (batch.length === 0) break;

        db.transaction(() => {
          for (const row of batch) {
            try {
              let parsed: any;
              const trimmed = row.data.trim();
              if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
                parsed = JSON.parse(row.data);
              } else {
                continue;
              }
              const encrypted = encodePayload(parsed);
              updateClientStmt.run(encrypted, row.id);
              totalClientsMigrated++;
            } catch (e) {
              console.warn(`⚠️ [Migration] Falha ao migrar cliente ${row.id}:`, e);
            }
          }
        })();
      }

      // Marcar migração como concluída
      db.prepare("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('payloadEncryptionDone', 'true')").run();

      database.logAuditEvent('PAYLOAD_MIGRATION_COMPLETED', 'SYSTEM', {
        docsMigrated: totalDocsMigrated,
        clientsMigrated: totalClientsMigrated
      });

      console.log(`✅ [Migration] Concluída com sucesso: ${totalDocsMigrated} documentos e ${totalClientsMigrated} clientes encriptados.`);
      return { status: 'success', totalDocsMigrated, totalClientsMigrated };
    } catch (err) {
      console.error("❌ [Migration] Erro durante a migração de encriptação:", err);
      return { status: 'error', error: err };
    }
  }
};

