import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, Download, Eye, History, SquareCheckBig } from 'lucide-react'
import { useState } from "react";

interface ActionsTableDataDeviasi {
    row?: any;
    refetch?: () => void;
}
export default function ActionsTableDataDeviasi({
    row,
    refetch,
}: Readonly<ActionsTableDataDeviasi>) {
    console.log(row);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const navigate = useNavigate()

    return (
        <div>
            <div className='w-full flex justify-center'>
                <DropdownMenu
                    open={isDropdownOpen}
                    onOpenChange={setIsDropdownOpen}
                >
                    <DropdownMenuTrigger asChild>
                        <Button
                            qa='button-more-action'
                            variant="ghost"
                            size='sm'
                            className="bg-blue-100 text-blue-pnm font-semibold flex items-center space-x-2 rounded-md text-[13px]"
                        >
                            <span>Aksi</span>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            qa-button='button-view'
                            onClick={() => navigate({ to: '/deviasi/list' })}
                            className='flex gap-2 cursor-pointer text-[15px]'
                        >
                            <Eye className='h-4.5' />
                            <span>Lihat</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            qa-button='button-view'
                            onClick={() => navigate({ to: '/deviasi/list' })}
                            className='flex gap-2 cursor-pointer text-[15px]'
                        >
                            <SquareCheckBig className='h-4' />
                            <span>Approval</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            qa-button='button-view'
                            onClick={() => navigate({ to: '/deviasi/list' })}
                            className='flex gap-2 cursor-pointer text-[15px]'
                        >
                            <Download className='h-4' />
                            <span>Download</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            qa-button='button-view'
                            onClick={() => navigate({ to: '/deviasi/list' })}
                            className='flex gap-2 cursor-pointer text-[15px]'
                        >
                            <History className='h-4' />
                            <span>Riwayat Pengajuan</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}