import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import LayoutPengajuanEvent from "../../../_layout/layout-pengajuan-event";


import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, Send } from "lucide-react";
import { PiNotebookFill } from "react-icons/pi";
import TitlePage from "@/components/title-page";
import InputText from "@/components/input/input-text";
import InputFile from "@/components/input/input-file";
import { schema } from "./schema";
import { useEffect, useState } from "react";
import ModalWarning from "@/components/modals/modal-warning";
import ConvertToBase64 from "@/lib/convert-to-base64";
import { format } from "date-fns";


interface FormEventMateriProps {
    nextStep: () => void;
    prevStep?: () => void;
    onComplete?: any;
    updateStatus?: any;
}
export default function FormEventMateri({
    nextStep,
    prevStep,
    onComplete,
    updateStatus
}: Readonly<FormEventMateriProps>) {

    const form = useForm({
        mode: 'onTouched',
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        if (form.formState.isValid) {
            updateStatus(7, true)
        } else {
            updateStatus(7, false)
        }
    }, [form.formState.isValid])


    const onSubmit = async (data: any) => {

        
        const dataForm = JSON.parse(localStorage.getItem('form-event-data') as any)

        const dataSend = {
            deviasi: {
                id_deviasi: Number(dataForm.step2.no_memo_deviasi.id)
            },
            informasi_acara: {
                id_akademi: Number(dataForm.step1.akademi.id),
                id_kategori: Number(dataForm.step1.kategori_pelatihan.id),
                id_sub_kategori: Number(dataForm.step1.sub_kategori_pelatihan.id),
                id_unit_kerja: dataForm.step1.unit_kerja,
                nomor_memo: dataForm.step1.no_memo,
                tanggal_end: format(dataForm.step1.tanggal_pelaksanaan.to, 'yyyy-MM-dd'),
                tanggal_mulai: format(dataForm.step1.tanggal_pelaksanaan.from, 'yyyy-MM-dd'),
                tempat_pelatihan: dataForm.step1.tempat_pelaksanaan,
                tujuan: dataForm.step1.tujuan_pelatihan
            },
            materi: {
                file_materi: await ConvertToBase64(data.file_materi[0]),
                file_test: await ConvertToBase64(data.file_test[0]),
                id: 0,
                nama_materi: data.nama_materi,
                nama_test: data.nama_test
            },
            peserta: dataForm.step3.map((item: any, index: number) => ({
                id_karyawan: item.id,
                no_urut: index + 1
            })),
            pic_panitia_trainer: {
                pic_panitia: dataForm.step4.pic.map((item: any) => ({
                    id: 0,
                    id_karyawan: item.nama_pic.id,
                    no_urut: item.no_urut
                })),
                trainer_eksternal: dataForm.step4.trainer_eksternal.map((item: any) => ({
                    idsdm: item.nama_trainer.idsdm || 0,
                    isi_materi: item.materi,
                    nama_perusahaan: item.nama_pt,
                    nama_trainer: item.nama_trainer.name || item.nama_trainer,
                    no_telpon: item.no_hp,
                    no_urut: item.no_urut
                })),
                trainer_internal: dataForm.step4.trainer_internal.map((item: any) => ({
                    id: 0,
                    id_karyawan: item.nama_trainer.id_karyawan,
                    isi_materi: item.materi,
                    no_urut: item.no_urut
                }))
            },
            rencana_anggaran_biaya: {
                rab_akomodasi_konsumsi: dataForm.step5.akomodasi_konsumsi.map((item: any) => ({
                    frekuensi: item.frekuensi,
                    id: 0,
                    id_akomodasi_konsumsi: 0,
                    jumlah: item.jumlah,
                    no_urut: item.no_urut,
                    satuan: item.satuan,
                    total_cost: Number(item.total_cost),
                    unit: item.unit,
                    unit_cost: Number(item.unit_cost)
                })),
                rab_biaya_lain: dataForm.step5.biaya_lain.map((item: any) => ({
                    deskripsi: item.deskripsi,
                    frekuensi: item.frekuensi,
                    id: 0,
                    jumlah: item.jumlah,
                    no_urut: item.no_urut,
                    satuan: item.satuan,
                    total_cost: Number(item.total_cost),
                    unit: item.unit,
                    unit_cost: Number(item.unit_cost)
                })),
                rab_trainer: dataForm.step5.trainer.map((item: any) => ({
                    frekuensi: item.frekuensi,
                    id: 0,
                    jumlah: item.jumlah,
                    no_urut: item.no_urut,
                    satuan: item.satuan,
                    total_cost: Number(item.total_cost),
                    unit: item.unit,
                    unit_cost: Number(item.unit_cost)
                }))
            },
            roundown:  dataForm.step6.rundown.map((item: any) => ({
                id: 0,
                keterangan: item.keterangan,
                nama_kegiatan: item.nama_kegiatan,
                nama_pic: item.pic,
                no_urut: item.no_urut,
                tanggal: format(item.tanggal, 'yyyy-MM-dd'),
                waktu: Number(item.waktu)
            }))
        }

        console.log(dataSend);
    };

    const formEventStatus = localStorage.getItem('form-event-status');
    const parsedStatus = formEventStatus ? JSON.parse(formEventStatus) : {};


    const [modalConfirmOpen, setModalConfirmOpen] = useState(false)

    return (
        <>
            <LayoutPengajuanEvent
                title="Materi"
                prefix={<PiNotebookFill className='text-3xl text-blue-pnm' />}

            >
                <Form {...form}>
                    <form className="h-full flex flex-col justify-between gap-4 pt-4">
                        <div className="flex flex-col gap-10">
                            <div className="flex flex-col gap-2">
                                <TitlePage
                                    title="Materi"
                                    tag="h2"
                                    size="md"
                                    className="text-blue-pnm-2 font-semibold"
                                />
                                <div className='w-full flex flex-col border border-gray-200 rounded-md overflow-clip'>
                                    <div className='grid grid-cols-2 gap-4 text-sm font-semibold bg-bg-table border-b border-gray-200 py-3'>
                                        <span className="pl-4">Nama Materi</span>
                                        <span>File</span>
                                    </div>
                                    <div className='grid grid-cols-2 gap-4 p-4'>
                                        <InputText
                                            qa='nama_materi'
                                            name='nama_materi'
                                            control={form.control}
                                            placeholder='Masukkan Nama PIC'
                                        />
                                        <InputFile
                                            qa='file_materi'
                                            name='file_materi'
                                            control={form.control}
                                            fileType=".pdf"
                                            variant="tipe-2"
                                            placeholder='Masukkan file .pdf, maksimal 20MB'
                                        />
                                    </div>
                                </div>
                            </div>


                            <div className="flex flex-col gap-2">
                                <TitlePage
                                    title="Soal Test"
                                    tag="h2"
                                    size="md"
                                    className="text-blue-pnm-2 font-semibold"
                                />
                                <div className='w-full flex flex-col border border-gray-200 rounded-md overflow-clip'>
                                    <div className='grid grid-cols-2 gap-4 text-sm font-semibold bg-bg-table border-b border-gray-200 py-3'>
                                        <span className="pl-4">Nama test</span>
                                        <span>File</span>
                                    </div>
                                    <div className='grid grid-cols-2 gap-4 p-4'>
                                        <InputText
                                            qa='nama_test'
                                            name='nama_test'
                                            control={form.control}
                                            placeholder='Masukkan Nama PIC'
                                        />
                                        <InputFile
                                            qa='file_test'
                                            name='file_test'
                                            control={form.control}
                                            fileType=".pdf"
                                            variant="tipe-2"
                                            placeholder='Masukkan file .pdf, maksimal 20MB'
                                        />
                                    </div>
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
                                type="button"
                                disabled={!form.formState.isValid || Object.values(parsedStatus).includes(false)}
                                onClick={() => setModalConfirmOpen(true)}
                            >
                                <span>Submit</span>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </form>
                </Form >
            </LayoutPengajuanEvent >

            <ModalWarning
                title='Apakah Anda yakin?'
                description="Data yang telah dikirim akan segera diproses ke tahap selanjutnya."
                isOpen={modalConfirmOpen}
                onClose={() => setModalConfirmOpen(false)}
                onConfirm={(e) => {
                    e.preventDefault()
                    form.handleSubmit(onSubmit)()
                }}
            />
        </>
    )
}
