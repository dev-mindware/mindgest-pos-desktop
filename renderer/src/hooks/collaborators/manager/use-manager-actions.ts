import { useModal } from "@/stores/modal/use-modal-store";
import { ManagerResponse } from "@/types";
import { currentManagerStore } from "@/stores/collaborators";

export function useManagerActions() {
  const { openModal } = useModal();
  const { setCurrentManager } = currentManagerStore();

  function handlerEditManager(manager: ManagerResponse) {
    openModal("edit-manager");
    setCurrentManager(manager);
  }

  function handlerDetailsManager(manager: ManagerResponse) {
    openModal("view-manager");
    setCurrentManager(manager);
  }

  function handlerDeleteManager(manager: ManagerResponse) {
    openModal("delete-manager");
    setCurrentManager(manager);
  }

  return {
    handlerDeleteManager,
    handlerDetailsManager,
    handlerEditManager,
  };
}
