import { create } from 'zustand';

/** Pedido de abrir um baú agora (do cartão da tela inicial ou da aba de metas); o ChestHost mostra e limpa. */
interface ChestUi {
  requested: 'daily' | 'weekly' | null;
  request: (kind: 'daily' | 'weekly') => void;
  clear: () => void;
}

export const useChestUi = create<ChestUi>((set) => ({
  requested: null,
  request: (kind) => set({ requested: kind }),
  clear: () => set({ requested: null }),
}));
