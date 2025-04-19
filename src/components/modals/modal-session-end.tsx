import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import useDialogSessionStore from "@/stores/session-store";

import animationData from '../../assets/lotties/history.json';
import Lottie from "react-lottie-player";

export default function ModalSessionEnd() {

    const { isDialogOpen, hideDialog } = useDialogSessionStore();
    const [seconds, setSeconds] = useState(10);
    // const navigate = useNavigate()

    function handleSessionEnd() {
        if (!isDialogOpen) {
            return;
        }

        if (localStorage.getItem("user-auth-pass")) {
            localStorage.removeItem("user-auth-pass");
        }

        hideDialog();
        // window.location.replace(localStorage.getItem('portal-url') + 'login')
        window.location.replace('/login')
    }

    useEffect(() => {
        if (!isDialogOpen) {
            return;
        }

        const countdownTimer = setInterval(() => {
            setSeconds((prevSeconds) => prevSeconds - 1);
        }, 1000);

        const redirectTimer = setTimeout(() => {
            hideDialog();
            handleSessionEnd()
        }, 10000);

        return () => {
            clearInterval(countdownTimer);
            clearTimeout(redirectTimer);
        };
    }, [isDialogOpen, hideDialog]);

    return (
        <Dialog open={isDialogOpen}>
            <DialogContent
                onInteractOutside={(e) => {
                    e.preventDefault();
                }}
                className="flex flex-col justify-between !w-[350px] md:!w-[400px] xl:!w-[500px]"
            >
                <DialogHeader className="w-full h-[300px] flex items-center justify-center">
                    <div className="h-24 w-24 flex justify-center items-center p-0 m-0 bg-rose-200 text-rose-500 rounded-full">
                        {/* <History className="h-9 w-9" /> */}
                        <Lottie
                            className="pt-2 pl-1"
                            loop={true}
                            play={true}
                            // speed={.8}
                            animationData={animationData}
                            style={{ width: 130, height: 130 }}
                            rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
                        />
                    </div>
                    <DialogTitle className="text-2xl pt-7 font-bold">Session Anda telah habis</DialogTitle>
                    <DialogDescription className="text-center">Silahkan login kembali untuk mengakses kembali fitur yang tersedia.</DialogDescription>
                </DialogHeader>
                <div className="w-full flex justify-center items-center">
                    <Button
                        qa='button-close-modal-session-end'
                        variant='destructive'
                        onClick={() => handleSessionEnd()}
                    >
                        Keluar
                    </Button>
                </div>
                <p className='text-center text-sm text-gray-400 py-5'>Kamu akan di arahkan ke halaman login dalam {seconds} detik</p>
            </DialogContent>
        </Dialog>
    )
}