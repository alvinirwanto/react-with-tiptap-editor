import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import LayoutPengajuanEvent from "../../../_layout/layout-pengajuan-event";

import { useEffect, useState } from "react";
import DataTable from "@/components/data-table";
import InputText from "@/components/input/input-text";
import { ArrowLeft, ArrowRight, Download, Import, Info, LoaderCircle, Plus, Search, Trash2 } from "lucide-react";
import ModalImportInputPeserta from "./modal/modal-import-input-peserta";
import ModalAddInputPeserta from "./modal/modal-add-input-peserta";
import TitlePage from "@/components/title-page";
import { useDownloadFile } from "@/hooks/use-download-file";
import Chip from "@/components/ui/chip";
interface FormEventInputPesertaProps {
    nextStep: () => void;
    prevStep?: () => void;
    onComplete?: any;
    updateStatus?: any;
}
export default function FormEventInputPeserta({
    nextStep,
    prevStep,
    onComplete,
    updateStatus
}: Readonly<FormEventInputPesertaProps>) {

    const form = useForm({
        mode: 'onTouched',
    });

    const {
        fields: pesertaFields,
        append: appendPeserta,
        remove: removePeserta
    } = useFieldArray({
        control: form.control,
        name: "peserta"
    });

    const [notFoundData, setNotFoundData] = useState<any[]>([]);

    const addListInputPeserta = (listUpdatePeserta: any[]) => {
        // Separate not found and valid peserta
        const notFound = listUpdatePeserta.filter(
            (item) => item.description === "tidak ditemukan"
        );

        const validPeserta = listUpdatePeserta.filter(
            (item) => item.description !== "tidak ditemukan"
        );

        // Filter out duplicates from validPeserta
        const uniqueList = validPeserta.filter((newPeserta) => {
            return !pesertaFields.some(
                (existingPeserta: any) => existingPeserta.nip === newPeserta.nip
            );
        });

        // Append unique peserta if any
        if (uniqueList.length > 0) {
            appendPeserta(uniqueList);
        }

        // Append not found data to state
        if (notFound.length > 0) {
            setNotFoundData((prev) => [...prev, ...notFound]);
        }
    };


    useEffect(() => {
        const stored = localStorage.getItem('form-event-data');

        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.step3) {
                form.setValue('peserta', parsed.step3)
            }
        }
    }, []);


    const onSubmit = () => {
        onComplete(3, pesertaFields);
        updateStatus(3, true)
        nextStep();
    };

    const columns = [
        {
            accessorKey: "id",
            size: 60,
            header: () => <span className="flex justify-center">No.</span>,
            cell: ({ row, table }: any) => {
                const pagination = table.getState().pagination;
                const isPaginationServer = table.options.manualPagination;

                const rowNumber = isPaginationServer
                    ? (pagination.pageIndex * pagination.pageSize) + row.index + 1
                    : row.index + 1;

                return (
                    <div className='w-full flex justify-center items-center py-1'>
                        <span className='text-[13px] text-center font-medium'>
                            {rowNumber}
                        </span>
                    </div>
                );
            }
        },
        {
            header: 'NIP',
            accessorKey: 'nip',
            size: 100,
            cell: ({ row }: any) => (
                <div>{row.original.nip ? row.original.nip : '-'}</div>
            )
        },
        {
            header: 'Nama',
            accessorKey: 'nama',
            size: 150,
            cell: ({ row }: any) => (
                <div>{row.original.nama ? row.original.nama : '-'}</div>
            )
        },
        {
            header: 'Posisi',
            accessorKey: 'posisi',
            size: 150,
            cell: ({ row }: any) => (
                <div>{row.original.posisi ? row.original.posisi : '-'}</div>
            )
        },
        {
            header: 'Unit Kerja',
            accessorKey: 'unit_kerja',
            size: 150,
            cell: ({ row }: any) => (
                <div>{row.original.unit_kerja ? row.original.unit_kerja : '-'}</div>
            )
        },
        {
            header: 'Status Karyawan',
            accessorKey: 'status',
            size: 150,
            cell: ({ row }: any) => (
                <div>
                    <Chip
                        type={
                            row.original.status === '1' ? 'green' : 'red'
                        }
                        message={
                            row.original.status === '1'
                                ? 'Aktif'
                                : row.original.status === '0'
                                    ? "Tidak Aktif"
                                    : "-"
                        }
                    />
                </div>
            )
        },
        {
            header: "Actions",
            size: 60,
            cell: ({ row }: any) => (
                <Button
                    qa-button='button-add-action'
                    variant='ghost'
                    onClick={() => removePeserta(row.index)}
                    className='flex items-center justify-center h-fit px-3 py-2 gap-2 cursor-pointer hover:bg-rose-100'
                >
                    <Trash2 className='h-4 w-4 text-rose-500' />
                </Button>
            )
        }
    ]

    const columnsNotFound = [
        {
            accessorKey: "id",
            size: 60,
            header: () => <span className="flex justify-center">No.</span>,
            cell: ({ row, table }: any) => {
                const pagination = table.getState().pagination;
                const isPaginationServer = table.options.manualPagination;

                const rowNumber = isPaginationServer
                    ? (pagination.pageIndex * pagination.pageSize) + row.index + 1
                    : row.index + 1;

                return (
                    <div className='w-full flex justify-center items-center py-1'>
                        <span className='text-[13px] text-center font-medium'>
                            {rowNumber}
                        </span>
                    </div>
                );
            }
        },
        {
            header: 'NIP',
            accessorKey: 'nip',
            size: 100,
            cell: ({ row }: any) => (
                <div>{row.original.nip ? row.original.nip : '-'}</div>
            )
        },
        {
            header: 'Nama',
            accessorKey: 'nama',
            size: 150,
            cell: ({ row }: any) => (
                <div>{row.original.nama ? row.original.nama : '-'}</div>
            )
        },
        {
            header: 'Posisi',
            accessorKey: 'posisi',
            size: 150,
            cell: ({ row }: any) => (
                <div>{row.original.posisi ? row.original.posisi : '-'}</div>
            )
        },
        {
            header: 'Unit Kerja',
            accessorKey: 'unit_kerja',
            size: 150,
            cell: ({ row }: any) => (
                <div>{row.original.unit_kerja ? row.original.unit_kerja : '-'}</div>
            )
        },
        {
            header: 'Status Karyawan',
            accessorKey: 'status',
            size: 150,
            cell: ({ row }: any) => (
                <div>{row.original.status ? row.original.status : '-'}</div>
            )
        }
    ]

    const [filtering, setFiltering] = useState('');

    useEffect(() => {
        setFiltering(form.watch('input_search'))
    }, [form.watch('input_search')])

    const [modalImportInputPesertaOpen, setModalImportInputPesertaOpen] = useState(false)
    const [modalAddInputPesertaOpen, setModalAddInputPesertaOpen] = useState(false)

    const {
        mutate: mutateDownloadTemplate,
        isPending: isPendingDownloadTemplate
    } = useDownloadFile();

    const handleDownloadTemplate = () => {
        mutateDownloadTemplate({
            url: `/event/event/import-peserta-download-template`,
            fileName: `template-input-peserta-event.xlsx`
        });
    };

    return (
        <>
            <LayoutPengajuanEvent
                title="Input Peserta"
            >
                <div className="pt-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div className="w-[300px]">
                            <Form {...form}>
                                <InputText
                                    control={form.control}
                                    name="input_search"
                                    qa="input_search"
                                    placeholder="Search here"
                                    startAdorn={<Search className="w-5 h-5 text-blue-pnm" />}

                                />
                            </Form>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                qa="button-import-peserta"
                                variant='outline'
                                className='flex items-center gap-3 w-[200px]'
                                onClick={handleDownloadTemplate}
                            >
                                {
                                    isPendingDownloadTemplate
                                        ? <LoaderCircle className='animate-spin' />
                                        : <>
                                            <Download className="h-4 w-4" />
                                            Download Template
                                        </>
                                }
                            </Button>

                            <Button
                                qa="button-add-peserta"
                                variant="primary"
                                className="flex items-center gap-2 w-[170px]"
                                onClick={() => setModalImportInputPesertaOpen(true)}
                            >
                                <Import className="h-5 w-5" />
                                Import Peserta
                            </Button>

                            <Button
                                qa="button-add-peserta"
                                variant="green"
                                className="flex items-center gap-2 w-[170px]"
                                onClick={() => setModalAddInputPesertaOpen(true)}
                            >
                                <Plus className="h-5 w-5" />
                                Tambah Peserta
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <TitlePage
                            title="Data Ditemukan"
                            tag="h3"
                            size="md"
                            className="text-blue-pnm-2 font-semibold"
                        />
                        <DataTable
                            qa="table-data-input-peserta-ditemukan"
                            data={pesertaFields || []}
                            columns={columns}
                            isLoading={false}
                            filtering={filtering}
                            setFiltering={setFiltering}
                        />
                    </div>

                    {
                        notFoundData.length > 0 && (
                            <div className="flex flex-col gap-2 mt-10">
                                <TitlePage
                                    title="Data Tidak Ditemukan"
                                    tag="h3"
                                    size="md"
                                    className="text-blue-pnm-2 font-semibold"
                                />
                                <p className="text-sm text-rose-500">Terdapat <span className="text-rose-600 font-bold">{notFoundData?.length}</span> data peserta yang tidak ditemukan, tidak masuk dalam Pengajuan Usulan Event.</p>
                                <DataTable
                                    qa="table-data-input-peserta-tidak-ditemukan"
                                    data={notFoundData || []}
                                    columns={columnsNotFound}
                                    isLoading={false}
                                    filtering={filtering}
                                    setFiltering={setFiltering}
                                />
                            </div>
                        )
                    }


                    <div className="flex flex-col gap-4 mt-15">

                        {
                            pesertaFields.length <= 0 && (
                                <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-md">
                                    <Info className="h-4 w-4 text-gray-700" />
                                    <p className="text-gray-700 text-sm">Masukkan minimal 1 peserta untuk melanjutkan ke proses selanjutnya</p>
                                </div>
                            )
                        }
                        <div className="flex justify-end items-center gap-3">
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
                                disabled={pesertaFields.length <= 0}
                                onClick={(e) => {
                                    e.preventDefault()
                                    onSubmit()
                                }}
                            >
                                <span>Simpan dan lanjutkan</span>
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </LayoutPengajuanEvent>

            <ModalImportInputPeserta
                isOpen={modalImportInputPesertaOpen}
                onClose={() => setModalImportInputPesertaOpen(false)}
                addListInputPeserta={addListInputPeserta}
            />

            <ModalAddInputPeserta
                isOpen={modalAddInputPesertaOpen}
                onClose={() => setModalAddInputPesertaOpen(false)}
                addListInputPeserta={addListInputPeserta}
            />
        </>
    )
}
