import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import Lottie from "react-lottie-player";

import animationData from '../../assets/lotties/success.json';


interface ModalSuccessProps {
    title: string;
    description: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

export default function ModalSuccess({
    title,
    description,
    isOpen,
    onClose,
    onConfirm,
    loading
}: Readonly<ModalSuccessProps>) {

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
                    <div className="h-24 w-24 grid place-items-center bg-green-100 text-green-500 rounded-full">
                        {/* <CircleCheck className="h-12 w-12" /> */}
                        <Lottie
                            loop={false}
                            play={true}
                            // speed={.8}
                            animationData={animationData}
                            style={{ width: 55, height: 55 }}
                            rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
                        />
                    </div>
                    <DialogTitle className="text-2xl pt-7 font-bold">{title}</DialogTitle>
                    <DialogDescription className="text-center">{description}</DialogDescription>
                </DialogHeader>
                <div className="w-full flex items-center justify-center gap-4">
                    <Button
                        qa='button-close-modal-success'
                        disabled={loading}
                        className="text-green-500 bg-green-50 hover:text-white hover:bg-green-500 px-8"
                        onClick={onConfirm}
                    >
                        Tutup
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}