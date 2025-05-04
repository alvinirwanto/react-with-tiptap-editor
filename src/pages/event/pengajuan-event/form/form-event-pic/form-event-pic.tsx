import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import LayoutPengajuanEvent from "../../../_layout/layout-pengajuan-event";

import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, ArrowRight } from "lucide-react";
import FormPic from "./form/form-pic";
import FormTrainerInternal from "./form/form-trainer-internal";
import FormTrainerEksternal from "./form/form-trainer-eksternal";
import { schema } from "./schema";

interface FormEventPicProps {
    nextStep: () => void;
    prevStep?: () => void;
    onComplete?: any;
    updateStatus?: any;
}
export default function FormEventPic({
    nextStep,
    prevStep,
    onComplete,
    updateStatus
}: Readonly<FormEventPicProps>) {

    const form = useForm({
        mode: 'onTouched',
        defaultValues: {
            pic: [{
                no_urut: 0,
                nama_pic: '',
                posisi: ''
            }],
            trainer_internal: [{
                no_urut: 0,
                nama_trainer: '',
                materi: '',
                unit_kerja: '',
                tipe_trainer: ''
            }],
            trainer_eksternal: [{
                no_urut: 0,
                isNew: false,
                nama_trainer: '',
                nama_pt: '',
                no_hp: '',
                materi: '',
                tipe_trainer: ''
            }]
        },
        resolver: yupResolver(schema)
    });

    const onSubmit = (data: any) => {
        onComplete(4, data);

        const trainer: any[] = [];
        const values = trainer;

        const existingStorage = JSON.parse(localStorage.getItem('form-event-data') || '{}');

        localStorage.setItem(
            'form-event-data',
            JSON.stringify({
                ...existingStorage,
                step5: {
                    ...existingStorage.step5,
                    trainer: values,
                },
            })
        );


        updateStatus(4, true)

        nextStep();
    };

    return (
        <LayoutPengajuanEvent
            title="PIC Panitia & Trainer"
        >
            <Form {...form}>
                <form className="h-full flex flex-col justify-between gap-4 pt-4">
                    <div className="flex flex-col gap-10 pr-2">
                        <FormPic />
                        <hr className="border border-gray-300" />
                        <FormTrainerInternal />
                        <hr className="border border-gray-300" />
                        <FormTrainerEksternal />
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
    )
}
