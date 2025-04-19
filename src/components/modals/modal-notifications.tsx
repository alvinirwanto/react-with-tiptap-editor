import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Button } from "../ui/button";

import Lottie from "react-lottie-player";

import animationData from '../../assets/lotties/confetti.json';

interface ModalNotificationProps {
    data?: any;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
    type?: string;
}

export default function ModalNotification({
    isOpen,
    data,
    onClose,
    onConfirm,
    loading,
    type = 'idea'
}: Readonly<ModalNotificationProps>) {

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
                className="flex flex-col justify-between !w-[350px] md:!w-[600px] xl:!w-[750px] px-[70px]"
            >
                {
                    type === 'idea'
                        // Idea Innovation
                        ? <DialogHeader className="w-full py-[35px] flex items-center justify-center">
                            {
                                // Lolos
                                (data?.inovasi_idea?.status.id_status === 5
                                    || data?.inovasi_idea?.status?.id_status === 8
                                    || data?.inovasi_idea?.status?.id_status === 4
                                    || data?.inovasi_idea?.status?.id_status === 7
                                    || data?.inovasi_idea?.status?.id_status === 11)
                                    ? <div className="relative flex justify-center">
                                        <Lottie
                                            loop={true}
                                            play={true}
                                            // speed={.8}
                                            animationData={animationData}
                                            style={{ height: 430, width: 500 }}
                                            rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
                                            className="absolute !-bottom-10 !z-[100]"
                                        />
                                        <img
                                            src="/congratulations.svg"
                                            alt="img-congratulations"
                                            className="z-10 h-[200px]"
                                        />
                                    </div>

                                    // Tidak lolos
                                    : data?.inovasi_idea?.status.id_status === 6 || data?.inovasi_idea?.status?.id_status === 9
                                        ? <div className="relative flex justify-center">
                                            <img
                                                src="/failed.svg"
                                                alt="img-congratulations"
                                                className="z-10 h-[200px]"
                                            />
                                        </div>
                                        : ''
                            }

                            <DialogTitle className="text-[25px] pt-7">
                                {
                                    // Lolos
                                    (data?.inovasi_idea?.status.id_status === 5
                                        || data?.inovasi_idea?.status?.id_status === 8
                                        || data?.inovasi_idea?.status?.id_status === 4
                                        || data?.inovasi_idea?.status?.id_status === 7
                                        || data?.inovasi_idea?.status?.id_status === 11)
                                        ? 'Selamat!'

                                        //Tidak Lolos
                                        : data?.inovasi_idea?.status.id_status === 6 || data?.inovasi_idea?.status?.id_status === 9 ? 'Terima Kasih Telah Berpartisipasi!'
                                            : ''
                                }
                            </DialogTitle>

                            <DialogDescription className="text-start">
                                {
                                    // Lolos
                                    (data?.inovasi_idea?.status.id_status === 5
                                        || data?.inovasi_idea?.status?.id_status === 8
                                        || data?.inovasi_idea?.status?.id_status === 4
                                        || data?.inovasi_idea?.status?.id_status === 7)
                                        ? <div className="text-[15px] flex flex-col gap-4">
                                            <div>
                                                Inovasi <span className="font-semibold text-black">{data?.inovasi_idea?.nama_inovasi}</span> terpilih sebagai
                                                {
                                                    (data?.inovasi_idea?.status?.id_status === 5 || data?.inovasi_idea?.status?.id_status === 4) ? ' salah satu dari banyak tim '
                                                        : (data?.inovasi_idea?.status?.id_status === 8 || data?.inovasi_idea?.status?.id_status === 7) ? ' salah satu dari 15 besar '
                                                            : ''
                                                }
                                                dan melaju ke tahap
                                                <span className="font-semibold text-black">
                                                    {
                                                        (data?.inovasi_idea?.status?.id_status === 5 || data?.inovasi_idea?.status?.id_status === 4) ? ' 15 Besar Idea Challenge'
                                                            : (data?.inovasi_idea?.status?.id_status === 8 || data?.inovasi_idea?.status?.id_status === 7) ? ' Final Idea Challenge'
                                                                : ''
                                                    }.
                                                </span>
                                            </div>
                                            <div>
                                                Silakan periksa dan unggah kembali proposal final Anda di halaman <br />
                                                <span className="font-semibold text-black">"View Inovasi Anda" &gt; Tab "History Activity" &gt; Tombol "Update Pengajuan"</span> <br />
                                                Jangan lupa untuk melakukan submit sebelum batas waktu yang ditentukan!
                                            </div>
                                            <p>Terima kasih atas partisipasinya, dan semoga sukses di tahap selanjutnya!</p>
                                        </div>

                                        // Tidak Lolos
                                        : data?.inovasi_idea?.status.id_status === 6 || data?.inovasi_idea?.status?.id_status === 9
                                            ? <div className="text-[15px] flex flex-col gap-4 mt-4">
                                                <p>
                                                    Inovasi Anda{' '}<span className='font-semibold text-black'>{' '}belum berhasil</span>lolos ke tahap
                                                    {
                                                        data?.inovasi_idea?.status?.id_status === 6 ? ' 15 Besar '
                                                            : data?.inovasi_idea?.status?.id_status === 9 ? ' Final '
                                                                : ''
                                                    }
                                                    Idea Challenge kali ini.
                                                    Kami sangat menghargai ide dan usaha yang telah Anda berikan. Terus berkarya dan jangan ragu untuk mencoba lagi di kesempatan berikutnya!
                                                </p>
                                                <p>Terima kasih.</p>
                                            </div>

                                            // Juara
                                            : data?.inovasi_idea?.status.id_status === 11
                                                ? <div className="text-[15px] flex flex-col gap-4 mt-4">
                                                    <p>
                                                        Inovasi <span className="font-semibold text-black"> {data?.inovasi_idea?.nama_inovasi} </span> telah berhasil meraih posisi
                                                        {' '}<span className="font-semibold text-black">{data?.message}</span>. Pencapaian ini merupakan bukti dari kreativitas dan dedikasi luar biasa yang telah ditunjukkan oleh Tim Anda.
                                                        Tim IFest akan segera menghubungi Anda untuk informasi lebih lanjut.
                                                    </p>
                                                    <p>Terima kasih atas partisipasi dan semangat yang telah diberikan. Sampai jumpa di kesempatan berikutnya untuk terus menciptakan inovasi yang menginspirasi!</p>
                                                </div>
                                                : ''
                                }
                            </DialogDescription>
                        </DialogHeader>

                        // Big Innovation
                        : <DialogHeader className="w-full py-[35px] flex items-center justify-center">
                            {
                                // Lolos
                                (data?.inovasi_big?.status.id_status === 5
                                    || data?.inovasi_big?.status?.id_status === 8
                                    || data?.inovasi_big?.status?.id_status === 4
                                    || data?.inovasi_big?.status?.id_status === 7
                                    || data?.inovasi_big?.status?.id_status === 11)
                                    ? <div className="relative flex justify-center">
                                        <Lottie
                                            loop={true}
                                            play={true}
                                            // speed={.8}
                                            animationData={animationData}
                                            style={{ height: 430, width: 500 }}
                                            rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
                                            className="absolute !-bottom-10 !z-[100]"
                                        />
                                        <img
                                            src="/congratulations.svg"
                                            alt="img-congratulations"
                                            className="z-10 h-[200px]"
                                        />
                                    </div>

                                    // Tidak lolos
                                    : data?.inovasi_big?.status.id_status === 6 || data?.inovasi_big?.status?.id_status === 9
                                        ? <div className="relative flex justify-center">
                                            <img
                                                src="/failed.svg"
                                                alt="img-congratulations"
                                                className="z-10 h-[200px]"
                                            />
                                        </div>
                                        : ''
                            }

                            <DialogTitle className="text-[25px] pt-7">
                                {
                                    // Lolos
                                    (data?.inovasi_big?.status.id_status === 5
                                        || data?.inovasi_big?.status?.id_status === 8
                                        || data?.inovasi_big?.status?.id_status === 4
                                        || data?.inovasi_big?.status?.id_status === 7
                                        || data?.inovasi_big?.status?.id_status === 11)
                                        ? 'Selamat!'

                                        //Tidak Lolos
                                        : data?.inovasi_big?.status.id_status === 6 || data?.inovasi_big?.status?.id_status === 9 ? 'Terima Kasih Telah Berpartisipasi!'
                                            : ''
                                }
                            </DialogTitle>

                            <DialogDescription className="text-start">
                                {
                                    // Lolos
                                    (data?.inovasi_big?.status.id_status === 5
                                        || data?.inovasi_big?.status?.id_status === 8
                                        || data?.inovasi_big?.status?.id_status === 4
                                        || data?.inovasi_big?.status?.id_status === 7)
                                        ? <div className="text-[15px] flex flex-col gap-4">
                                            <div>
                                                Inovasi <span className="font-semibold text-black">{data?.inovasi_big?.nama_inovasi}</span> terpilih sebagai
                                                {
                                                    (data?.inovasi_big?.status?.id_status === 5 || data?.inovasi_big?.status?.id_status === 4) ? ' salah satu dari banyak tim '
                                                        : (data?.inovasi_big?.status?.id_status === 8 || data?.inovasi_big?.status?.id_status === 7) ? ' salah satu dari 15 besar '
                                                            : ''
                                                }
                                                dan melaju ke tahap
                                                <span className="font-semibold text-black">
                                                    {
                                                        (data?.inovasi_big?.status?.id_status === 5 || data?.inovasi_big?.status?.id_status === 4) ? ' 15 Besar Big Innovation'
                                                            : (data?.inovasi_big?.status?.id_status === 8 || data?.inovasi_big?.status?.id_status === 7) ? ' Final Big Innovation'
                                                                : ''
                                                    }.
                                                </span>
                                            </div>
                                            <div>
                                                Silakan periksa dan unggah kembali proposal final Anda di halaman <br />
                                                <span className="font-semibold text-black">"View Inovasi Anda" &gt; Tab "History Activity" &gt; Tombol "Update Pengajuan"</span> <br />
                                                Jangan lupa untuk melakukan submit sebelum batas waktu yang ditentukan!
                                            </div>
                                            <p>Terima kasih atas partisipasinya, dan semoga sukses di tahap selanjutnya!</p>
                                        </div>

                                        // Tidak Lolos
                                        : data?.inovasi_big?.status.id_status === 6 || data?.inovasi_big?.status?.id_status === 9
                                            ? <div className="text-[15px] flex flex-col gap-4 mt-4">
                                                <p>
                                                    Inovasi Anda{' '}<span className='font-semibold text-black'>{' '}belum berhasil</span>lolos ke tahap
                                                    {
                                                        data?.inovasi_big?.status?.id_status === 6 ? ' 15 Besar '
                                                            : data?.inovasi_big?.status?.id_status === 9 ? ' Final '
                                                                : ''
                                                    }
                                                    Idea Challenge kali ini.
                                                    Kami sangat menghargai ide dan usaha yang telah Anda berikan. Terus berkarya dan jangan ragu untuk mencoba lagi di kesempatan berikutnya!
                                                </p>
                                                <p>Terima kasih.</p>
                                            </div>

                                            // Juara
                                            : data?.inovasi_big?.status.id_status === 11
                                                ? <div className="text-[15px] flex flex-col gap-4 mt-4">
                                                    <p>
                                                        Inovasi <span className="font-semibold text-black"> {data?.inovasi_big?.nama_inovasi} </span> telah berhasil mencapai Tahap
                                                        {' '}<span className="font-semibold text-black">Final</span>. Pencapaian ini merupakan bukti dari kreativitas dan dedikasi luar biasa yang telah ditunjukkan oleh Divisi Anda.
                                                        Tim IFest akan segera menghubungi Anda untuk informasi lebih lanjut.
                                                    </p>
                                                    <p>Terima kasih atas partisipasi dan semangat yang telah diberikan. Sampai jumpa di kesempatan berikutnya untuk terus menciptakan inovasi yang menginspirasi!</p>
                                                </div>
                                                : ''
                                }
                            </DialogDescription>
                        </DialogHeader>
                }
                <div className="w-full flex items-center justify-center gap-4">
                    <Button
                        disabled={loading}
                        qa='button-close-modal-notification'
                        variant='primary'
                        className="w-[10rem]"
                        onClick={onConfirm}
                    >
                        Tutup
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}