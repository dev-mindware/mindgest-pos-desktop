import { useState, useEffect } from "react";
import axios from "axios";
import { Product } from "@/types";

export function useRecommendations(cartItems: any[]) {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchRecommendations() {
      if (!cartItems || cartItems.length === 0) {
        setRecommendations([]);
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
        }
      } catch (error: any) {
        // Se for erro de rede (serviço Python desligado), ignoramos silenciosamente
        // para não poluir a consola, visto que as recomendações não são críticas para o POS
        if (error.code !== "ERR_NETWORK" && error.code !== "ECONNREFUSED") {
          console.error("Failed to fetch recommendations:", error);
        }
      } finally {
        setLoading(false);
      }
    }

    // Debounce slightly to avoid spamming the local Python service on every rapid scan
    const handler = setTimeout(() => {
      fetchRecommendations();
    }, 500);

    return () => clearTimeout(handler);
  }, [cartItems]);

  return { recommendations, loading };
}
