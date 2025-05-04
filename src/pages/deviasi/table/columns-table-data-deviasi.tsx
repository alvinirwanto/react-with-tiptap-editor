import { ColumnDef } from "@tanstack/react-table";

import { DataProps } from "./type";
import ActionsTableDataDeviasi from "./action-table-data-deviasi";


export function ColumnsTableDataDeviasi(refetch: () => void): ColumnDef<DataProps>[] {
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
            header: 'Username',
            accessorKey: 'perihal',
            size: 130,
            meta: {
                label: 'Perihal',
                active: true
            },
        },
        {
            header: 'Akademi',   
            accessorKey: 'akademi',
            size: 150,
            meta: {
                label: 'Akademi',
                active: true
            },
        },
        {
            header: 'Kategori Pelatihan',
            accessorKey: 'kategori_pelatihan',
            size: 150,
            meta: {
                label: 'Kategori Pelatihan',
                active: true
            },
        },
        {
            header: 'SLA',
            accessorKey: 'sla',
            size: 150,
            meta: {
                label: 'SLA',
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
                <ActionsTableDataDeviasi
                    row={row}
                    refetch={refetch}
                />
            )
        },
    ];
}