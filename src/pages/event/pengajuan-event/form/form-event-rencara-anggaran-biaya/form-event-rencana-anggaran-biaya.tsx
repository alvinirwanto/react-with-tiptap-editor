import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import LayoutPengajuanEvent from "../../../_layout/layout-pengajuan-event";

import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { PiInvoiceFill } from "react-icons/pi";
import FormTrainer from "./form/form-trainer";
import { schema } from "./schema";
import FormAkomodasiKonsumsi from "./form/form-akomodasi-konsumsi";
import FormBiayaLain from "./form/form-biaya-lain";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";


interface FormEventRencanaAnggaranBiayaProps {
    nextStep: () => void;
    prevStep?: () => void;
    onComplete?: any;
    updateStatus?: any;
}
export default function FormEventRencanaAnggaranBiaya({
    nextStep,
    prevStep,
    onComplete,
    updateStatus
}: Readonly<FormEventRencanaAnggaranBiayaProps>) {

    const form = useForm({
        mode: 'onTouched',
        defaultValues: {
            trainer: [{
                no_urut: 0,
                trainer: '',
                jumlah: 0,
                unit: '',
                frekuensi: 0,
                satuan: '',
                unit_cost: '',
                total_cost: '',
                tipe_trainer: ''
            }],
            akomodasi_konsumsi: [{
                no_urut: 0,
                jenis: '',
                jumlah: 0,
                unit: '',
                frekuensi: 0,
                satuan: '',
                unit_cost: '',
                total_cost: '',
            }],
            biaya_lain: [{
                no_urut: 0,
                deskripsi: '',
                jumlah: 0,
                unit: '',
                frekuensi: 0,
                satuan: '',
                unit_cost: '',
                total_cost: '',
            }]
        },
        resolver: yupResolver(schema)
    });

    const [anggaranDeviasi, setAnggaranDeviasi] = useState(10000000)

    useEffect(() => {
        const stored = localStorage.getItem('form-event-data');

        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.step2?.no_memo_deviasi?.anggaran) {
                setAnggaranDeviasi(Number(parsed.step2.no_memo_deviasi.anggaran) || 0)
            }
        }
    }, []);

    const totalTrainer = Number(form.watch('sub_total_trainer')) || 0
    const totalAkomodasiKonsumsi = Number(form.watch('sub_total_akomodasi_konsumsi')) || 0
    const totalBiayaLain = Number(form.watch('sub_total_biaya_lain')) || 0

    const grandTotal = totalTrainer + totalAkomodasiKonsumsi + totalBiayaLain
    const sisaDeviasi = anggaranDeviasi - grandTotal

    const [subError, setSubError] = useState(false)
    const [errorLimitAnggaran, setErrorLimitAnggaran] = useState(false)

    useEffect(() => {
        if (sisaDeviasi < 0) {
            setErrorLimitAnggaran(true)
        } else (
            setErrorLimitAnggaran(false)
        )
    }, [sisaDeviasi])

    const onSubmit = (data: any) => {
        onComplete(5, data);
        updateStatus(5, true)
        nextStep();
    };

    return (
        <LayoutPengajuanEvent
            title="Rencana Anggaran Biaya"
            prefix={<PiInvoiceFill className='text-3xl text-blue-pnm' />}

        >
            <Form {...form}>
                <form className="h-full flex flex-col justify-between gap-4 pt-4">

                    <div className="flex flex-col gap-10 pr-2">
                        <FormTrainer
                            anggaranDeviasi={anggaranDeviasi}
                            setSubError={setSubError}
                        />

                        <hr className="border border-gray-300" />

                        <FormAkomodasiKonsumsi
                            setSubError={setSubError}
                        />
                        <hr className="border border-gray-300" />

                        <FormBiayaLain
                            setSubError={setSubError}
                        />

                        <hr className="border border-gray-300" />
                        <div className="grid grid-cols-[2fr_1fr] gap-6">

                            {
                                anggaranDeviasi
                                    ? <div></div>
                                    : <div className="w-fit h-fit flex flex-col gap-2 bg-amber-200/60 rounded-md py-4 pl-4 pr-8">
                                        <div className="flex items-center gap-2 font-bold">
                                            <Info className="h-5 w-5 text-rose-500" />
                                            <span>Note</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-5"></div>
                                            <ul className="!list-disc list-inside text-sm">
                                                <li>Maksimal anggaran konsumsi untuk Knowledge Sharing Cabang = Rp. 75.000/pax</li>
                                                <li>Fee untuk Trainer Eksternal tidak boleh lebih dari Rp. 3.000.000</li>
                                            </ul>
                                        </div>
                                    </div>
                            }

                            <div className="flex flex-col gap-1">
                                <div className="grid grid-cols-2">
                                    <span className="text-start">Trainer</span>
                                    <span className="text-end">Rp. {totalTrainer.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="grid grid-cols-2">
                                    <span className="text-start">Akomodasi dan Konsumsi</span>
                                    <span className="text-end">Rp. {totalAkomodasiKonsumsi.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="grid grid-cols-2">
                                    <span className="text-start">Biaya Lain</span>
                                    <span className="text-end">Rp. {totalBiayaLain.toLocaleString('id-ID')}</span>
                                </div>

                                <div className="grid grid-cols-2 font-bold mt-4">
                                    <span className="text-start">{anggaranDeviasi ? 'Anggaran Deviasi' : 'Anggaran'}</span>
                                    <span className="text-end">Rp. {anggaranDeviasi.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="grid grid-cols-2 font-bold">
                                    <span className="text-start">Grand Total</span>
                                    <span className="text-end">Rp. {grandTotal.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="grid grid-cols-2 font-bold">
                                    <span className="text-start">Sisa Deviasi</span>
                                    <span className={cn(errorLimitAnggaran && 'text-rose-500', "text-end")}>Rp. {sisaDeviasi.toLocaleString('id-ID')}</span>
                                </div>
                                {
                                    errorLimitAnggaran && (
                                        <div className="bg-rose-50 py-1.5 px-3 rounded-sm">

                                            <span className="text-sm text-rose-500 mt-2">Grand Total melebihi anggaran yang tersedia.</span>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end items-center gap-3 mt-10">
                        <Button
                            qa="button-next"
                            variant='secondary'
                            className="w-[200px] flex items-center gap-2"
                            type="submit"
                            onClick={prevStep}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Kembali</span>
                        </Button>
                        <Button
                            qa="button-next"
                            variant='primary'
                            className="w-[200px] flex items-center gap-2"
                            type="submit"
                            disabled={sisaDeviasi <= 0 || subError || errorLimitAnggaran}
                            onClick={(e) => {
                                e.preventDefault()
                                form.handleSubmit(onSubmit)()
                            }}
                        >
                            <span>Simpan dan lanjutkan</span>
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </form>
            </Form>
        </LayoutPengajuanEvent>
    )
}
