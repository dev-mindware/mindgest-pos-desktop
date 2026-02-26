import { subscriptionService } from "@/services";
import { SubscriptionFormData } from "@/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubscriptionFormData) => subscriptionService.createSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["current-subscription"] });
    },
  });
}
