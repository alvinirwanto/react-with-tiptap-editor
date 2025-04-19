import { create } from 'zustand';

interface UnauthorizedStoreProps {
    isDialogUnauthorizedOpen: boolean;
    showDialogUnauthorized: () => void;
    hideDialogUnauthorized: () => void;
}


const useDialogUnauthorizedStore = create<UnauthorizedStoreProps>((set) => ({
    isDialogUnauthorizedOpen: false,
    showDialogUnauthorized: () => set({ isDialogUnauthorizedOpen: true }),
    hideDialogUnauthorized: () => set({ isDialogUnauthorizedOpen: false }),
}));

export default useDialogUnauthorizedStore;
