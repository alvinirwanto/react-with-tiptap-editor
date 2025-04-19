import { create } from 'zustand';

interface UseUpdateStoreProps {
    isUpdate: boolean;
    setIsUpdate: () => void;
}


const useUpdateStore = create<UseUpdateStoreProps>((set) => ({
    isUpdate: false,
    setIsUpdate: () => set((state) => ({ isUpdate: !state.isUpdate })), // Toggles state
}));

export default useUpdateStore;
