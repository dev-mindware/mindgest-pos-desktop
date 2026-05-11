import { prisma } from "./prisma";
import axios from "axios";

// Configurações da API Cloud (Poderia vir de variáveis de ambiente)
const CLOUD_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const syncService = {
  /**
   * Sincroniza todos os produtos da Cloud para o SQLite Local
   */
  syncProducts: async (token: string, storeId: string) => {
    try {
      console.log("🔄 [Sync] A iniciar sincronização de produtos...");
      
      const response = await axios.get(`${CLOUD_API_URL}/items`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 1000, storeId } // Tentamos buscar todos de uma vez para o POS
      });

      const cloudItems = response.data.data;

      for (const item of cloudItems) {
        await prisma.item.upsert({
          where: { cloudId: item.id },
          update: {
            name: item.name,
            description: item.description,
            code: item.sku,
            barcode: item.barcode,
            price: item.price,
            stock: item.quantity || 0,
            taxPercent: item.tax?.rate || 14.0,
            categoryId: item.categoryId,
            storeId: storeId,
            isActive: item.status === 'ACTIVE'
          },
          create: {
            cloudId: item.id,
            name: item.name,
            description: item.description,
            code: item.sku,
            barcode: item.barcode,
            price: item.price,
            stock: item.quantity || 0,
            taxPercent: item.tax?.rate || 14.0,
            categoryId: item.categoryId,
            storeId: storeId,
            isActive: item.status === 'ACTIVE'
          }
        });
      }

      console.log(`✅ [Sync] ${cloudItems.length} produtos sincronizados.`);
      return { success: true, count: cloudItems.length };
    } catch (error: any) {
      console.error("❌ [Sync] Erro ao sincronizar produtos:", error.message);
      throw error;
    }
  },

  /**
   * Sincroniza clientes da Cloud para Local
   */
  syncClients: async (token: string, storeId: string) => {
    try {
      console.log("🔄 [Sync] A iniciar sincronização de clientes...");
      
      const response = await axios.get(`${CLOUD_API_URL}/clients`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 1000, storeId }
      });

      const cloudClients = response.data.data;

      for (const client of cloudClients) {
        await prisma.client.upsert({
          where: { cloudId: client.id },
          update: {
            name: client.name,
            nif: client.nif,
            email: client.email,
            phone: client.phone,
            address: client.address,
            storeId: storeId
          },
          create: {
            cloudId: client.id,
            name: client.name,
            nif: client.nif,
            email: client.email,
            phone: client.phone,
            address: client.address,
            storeId: storeId
          }
        });
      }

      console.log(`✅ [Sync] ${cloudClients.length} clientes sincronizados.`);
      return { success: true, count: cloudClients.length };
    } catch (error: any) {
      console.error("❌ [Sync] Erro ao sincronizar clientes:", error.message);
      throw error;
    }
  }
};
