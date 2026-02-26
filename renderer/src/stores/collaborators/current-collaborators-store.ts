import { create } from "zustand";

interface CollaboratorsStore<T> {
  currentCollaborator: T | null;
  setCurrentCollaborator: (collaborator: T | null) => void;
  clearCurrentCollaborator: () => void;
}

export const createCollaboratorsStore = <T,>() => {
  return create<CollaboratorsStore<T>>((set) => ({
    currentCollaborator: null,
    setCurrentCollaborator: (collaborator) => set({ currentCollaborator: collaborator }),
    clearCurrentCollaborator: () => set({ currentCollaborator: null }),
  }));
};

// Exemplo de uso para diferentes entidades:
// export const useClientStore = createEntitiesStore<ClientData>();
// export const useProductStore = createEntitiesStore<ProductData>();
// export const useOrderStore = createEntitiesStore<OrderData>();