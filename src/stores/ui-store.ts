import { create } from 'zustand';

interface UIState {
  isCreatePostOpen: boolean;
  setCreatePostOpen: (open: boolean) => void;
  isEditPostOpen: boolean;
  setEditPostOpen: (open: boolean) => void;
  editingPostId: string | number | null;
  setEditingPostId: (id: string | number | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCreatePostOpen: false,
  setCreatePostOpen: (open) => set({ isCreatePostOpen: open }),
  isEditPostOpen: false,
  setEditPostOpen: (open) => set({ isEditPostOpen: open }),
  editingPostId: null,
  setEditingPostId: (id) => set({ editingPostId: id }),
}));
