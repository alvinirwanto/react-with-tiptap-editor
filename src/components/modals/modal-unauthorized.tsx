import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import useDialogUnauthorizedStore from "@/stores/unauthorized-store";

import animationData from '../../assets/lotties/warning-2.json';
import animationData2 from '../../assets/lotties/warning-tape.json';

import Lottie from "react-lottie-player";
import { useNavigate } from "@tanstack/react-router";

export default function ModalUnauthorized() {

    const { isDialogUnauthorizedOpen, hideDialogUnauthorized } = useDialogUnauthorizedStore();
    const [seconds, setSeconds] = useState(10);
    const navigate = useNavigate()

    function handleSessionEnd() {
        if (!isDialogUnauthorizedOpen) {
            return;
        }

        if (localStorage.getItem("user-auth-pass")) {
            localStorage.removeItem("user-auth-pass");
        }

        hideDialogUnauthorized();
        navigate({ to: '/' })
    }

    useEffect(() => {
        if (!isDialogUnauthorizedOpen) {
            return;
        }

        const countdownTimer = setInterval(() => {
            setSeconds((prevSeconds) => prevSeconds - 1);
        }, 1000);

        const redirectTimer = setTimeout(() => {
            hideDialogUnauthorized();
            handleSessionEnd()
        }, 10000);

        return () => {
            clearInterval(countdownTimer);
            clearTimeout(redirectTimer);
        };
    }, [isDialogUnauthorizedOpen, hideDialogUnauthorized]);

    return (
        <>
            {
                isDialogUnauthorizedOpen && (
                    <>
                        <div className="w-full h-screen absolute z-[200] bg-white"></div>
                        <Lottie
                            className="w-full h-full absolute z-[210] scale-[.8]"
                            loop={true}
                            play={true}
                            speed={0.5}
                            animationData={animationData2}
                            rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
                        />
                    </>
                )
            }
            <Dialog open={isDialogUnauthorizedOpen}>
                <DialogContent
                    onInteractOutside={(e) => {
                        e.preventDefault();
                    }}
                    className="flex flex-col justify-between !w-[350px] md:!w-[400px] xl:!w-[500px]"
                >
                    <DialogHeader className="w-full h-[300px] flex items-center justify-center">
                        {/* <div className="h-26 w-26 flex justify-center items-center p-0 m-0 bg-black  rounded-full"> */}
                        {/* <History className="h-9 w-9" /> */}
                        <Lottie
                            loop={true}
                            play={true}
                            animationData={animationData}
                            style={{ width: 115, height: 115 }}
                            rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
                        />
                        {/* </div> */}
                        <DialogTitle className="text-2xl pt-7">Unauthorized</DialogTitle>
                        <DialogDescription className="text-center">Maaf Anda tidak memiliki akses ke halaman ini. Silahkan hubungi Admin untuk informasi lebih lanjut</DialogDescription>
                    </DialogHeader>
                    <div className="w-full flex justify-center items-center">
                        <Button
                            qa='button-back-modal-unauthorized'
                            className="bg-[#FFC71F] hover:bg-yellow-500 text-black font-medium px-8"
                            onClick={() => handleSessionEnd()}
                        >
                            Kembali
                        </Button>
                    </div>
                    <p className='text-center text-xs text-gray-400 pb-5 py-4'>Kamu akan di arahkan ke halaman dashboard dalam {seconds} detik</p>
                </DialogContent>
            </Dialog>
        </>
    )
}