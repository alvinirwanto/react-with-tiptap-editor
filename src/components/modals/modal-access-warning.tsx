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

interface ModalAccessWarningProps {
    title?: string;
    description?: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

export default function ModalAccessWarning({
    title,
    description,
    isOpen,
    onClose,
    onConfirm,
    loading
}: Readonly<ModalAccessWarningProps>) {

    const onChange = (open: boolean) => {
        if (!open) {
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent
                onInteractOutside={(e) => {
                    e.preventDefault();
                }}
                className="flex flex-col justify-between !w-[350px] md:!w-[400px] xl:!w-[500px]"
            >
                <DialogHeader className="w-full h-[350px] flex items-center justify-center">
                    <div className="h-24 w-24 grid place-items-center bg-rose-200 text-rose-500 rounded-full">
                        {/* <TriangleAlert className="h-9 w-9" /> */}
                        <Lottie
                            loop={true}
                            play={true}
                            animationData={animationData}
                            style={{ width: 75, height: 75 }}
                            rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
                        />
                    </div>
                    <DialogTitle className="text-2xl pt-7">{title}</DialogTitle>
                    <DialogDescription className="text-center capitalize">{description}</DialogDescription>
                </DialogHeader>
                <div className="w-full flex items-center justify-center gap-4">
                    <Button
                        qa="button-back-modal-access-warning"
                        disabled={loading}
                        qa-button='button-action-back'
                        variant='destructive'
                        className="w-[10rem]"
                        onClick={onConfirm}
                    >
                        Kembali
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}