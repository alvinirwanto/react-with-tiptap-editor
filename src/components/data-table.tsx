import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    ColumnPinningState,
    ColumnDef,
} from '@tanstack/react-table'

import { useEffect, useState } from 'react'
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, SearchX } from 'lucide-react';

import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { cn } from '@/lib/utils';
import { SkeletonRow } from './ui/skeleton-row';
import { useTableStore } from '@/stores/table-store';

interface DataTableProps<TData extends object> {
    columns: ColumnDef<TData>[];
    data: TData[] | any;
    isLoading?: boolean;
    leftColumnPinning?: string[];
    rightColumnPinning?: string[];
    listLimit?: number[];
    paginationServer?: boolean;
    limit?: number;
    setLimit?: (value: number) => void;
    page?: number;
    setPage?: (value: number) => void;
    total_rows?: number;
    total_pages?: number;
    qa: string;
    table_type?: string;
}

export default function DataTable<TData extends object>({
    columns,
    data,
    qa,
    isLoading = true,
    leftColumnPinning,
    rightColumnPinning,
    listLimit = [10, 20, 30, 50],
    paginationServer,
    limit,
    setLimit,
    page,
    setPage,
    total_rows,
    total_pages,
    table_type
}: Readonly<DataTableProps<TData>>) {

    const [filtering, setFiltering] = useState('');
    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
        left: leftColumnPinning,
        right: rightColumnPinning,
    });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter: filtering,
            columnPinning,
            ...(paginationServer && {
                pagination: {
                    pageIndex: Number(page) - 1,
                    pageSize: Number(limit)
                }
            }),
        },
        manualPagination: paginationServer,
        pageCount: paginationServer ? total_pages : undefined,
        onGlobalFilterChange: setFiltering,
        onColumnPinningChange: setColumnPinning,
    });

    const setTable = useTableStore((state) => state.setTable);

    useEffect(() => {
        setTable(table);
    }, [table]);

    function getCommonPinningStyles<TData>({
        column,
        withBorder = false,
    }: {
        column: any
        /**
         * Whether to show a box shadow on the right side of the last left pinned column or the left side of the first right pinned column.
         * This is useful for creating a border between the pinned columns and the scrollable columns.
         * @default false
         */
        withBorder?: boolean
    }): React.CSSProperties {
        const isPinned = column.getIsPinned()
        const isLastLeftPinnedColumn =
            isPinned === "left" && column.getIsLastColumn("left")
        const isFirstRightPinnedColumn =
            isPinned === "right" && column.getIsFirstColumn("right")

        return {
            boxShadow: withBorder
                ? isLastLeftPinnedColumn
                    ? "-4px 0 4px -4px hsl(var(--border)) inset"
                    : isFirstRightPinnedColumn
                        ? "4px 0 4px -4px hsl(var(--border)) inset"
                        : undefined
                : undefined,
            left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
            right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
            opacity: isPinned ? 0.97 : 1,
            position: isPinned ? "sticky" : "relative",
            background: isPinned ? "#fbfbfb" : "hsl(var(--background))",
            width: column.getSize(),
            zIndex: isPinned ? 1 : 0,
        }
    }

    return (
        <>
            {
                isLoading
                    ? <div className='h-[calc(100vh-250px)]'>
                        <div className='flex items-center gap-4 bg-gray-100 p-3 rounded'>
                            {Array.from({ length: 7 }).map((_, index) => (
                                <Skeleton key={index + 1} className="w-full h-[25px] rounded-md bg-gray-300" />
                            ))}
                        </div>
                        <div className='flex flex-col gap-2'>
                            <SkeletonRow count={7} />
                            <SkeletonRow count={7} />
                            <SkeletonRow count={7} />
                            <SkeletonRow count={7} />
                            <SkeletonRow count={7} />
                            <SkeletonRow count={7} />
                            <SkeletonRow count={7} />
                            <div className='hidden 2xl:flex 2xl:flex-col 2xl:gap-2'>
                                <SkeletonRow count={7} />
                                <SkeletonRow count={7} />
                                <SkeletonRow count={7} />
                                <SkeletonRow count={7} />
                            </div>
                        </div>

                    </div>
                    : <Card className='overflow-auto'>
                        <CardContent className={cn(
                            table_type === 'main'
                                ? 'h-[calc(100vh-280px)]'
                                : table_type === 'sub-title'
                                    ? 'h-[calc(100vh-320px)]'
                                    : 'min-h-[300px] max-h-[400px]',
                            'p-0 w-full overflow-auto')}
                        >
                            <Table
                                className='table-fixed'
                                qa-table={qa}
                                id={qa}
                            >
                                <TableHeader
                                    qa-table='header'
                                    className='sticky top-0 z-50 bg-white shadow-sm w-fit'
                                >
                                    {
                                        table?.getHeaderGroups()?.map((headerGroup) => (
                                            <TableRow
                                                qa-table={`header-row.${qa}`}
                                                key={headerGroup.id}
                                            >
                                                {
                                                    headerGroup?.headers?.map((header, i) => {
                                                        return (
                                                            <TableHead
                                                                key={header.id}
                                                                qa-table={`header-cell.${i}.${qa}`}
                                                                style={{
                                                                    ...getCommonPinningStyles({ column: header.column }),
                                                                }}
                                                                className='!bg-gray-bg px-1 py-3 font-bold'
                                                            >
                                                                {
                                                                    header.isPlaceholder
                                                                        ? null
                                                                        : flexRender(
                                                                            header.column.columnDef.header,
                                                                            header.getContext()
                                                                        )
                                                                }
                                                            </TableHead>
                                                        )
                                                    })
                                                }
                                            </TableRow>
                                        ))
                                    }
                                </TableHeader>

                                <TableBody qa-table='body'>
                                    {
                                        table?.getRowModel()?.rows?.map((row, i_row) => (
                                            <TableRow
                                                key={row.id}
                                                qa-table={`row.${i_row}.${qa}`}
                                                className='break-words'
                                            >
                                                {
                                                    row?.getVisibleCells()?.map((cell, i) => {
                                                        return (
                                                            <TableCell
                                                                key={cell.id}
                                                                qa-table={`cell.${i_row}.${i}.${qa}`}
                                                                className='py-2'
                                                                style={{
                                                                    ...getCommonPinningStyles({ column: cell.column }),
                                                                }}
                                                            >
                                                                {
                                                                    isLoading
                                                                        ? <Skeleton className="w-full h-[30px] bg-gray-300 rounded-sm" />
                                                                        : flexRender(
                                                                            cell.column.columnDef.cell,
                                                                            cell.getContext()
                                                                        )
                                                                }
                                                            </TableCell>
                                                        )
                                                    })
                                                }
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                            {
                                ((data?.length === 0) && !isLoading) && (
                                    <div className='h-[85%] min-h-[300px] max-h-[400px] grid place-items-center'>
                                        <div className='flex flex-col items-center gap-3 text-gray-500'>
                                            <SearchX className='h-10 w-10' />
                                            <span className='text-sm'>Data tidak ditemukan</span>
                                        </div>
                                    </div>
                                )
                            }
                        </CardContent>

                        <CardFooter className='border-t-2 px-4 py-2'>
                            <div className="text-sm md:w-full">
                                {
                                    paginationServer && page && limit && total_rows
                                        ? <div className='hidden xl:block'>
                                            Showing <strong>{(page - 1) * limit + 1}-{Math.min(page * limit, total_rows)}</strong> of <strong>{total_rows}</strong> data
                                        </div>
                                        : <div>
                                            Showing <strong>{table?.getState()?.pagination?.pageIndex * table?.getState()?.pagination?.pageSize + 1}-{Math.min((table?.getState()?.pagination?.pageIndex + 1) * table?.getState()?.pagination?.pageSize, data?.length)}</strong> of <strong>{data?.length}</strong> data
                                        </div>
                                }
                            </div>
                            <ol className="w-full grid grid-cols-2 xl:flex gap-3 text-sm font-medium">
                                <li className='flex w-full justify-between xl:justify-end items-center gap-4'>
                                    <div>
                                        {
                                            paginationServer && setLimit
                                                ? <Select
                                                    qa-select='select-limit-table'
                                                    value={String(limit)}
                                                    onValueChange={value => {
                                                        setLimit(Number(value));
                                                    }}
                                                >
                                                    <SelectTrigger
                                                        qa-select-trigger='select-trigger-table'
                                                        className="w-[70px] scale-90"
                                                    >
                                                        <SelectValue placeholder={limit} />
                                                    </SelectTrigger>
                                                    <SelectContent
                                                        qa-select='select-content-table'
                                                        className="min-w-[75px] z-[999]"
                                                    >
                                                        {listLimit.map((pageSize, i) => (
                                                            <SelectItem
                                                                key={pageSize}
                                                                qa-select-option={pageSize + '-' + i}
                                                                value={String(pageSize)}
                                                            >
                                                                {pageSize}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                : <Select
                                                    qa-select='select-limit-table'
                                                    value={String(table?.getState()?.pagination?.pageSize)}
                                                    onValueChange={value => {
                                                        table?.setPageSize(Number(value))
                                                    }}
                                                >
                                                    <SelectTrigger
                                                        qa-select-trigger='select-trigger-table'
                                                        className="w-[70px] scale-90"
                                                    >
                                                        <SelectValue placeholder={table?.getState()?.pagination?.pageSize} />
                                                    </SelectTrigger>
                                                    <SelectContent
                                                        qa-select='select-content-table'
                                                        className="min-w-[75px] z-[999]"
                                                    >
                                                        {listLimit.map((pageSize, i) => (
                                                            <SelectItem
                                                                key={pageSize}
                                                                qa-select-option={pageSize + '-' + i}
                                                                value={String(pageSize)}
                                                            >
                                                                {pageSize}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                        }
                                    </div>

                                    <div className="hidden xl:flex items-center gap-1">
                                        <div>Page</div>
                                        {
                                            paginationServer
                                                ? <strong>
                                                    {page} from{' '} {total_pages}
                                                </strong>
                                                : <strong>
                                                    {table?.getState()?.pagination?.pageIndex + 1} from{' '}
                                                    {table?.getPageCount()?.toLocaleString()}
                                                </strong>
                                        }
                                    </div>

                                    <div className="hidden md:flex items-center gap-1">
                                        <span>Go to page:</span>
                                        {
                                            paginationServer && setPage && total_pages
                                                ? <input
                                                    qa-input='input-go-to-table'
                                                    type="number"
                                                    min="1"
                                                    max={total_pages}
                                                    defaultValue={page}
                                                    onChange={e => {
                                                        const inputValue = Number(e.target.value);
                                                        let page = inputValue < 1 ? 1 : (inputValue > total_pages ? total_pages : inputValue);
                                                        setPage(page);
                                                        e.target.value = String(page);
                                                    }}
                                                    className="border p-1 rounded w-14 text-center"
                                                />
                                                : <input
                                                    qa-input='input-go-to-table'
                                                    type="number"
                                                    min="1"
                                                    max={table?.getPageCount() || undefined}  // Maximum page index
                                                    defaultValue={table.getState()?.pagination?.pageIndex + 1 || 1}
                                                    onChange={e => {
                                                        const inputValue = Number(e.target.value);

                                                        // Handle empty input case
                                                        if (isNaN(inputValue) || inputValue < 1) {
                                                            table.setPageIndex(0); // or set to a valid minimum, like 1
                                                            return;
                                                        }

                                                        // Calculate the page based on adjusted zero-based index
                                                        let page = inputValue - 1;

                                                        // Clamp the page index within valid bounds
                                                        const maxPages = table?.getPageCount() || 1;
                                                        if (page < 0) {
                                                            page = 0;
                                                        } else if (page >= maxPages) {
                                                            page = maxPages - 1;
                                                        }

                                                        table.setPageIndex(page);
                                                        e.target.value = String(page + 1);
                                                    }}

                                                    className="border p-1 rounded w-14 text-center"
                                                />
                                        }
                                    </div>
                                </li>

                                <li className='flex items-center justify-between'>
                                    {
                                        paginationServer && page && setPage && total_pages
                                            ? <div className='flex gap-2'>
                                                <button
                                                    qa-button='button-go-first-table'
                                                    disabled={page === 1}
                                                    onClick={() => setPage(1)}
                                                    className="disabled:bg-gray-100 disabled:cursor-not-allowed inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 hover:bg-gray-200"
                                                >
                                                    <ChevronFirst className='h-5' />
                                                </button>

                                                <button
                                                    qa-button='button-back-table'
                                                    disabled={page === 1}
                                                    onClick={() => setPage(page - 1)}
                                                    className="disabled:bg-gray-100 disabled:cursor-not-allowed inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 hover:bg-gray-200"
                                                >
                                                    <ChevronLeft className='h-5' />
                                                </button>


                                                <button
                                                    qa-button='button-next-table'
                                                    disabled={page === total_pages}
                                                    onClick={() => setPage(page + 1)}
                                                    className="disabled:bg-gray-100 disabled:cursor-not-allowed inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 hover:bg-gray-200"
                                                >
                                                    <ChevronRight className='h-5' />
                                                </button>


                                                <button
                                                    qa-button='button-go-last-table'
                                                    disabled={page === total_pages}
                                                    onClick={() => setPage(total_pages)}
                                                    className="disabled:bg-gray-100 disabled:cursor-not-allowed inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 hover:bg-gray-200"
                                                >
                                                    <ChevronLast className='h-5' />
                                                </button>
                                            </div>
                                            : <div className='flex gap-2'>
                                                <button
                                                    qa-button='button-go-first-table'
                                                    disabled={!table?.getCanPreviousPage()}
                                                    onClick={() => table?.setPageIndex(0)}
                                                    className="disabled:bg-gray-100 disabled:cursor-not-allowed inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 hover:bg-gray-200"
                                                >
                                                    <ChevronFirst className='h-5' />
                                                </button>

                                                <button
                                                    qa-button='button-back-table'
                                                    disabled={!table?.getCanPreviousPage()}
                                                    onClick={() => table?.previousPage()}
                                                    className="disabled:bg-gray-100 disabled:cursor-not-allowed inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 hover:bg-gray-200"
                                                >
                                                    <ChevronLeft className='h-5' />
                                                </button>


                                                <button
                                                    qa-button='button-next-table'
                                                    disabled={!table?.getCanNextPage()}
                                                    onClick={() => table?.nextPage()}
                                                    className="disabled:bg-gray-100 disabled:cursor-not-allowed inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 hover:bg-gray-200"
                                                >
                                                    <ChevronRight className='h-5' />
                                                </button>


                                                <button
                                                    qa-button='button-go-last-table'
                                                    disabled={!table?.getCanNextPage()}
                                                    onClick={() => table?.setPageIndex(table?.getPageCount() - 1)}
                                                    className="disabled:bg-gray-100 disabled:cursor-not-allowed inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 hover:bg-gray-200"
                                                >
                                                    <ChevronLast className='h-5' />
                                                </button>
                                            </div>
                                    }
                                </li>
                            </ol>
                        </CardFooter>
                    </Card>
            }
        </>
    )
}