import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import Lottie from "react-lottie-player";

import animationData from '../../assets/lotties/warning.json';
import { Checkbox } from "../ui/checkbox";
import { useEffect, useState } from "react";


interface ModalWarningProps {
    title: string;
    description?: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (e: any) => void
    loading?: boolean;
    isNeedConfirmation?: boolean;
}

export default function ModalWarning({
    title,
    description,
    isOpen,
    onClose,
    onConfirm,
    isNeedConfirmation,
    loading
}: Readonly<ModalWarningProps>) {

    const onChange = (open: boolean) => {
        if (!open) {
            onClose()
        }
    }

    const [isChecked, setIsChecked] = useState(false);

    // Function to handle change
    const handleCheckboxChange = (checked: boolean) => {
        setIsChecked(checked);
    };

    useEffect(() => {
        if (isOpen) {
            setIsChecked(false)
        }
    }, [isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent
                showClose
                className="flex flex-col justify-between !w-[350px] md:!w-[400px] xl:!w-[500px]"
            >
                <DialogHeader className="w-full h-[350px] flex items-center justify-center">
                    <div className="h-24 w-24 grid place-items-center bg-rose-200 text-rose-500 rounded-full">
                        {/* <TriangleAlert className="h-9 w-9 animate-" /> */}
                        <Lottie
                            loop={true}
                            play={true}
                            animationData={animationData}
                            style={{ width: 75, height: 75 }}
                            rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
                        />
                    </div>
                    <DialogTitle className="text-2xl font-bold tracking-normal pt-7">{title}</DialogTitle>
                    <DialogDescription className="text-center">{description}</DialogDescription>
                </DialogHeader>
                <div className="w-full flex flex-col gap-6">
                    {
                        isNeedConfirmation && (
                            <div className="flex space-x-2 rounded-md border border-gray-300 p-4">
                                <Checkbox
                                    id="terms1"
                                    qa-checkbox='checkbox-confirm'
                                    checked={isChecked} // Controlled state
                                    onCheckedChange={handleCheckboxChange}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label
                                        htmlFor="terms1"
                                        className="text-[13px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Terima Ketentuan
                                    </label>
                                    <p className="text-[12px] leading-4 text-muted-foreground">
                                        Anda terima dengan ketentuan dan konsekuensi dari aksi ini.
                                    </p>
                                </div>
                            </div>
                        )
                    }
                    <div className="w-full grid grid-cols-2 gap-4">
                        <Button
                            type="button"
                            qa='button-cancel-modal-warning'
                            disabled={loading}
                            variant='outline'
                            onClick={onClose}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            qa='button-submit-modal-warning'
                            disabled={isNeedConfirmation ? !isChecked : loading}
                            variant='destructive'
                            onClick={onConfirm}
                        >
                            {isNeedConfirmation ? 'Lanjutkan' : 'Ya, Saya yakin'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}