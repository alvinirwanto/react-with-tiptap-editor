// tableStore.ts
import { create } from 'zustand';
import { Table } from '@tanstack/react-table';

type TableState = {
    table: Table<any> | null;
    setTable: (table: Table<any>) => void;
    clearTable: () => void;
};

export const useTableStore = create<TableState>((set) => ({
    table: null,
    setTable: (table) => set({ table }),
    clearTable: () => set({ table: null }),
}));
