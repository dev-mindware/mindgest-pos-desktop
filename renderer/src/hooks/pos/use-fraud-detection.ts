import axios from "axios";
import { toast } from "sonner"; // Using the sonner toast available in the project

export function useFraudDetection() {
  const checkFraud = async (eventType: string, thresholdPeople: number = 2) => {
    try {
      // Call the Python MIND Microservice
      const response = await axios.post(
        "http://localhost:5001/api/ai/fraud-check",
        {
          eventType,
          thresholdPeople,
        },
      );

      if (response.data && response.data.alert) {
        // Log locally or show alert (depending on store policy)
        console.warn(`[MIND AI FRAUD ALERT] ${response.data.message}`);

        // Let's notify the manager UI or log it securely
        toast.warning(`Alerta de Segurança 🛡️`, {
          description: `Evento suspeito detectado: ${eventType} (${response.data.message})`,
          duration: 8000,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Fraud detection failed to execute:", error);
      return false; // Fail open
    }
  };

  return { checkFraud };
}
