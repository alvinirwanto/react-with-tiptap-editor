import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle
} from "@/components/ui/dialog"
import React from "react";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ModalChildrenProps {
    title?: string;
    description?: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    noCloseBackground?: boolean;
}

export default function ModalChildren({
    title,
    description,
    children,
    isOpen,
    onClose,
    noCloseBackground
}: Readonly<ModalChildrenProps>) {

    const onChange = (open: boolean) => {
        if (!open) {
            onClose()
        }
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onChange}
        >
            <DialogContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                showClose
                noCloseBackground={noCloseBackground}
                className="flex flex-col !w-fit min-w-[900px] max-w-[1450px] max-h-[570px] bg-white py-4 px-6 overflow-visible pointer-events-auto"
            >

                {(title || description) && (
                    <div className="flex flex-col gap-1 pt-4 rounded-tl-lg rounded-tr-lg">
                        {title && <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>}
                        {description && <p className="text-[14px] text-slate-500/90">{description}</p>}
                        <hr className='border border-blue-500 mt-3' />
                    </div>
                )}

                <VisuallyHidden>
                    <DialogDescription>Hidden Title</DialogDescription>
                </VisuallyHidden>
                
                <div className="overflow-auto my-4 py-2 pl-[1px] pr-2">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    )
}