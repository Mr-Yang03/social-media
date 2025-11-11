import { create } from 'zustand';

interface UIState {
  isCreatePostOpen: boolean;
  setCreatePostOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCreatePostOpen: false,
  setCreatePostOpen: (open) => set({ isCreatePostOpen: open }),
}));
