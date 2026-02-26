import { useEffect } from "react";
import { useAuth } from "@/hooks/auth";
import { useGetStores } from "@/hooks/entities";
import { useModal } from "@/stores";
import { currentStoreStore } from "@/stores/store/current-store-store";
import { Role } from "@/types";

export function useSidebarCompanyInfo() {
  const { user } = useAuth();
  const { openModal } = useModal();
  const { currentStore, setCurrentStore } = currentStoreStore();

  const isCashier = user?.role === "CASHIER";
  const userRole = user?.role as Role;

  const { storesData, error, isLoading, refetch } = useGetStores(userRole);

  useEffect(() => {
    if (!currentStore && storesData && storesData.length > 0) {
      setCurrentStore(storesData[0]);
    }
  }, [storesData, currentStore, setCurrentStore]);

  function onAddStore() {
    openModal("add-store");
  }

  function onSelectStore(store: any) {
    setCurrentStore(store);
  }

  return {
    user,
    isCashier,
    currentStore,
    storesData,
    error,
    isLoading,
    refetch,
    onAddStore,
    onSelectStore,
  };
}
