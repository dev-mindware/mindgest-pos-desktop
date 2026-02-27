import Database from "better-sqlite3";
import path from "path";
import { app } from "electron";

const isProd = process.env.NODE_ENV === "production";
const dbPath = isProd
  ? path.join(app.getPath("userData"), "mindgest-pos.db")
  : path.join(process.cwd(), "mindgest-pos-dev.db");

const db = new Database(dbPath);

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS offline_documents (
    id TEXT PRIMARY KEY,
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
`);

export const database = {
  // Document Operations
  saveDocument: (id: string, type: string, payload: any) => {
    const stmt = db.prepare(
      "INSERT OR REPLACE INTO offline_documents (id, type, payload) VALUES (?, ?, ?)",
    );
    return stmt.run(id, type, JSON.stringify(payload));
  },

  getAllDocuments: () => {
    const stmt = db.prepare(
      "SELECT * FROM offline_documents ORDER BY created_at ASC",
    );
    return stmt.all().map((doc: any) => ({
      ...doc,
      payload: JSON.parse(doc.payload),
    }));
  },

  deleteDocument: (id: string) => {
    const stmt = db.prepare("DELETE FROM offline_documents WHERE id = ?");
    return stmt.run(id);
  },

  // Cache Operations
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
        insertStmt.run(client.id, JSON.stringify(client));
      }
    })();
  },

  getCachedProducts: () => {
    const stmt = db.prepare("SELECT data FROM cache_products");
    return stmt.all().map((p: any) => JSON.parse(p.data));
  },

  getCachedClients: () => {
    const stmt = db.prepare("SELECT data FROM cache_clients");
    return stmt.all().map((c: any) => JSON.parse(c.data));
  },
};
