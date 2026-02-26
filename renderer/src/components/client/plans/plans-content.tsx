"use client";
import { usePlans } from "@/hooks";
import { InfoBanner, PlansPageSkeleton, RequestError } from "@/components";
import { useAuth } from "@/hooks/auth";
import { CurrentPlanCard } from "./current-plan-card";
import { WithoutActivePlan } from "./without-active-plan";

export function PlansAvailableInfo() {
  const { user } = useAuth();
  const { plans, isLoading, error, refetch } = usePlans();

  if (error)
    return (
      <RequestError
        message="Ocorreu um erro ao buscar os planos"
        refetch={refetch}
      />
    );

  const currentPlan = plans.find(
    (p) => p.id === user?.company?.subscription?.plan.id
  );
  const hasSubscription = !!currentPlan;

  return (
    <div className="space-y-4">
      <InfoBanner
        title="Planos"
        description="Gerencie seu plano e explore opções de upgrade"
      />

      {isLoading ? (
        <PlansPageSkeleton />
      ) : (
        <div className="bgre4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="sm:col-span-2 space-y-6">
              {hasSubscription ? (
                <CurrentPlanCard currentPlan={currentPlan!} />
              ) : (
                <WithoutActivePlan />
              )}

              {/* <AvailablePlans
                plans={plans}
                currentPlanId={currentPlan?.id}
                hasActiveSubscription={hasSubscription}
              /> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}