import { addImportSoalMutationFn } from '@/api/admin/api-master-soal';
import InputFile from '@/components/input/input-file';
import ModalChildren from '@/components/modals/modal-children'
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { Inbox, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import * as yup from 'yup'

interface ModalImportRundownProps {
    isOpen: boolean;
    onClose: () => void;
}
export default function ModalImportRundown({
    isOpen,
    onClose
}: Readonly<ModalImportRundownProps>) {

    const MAX_FILE_SIZE_50 = 20 * 1024 * 1024;

    const schema = yup.object().shape({
        upload_file: yup.mixed()
            .test("fileSize", "File harus diisi dan berukuran maksimal 20 MB.", (value: any) => {
                return value && value[0]?.size <= MAX_FILE_SIZE_50
            })
            .test("type", "Hanya support untuk file bertipe .xlsx", (value: any) => {
                return value && value[0]?.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            })
            .typeError('File harus diisi!')
            .required('File harus diisi!'),
    })

    const form = useForm({
        resolver: yupResolver(schema),
        mode: 'onTouched'
    })


    const [modalSuccessOpen, setModalSuccessOpen] = useState(false)

    const { mutate: mutateUploadFile, isPending } = useMutation({
        mutationFn: addImportSoalMutationFn,
    });

    const onSubmit = async (data: any) => {

        const formData = new FormData();

        if (data.upload_file?.[0]) {
            formData.append("file", data.upload_file[0]);
        }

        mutateUploadFile(
            formData,
            {
                onSuccess: () => {
                    setModalSuccessOpen(true)
                    form.reset()
                },
                onError: (error) => {
                    toast.error(`${(error as any)?.description || "Unknown error"}`);
                },
            })
    };

    useEffect(() => {
        form.reset()
    }, [!isOpen])


    return (
        <>
            <ModalChildren
                isOpen={isOpen}
                onClose={onClose}
                noCloseBackground
            >
                <div className='flex flex-col gap-4'>
                    <h4 className='text-xl font-semibold'>Import Rundown</h4>
                    <Form {...form}>
                        <form className='flex flex-col justify-between gap-6'>
                            <div className='flex flex-col gap-3 h-full'>
                                <InputFile
                                    qa='upload_file'
                                    name='upload_file'
                                    control={form.control}
                                    info='File harus bertipe .xlsx dan berukuran maksimal 20 MB'
                                    fileType='.xlsx'
                                    height='20rem'
                                    icon={<Inbox className='text-blue-pnm-2 h-17 w-20' />}
                                />
                            </div>

                            <div className='w-full flex justify-end items-center gap-4'>
                                <Button
                                    qa='button-cancel-modal-add-user'
                                    variant='ghost'
                                    className='w-[150px]'
                                    type='button'
                                    disabled={isPending}
                                    onClick={() => {
                                        onClose()
                                        form.reset()
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    qa='button-submit-modal-add-user'
                                    variant='primary'
                                    type='button'
                                    className='w-[150px] flex items-center justify-center gap-3'
                                    disabled={isPending}
                                    onClick={() => form.handleSubmit(onSubmit)()}
                                >
                                    {
                                        isPending
                                            ? <LoaderCircle className='animate-spin' />
                                            : "Import Data"
                                    }
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </ModalChildren>

            {/* <ModalSuccess
                isOpen={modalSuccessOpen}
                onClose={() => setModalSuccessOpen(false)}
                onConfirm={() => navigate('/master-soal')}
                title="Soal berhasil ditambahkan"
                description='Silahkan periksa kembali soal yang telah Anda buat pada tabel list soal.'
            /> */}
        </>
    )
}
