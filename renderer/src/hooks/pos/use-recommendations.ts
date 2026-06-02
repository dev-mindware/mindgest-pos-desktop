import { useState, useEffect } from "react";
import axios from "axios";
import { useMindPricingConfig } from "./use-mind-pricing";

export function useRecommendations(cartItems: any[]) {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isServerOffline, setIsServerOffline] = useState(false);
  const { isRecommendationsEnabled } = useMindPricingConfig();

  useEffect(() => {
    async function fetchRecommendations() {
      if (!cartItems || cartItems.length === 0) {
        setRecommendations([]);
        return;
      }

      // Se a funcionalidade estiver desativada ou o servidor AI local estiver offline, não fazer chamadas
      if (!isRecommendationsEnabled || isServerOffline) {
        return;
      }

      setLoading(true);
      try {
        const itemIds = cartItems.map((item) => item.id);

        // Call Python Microservice directly
        const response = await axios.post(
          "http://localhost:5001/api/ai/recommend",
          {
            cartItems: itemIds,
            maxRecommendations: 3,
          },
        );

        if (response.data && response.data.recommendations) {
          setRecommendations(response.data.recommendations);
          setIsServerOffline(false); // Servidor online
        }
      } catch (error: any) {
        // Se for erro de rede (serviço Python desligado), ativamos o modo offline
        // temporário para evitar spam de erros vermelhos na consola do navegador.
        if (
          error.code === "ERR_NETWORK" ||
          error.code === "ECONNREFUSED" ||
          !error.response
        ) {
          console.warn("⚠️ [MIND AI] Servidor de recomendações (porta 5001) está offline. Desativando pedidos por 30s.");
          setIsServerOffline(true);
          
          // Tentar novamente em 30 segundos
          const cooldown = setTimeout(() => {
            setIsServerOffline(false);
          }, 30000);
          return () => clearTimeout(cooldown);
        }
        
        console.error("Failed to fetch recommendations:", error);
      } finally {
        setLoading(false);
      }
    }

    // Debounce slightly to avoid spamming the local Python service on every rapid scan
    const handler = setTimeout(() => {
      fetchRecommendations();
    }, 500);

    return () => clearTimeout(handler);
  }, [cartItems, isRecommendationsEnabled, isServerOffline]);

  return { recommendations, loading };
}
