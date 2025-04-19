
import type { Table } from "@tanstack/react-table";
import { Check, ListFilter } from "lucide-react";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Button } from "@/components/ui/button";

interface FilterColumnTableDataDeviasiProps<TData> {
    table: Table<TData>;
}

export function FilterColumnTableDataDeviasi<TData>({
    table,
}: Readonly<FilterColumnTableDataDeviasiProps<TData>>) {

    const columnVisibility = table.getState().columnVisibility;

    const columns = React.useMemo(
        () =>
            table
                .getAllColumns()
                .filter(
                    (column) =>
                        typeof column.accessorFn !== "undefined" &&
                        column.getCanHide() &&
                        column.columnDef.meta?.active !== false
                ),
        [table, columnVisibility]
    );

    const [visMap, setVisMap] = React.useState<Record<string, boolean>>({});

    React.useEffect(() => {
        // Sync initial visibility state
        const visibilityState = table
            .getAllColumns()
            .reduce((acc, col) => {
                acc[col.id] = col.getIsVisible();
                return acc;
            }, {} as Record<string, boolean>);

        setVisMap(visibilityState);
    }, [table]);


    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    aria-label="Toggle columns"
                    qa="button-import-peserta"
                    variant='outline'
                    className='flex items-center gap-3 w-[170px]'
                >
                    <ListFilter />
                    Column Visibility
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 p-0" activatePortal>
                <Command>
                    <CommandInput placeholder="Search columns..." />
                    <CommandList>
                        <CommandEmpty>No columns found.</CommandEmpty>
                        <CommandGroup>
                            {columns?.map((column) => {
                                const isVisible = visMap[column.id] ?? column.getIsVisible();

                                return (
                                    <CommandItem
                                        key={column.id}
                                        onSelect={() => {
                                            const newVisibility = !column.getIsVisible();
                                            column.toggleVisibility(newVisibility);

                                            // update local vis state
                                            setVisMap((prev) => ({
                                                ...prev,
                                                [column.id]: newVisibility,
                                            }));
                                        }}
                                    >
                                        <span className="truncate">
                                            {column.columnDef.meta?.label ?? column.id}
                                        </span>
                                        <Check
                                            className={cn(
                                                "ml-auto size-4 shrink-0",
                                                isVisible ? "opacity-100" : "opacity-0"
                                            )}
                                        />

                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
