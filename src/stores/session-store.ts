import { create } from 'zustand';

interface SessionEndStoreProps {
    isDialogOpen: boolean;
    showDialog: () => void;
    hideDialog: () => void;
}


const useDialogSessionStore = create<SessionEndStoreProps>((set) => ({
    isDialogOpen: false,
    showDialog: () => set({ isDialogOpen: true }),
    hideDialog: () => set({ isDialogOpen: false }),
}));

export default useDialogSessionStore;
