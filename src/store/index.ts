import { create } from 'zustand';

interface UserState {
  gems: number;
  userId: string | null;
  setGems: (gems: number) => void;
  setUserId: (userId: string) => void;
  decrementGems: (amount: number) => void;
  incrementGems: (amount: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  gems: 0,
  userId: null,
  setGems: (gems) => set({ gems }),
  setUserId: (userId) => set({ userId }),
  decrementGems: (amount) => set((state) => ({ gems: Math.max(0, state.gems - amount) })),
  incrementGems: (amount) => set((state) => ({ gems: state.gems + amount })),
}));

interface GalleryState {
  images: any[];
  setImages: (images: any[]) => void;
  addImage: (image: any) => void;
  updateImage: (id: string, updates: any) => void;
}

export const useGalleryStore = create<GalleryState>((set) => ({
  images: [],
  setImages: (images) => set({ images }),
  addImage: (image) => set((state) => ({ images: [...state.images, image] })),
  updateImage: (id, updates) => set((state) => ({
    images: state.images.map((img) => img.id === id ? { ...img, ...updates } : img),
  })),
}));
