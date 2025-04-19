// stores/sidebarStore.ts
import { create } from 'zustand';

interface SidebarStore {
    showSideBar: boolean;
    setShowSideBar: (value: boolean | ((prevState: boolean) => boolean)) => void;
    toggleSideBar: () => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
    showSideBar: false,
    setShowSideBar: (value) => set((state) => ({
        showSideBar: typeof value === 'function' ? value(state.showSideBar) : value
    })),
    toggleSideBar: () => set((state) => ({ showSideBar: !state.showSideBar })),
}));
