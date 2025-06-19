import { create } from 'zustand';

interface PrimingState {
  userName: string;
  industryKey: string;
  targetRegion: string;
  brandTone: string;
  styleNotes: string;
  setUserName: (name: string) => void;
  setIndustryKey: (industry: string) => void;
  setTargetRegion: (region: string) => void;
  setBrandTone: (tone: string) => void;
  setStyleNotes: (notes: string) => void;
}

export const usePrimingStore = create<PrimingState>((set) => ({
  userName: '',
  industryKey: '',
  targetRegion: '',
  brandTone: '',
  styleNotes: '',
  setUserName: (name) => set({ userName: name }),
  setIndustryKey: (industry) => set({ industryKey: industry }),
  setTargetRegion: (region) => set({ targetRegion: region }),
  setBrandTone: (tone) => set({ brandTone: tone }),
  setStyleNotes: (notes) => set({ styleNotes: notes }),
}));
