import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FieldError, useFieldArray, useForm } from "react-hook-form";
import LayoutPengajuanEvent from "../../../_layout/layout-pengajuan-event";

import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";

import { ArrowLeft, ArrowRight, Download, Import, Trash2 } from "lucide-react";
import { PiCalendarDotsFill, PiPlusSquareFill } from "react-icons/pi";
import TitlePage from "@/components/title-page";
import InputText from "@/components/input/input-text";
import InputDate from "@/components/input/input-date";
import { schema } from "./schema";
import ModalImportRundown from "./modal/modal-import-rundown";


interface FormEventRundownProps {
    nextStep: () => void;
    prevStep?: () => void;
    onComplete?: any;
    updateStatus?: any;
}
export default function FormEventRundown({
    nextStep,
    prevStep,
    onComplete,
    updateStatus
}: Readonly<FormEventRundownProps>) {


    const form = useForm({
        mode: 'onTouched',
        defaultValues: {
            rundown: [{
                no_urut: 0,
                tanggal: undefined,
                waktu: '',
                nama_kegiatan: '',
                pic: '',
                keterangan: ''
            }]
        },
        resolver: yupResolver(schema)
    });

    const {
        fields: rundownFields,
        append: appendRundown,
        remove: removeRundown
    } = useFieldArray({
        control: form.control,
        name: 'rundown',
    });

    const watchFields = form.watch('rundown');

    const isErrorArray = (errors: any): errors is FieldError[] => Array.isArray(errors);

    const allFieldsFilled = watchFields?.every((field: any, index: number) => {
        const errors = form.formState.errors.rundown;
        const fieldError = isErrorArray(errors) ? errors[index] : errors;

        return (
            field.tanggal &&
            field.waktu &&
            field.nama_kegiatan &&
            field.pic &&
            field.keterangan &&
            !fieldError
        );
    });

    const stored = localStorage.getItem('form-event-data');

    useEffect(() => {
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.step6 && Array.isArray(parsed.step6.rundown)) {
                const newRundownLength = parsed.step6.rundown.length;
                const currentRundownLength = rundownFields.length;

                if (currentRundownLength < newRundownLength) {
                    const rowsToAdd = newRundownLength - currentRundownLength;
                    for (let i = 0; i < rowsToAdd; i++) {
                        appendRundown({
                            tanggal: undefined,
                            waktu: '',
                            nama_kegiatan: '',
                            pic: '',
                            keterangan: ''
                        }, { shouldFocus: false });
                    }
                }

                parsed.step6.rundown.forEach((item: any, i: number) => {
                    form.setValue(`rundown.${i}.tanggal`, new Date(item.tanggal));
                    form.setValue(`rundown.${i}.waktu`, item.waktu);
                    form.setValue(`rundown.${i}.nama_kegiatan`, item.nama_kegiatan);
                    form.setValue(`rundown.${i}.pic`, item.pic);
                    form.setValue(`rundown.${i}.keterangan`, item.keterangan);
                });
            }
        }
    }, [stored]);

    useEffect(() => {
        rundownFields.forEach((item, index) => {
            form.setValue(`rundown.${index}.no_urut`, index + 1);
        })
    }, [rundownFields])

    const [modalImportRundownOpen, setModalImportRundownOpen] = useState(false)


    const onSubmit = (data: any) => {
        onComplete(6, data);
        updateStatus(6, true)
        nextStep();
    };

    return (
        <>
            <LayoutPengajuanEvent
                title="Rundown"
                prefix={<PiCalendarDotsFill className='text-3xl text-blue-pnm' />}
            >
                <div className="pt-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <TitlePage
                            title="Rundown"
                            tag="h2"
                            size="md"
                            className="text-blue-pnm-2 font-semibold"
                        />

                        <div className="flex items-center gap-3">
                            <Button
                                qa="button-import-peserta"
                                variant='outline'
                                className='flex items-center gap-3 w-[200px]'
                            >
                                <Download className="h-4 w-4" />
                                Download Template
                            </Button>

                            <Button
                                qa="button-add-peserta"
                                variant="green"
                                className="flex items-center gap-2 w-[200px]"
                                onClick={() => setModalImportRundownOpen(true)}

                            >
                                <Import className="h-5 w-5" />
                                Import Rundown
                            </Button>
                        </div>
                    </div>
                </div>
                <Form {...form}>
                    <form className="h-full flex flex-col justify-between gap-4 pt-4">
                        <div className='w-full flex flex-col gap-4 border border-gray-200 rounded-md overflow-clip pb-4'>
                            <div className='grid grid-cols-[1fr_4.5fr_4.5fr_5fr_5fr_5fr_1.3fr] gap-4 text-sm font-semibold bg-bg-table border-b border-gray-200 py-3'>
                                <span className='text-center'>No.</span>
                                <span>Tanggal</span>
                                <span>Waktu</span>
                                <span>Nama Kegiatan</span>
                                <span>PIC</span>
                                <span>Keterangan</span>
                                <span>Aksi</span>
                            </div>
                            {
                                rundownFields.map((data, index) => (
                                    <div key={data.id} className='grid grid-cols-[1fr_4.5fr_4.5fr_5fr_5fr_5fr_1.3fr] gap-4 pr-2'>
                                        <span className='text-center text-sm font-semibold mt-2'>{index + 1}.</span>
                                        <InputDate
                                            qa={`rundown.${index}.tanggal`}
                                            name={`rundown.${index}.tanggal`}
                                            control={form.control}
                                            placeholder='Masukkan Tanggal'
                                        />
                                        <InputText
                                            qa={`rundown.${index}.waktu`}
                                            name={`rundown.${index}.waktu`}
                                            control={form.control}
                                            type="number"
                                            endAdorn={'Jam'}
                                            placeholder='Masukkan waktu'
                                        />
                                        <InputText
                                            qa={`rundown.${index}.nama_kegiatan`}
                                            name={`rundown.${index}.nama_kegiatan`}
                                            control={form.control}
                                            placeholder='Masukkan nama kegiatan'
                                        />

                                        <InputText
                                            name={`rundown.${index}.pic`}
                                            qa={`rundown.${index}.pic`}
                                            control={form.control}
                                            placeholder='Masukkan nama kegiatan'
                                        />

                                        <InputText
                                            qa={`rundown.${index}.keterangan`}
                                            name={`rundown.${index}.keterangan`}
                                            control={form.control}
                                            placeholder='Masukkan keterangan'
                                        />
                                        {
                                            rundownFields.length > 1 && (
                                                <Button
                                                    qa='button-delete-rundown'
                                                    type="button"
                                                    variant='ghost'
                                                    size='icon'
                                                    className='flex items-center justify-center w-10 h-10 p-0 hover:bg-rose-50'
                                                    onClick={() => removeRundown(index)}
                                                >
                                                    <Trash2 className='text-rose-500 h-4 w-4' />
                                                </Button>
                                            )
                                        }
                                    </div>
                                ))
                            }

                            <div className='flex justify-end m-3'>
                                {
                                    rundownFields.length < 10 && (
                                        <Button
                                            qa='button-add-scoring'
                                            variant='ghost'
                                            type="button"
                                            disabled={!allFieldsFilled}
                                            onClick={() =>
                                                appendRundown({
                                                    tanggal: undefined,
                                                    waktu: '',
                                                    nama_kegiatan: '',
                                                    pic: '',
                                                    keterangan: ''
                                                }, { shouldFocus: false })
                                            }
                                            className='w-[200px] flex items-center gap-2 rounded-md text-blue-pnm hover:text-blue-pnm hover:bg-blue-100'
                                        >
                                            <PiPlusSquareFill className='h-6 w-6 text-blue-pnm' />
                                            <span>Tambah Rundown</span>
                                        </Button>
                                    )
                                }
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

            <ModalImportRundown
                isOpen={modalImportRundownOpen}
                onClose={() => setModalImportRundownOpen(false)}
            />
        </>
    )
}
