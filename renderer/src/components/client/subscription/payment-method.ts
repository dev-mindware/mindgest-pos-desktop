import { MethodName, Method } from "@/types";

type MyMethod = Record<MethodName, Method>;

export const paymentMethods: MyMethod = {
   "Kwik": {
    name: "Kwik",
    icon: "kwik.png",
    description: "Pagamento via Kwik",
    info: "Pagamento feito no seguinte IBAN . O pagamento é confirmado na hora e você recebe acesso instantâneo ao seu plano.",
    processingTime: "Instantâneo",
    reference: "000500000933180510115",
    owner: "MINDWARE - Comércio e Serviços",
  },
  "Express": {
    name: "Express",
    icon: "express.png",
    description: "Pagamento instantâneo",
    info: "Pagamento feito no seguinte 'N° 926679831'. O pagamento é confirmado na hora e você recebe acesso instantâneo ao seu plano.",
    processingTime: "Instantâneo",
    reference: "926 898 800",
    owner: "MINDWARE - Comércio e Serviços",
  },
};