import { ColumnDef } from "@tanstack/react-table";

import { DataProps } from "./type";

import ActionsTableDataPeserta from "./action-table-data-peserta";

export function ColumnsTableDataEvent(refetch: () => void): ColumnDef<DataProps>[] {
    return [
        {
            accessorKey: "id_memo",
            size: 60,
            header: () => <span className="flex justify-center">No.</span>,
            cell: ({ row, table }) => {
                const pagination = table.getState().pagination;
                const isPaginationServer = table.options.manualPagination;

                const rowNumber = isPaginationServer
                    ? (pagination.pageIndex * pagination.pageSize) + row.index + 1
                    : row.index + 1;

                return (
                    <div className='w-full flex justify-center items-center'>
                        <span className='text-[13px] text-center font-medium'>
                            {rowNumber}
                        </span>
                    </div>
                );
            },
            meta: {
                label: 'index',
                active: false
            },

        },
        {
            header: 'Nomor Memo',
            accessorKey: 'no_memo',
            size: 150,
            meta: {
                label: 'Nomor Memo',
                active: true
            },
        },
        {
            header: 'Judul Pelatihan',
            accessorKey: 'judul_pelatihan',
            size: 130,
            meta: {
                label: 'Judul Pelatihan',
                active: true
            },
        },
        {
            header: 'Divisi',   
            accessorKey: 'divisi',
            size: 150,
            meta: {
                label: 'Divisi',
                active: true
            },
        },
        {
            header: 'Sub Kategori Pelatihan',
            accessorKey: 'sub_kategori_pelatihan',
            size: 150,
            meta: {
                label: 'Sub Kategori Pelatihan',
                active: true
            },
        },
        {
            header: 'Jumlah Peserta',
            accessorKey: 'jumlah_peserta',
            size: 150,
            meta: {
                label: 'Jumlah Peserta',
                active: true
            },
        },
        {
            header: 'Status',
            accessorKey: 'status',
            size: 150,
            meta: {
                label: 'Status',
                active: true
            },
        },
        {
            accessorKey: "id_event",
            meta: {
                label: 'Status',
                active: false
            },
            size: 120,
            header: () => <span className="flex justify-center">Action</span>,
            cell: ({ row }) => (
                <ActionsTableDataPeserta
                    row={row}
                    refetch={refetch}
                />
            )
        },
    ];
}