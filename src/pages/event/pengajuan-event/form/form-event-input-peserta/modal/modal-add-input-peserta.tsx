import ModalChildren from '@/components/modals/modal-children'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Info, PackageOpen, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useForm } from 'react-hook-form'
import InputComboboxMultipleSelect from '@/components/input/input-combobox-multiselect'
import { useQuery } from '@tanstack/react-query'
import { getNamaKaryawanSearchFn } from '@/api/admin/api-search-input'
import useDebouncedState from '@/hooks/use-debounce-state-search'
import toast from 'react-hot-toast'



interface ModalAddInputPesertaProps {
    isOpen: boolean;
    onClose: () => void;
    addListInputPeserta: any;
}

export default function ModalAddInputPeserta({
    isOpen,
    onClose,
    addListInputPeserta
}: Readonly<ModalAddInputPesertaProps>) {

    const [listSelectedPeserta, setListSelectedPeserta] = useState<any>([])
    const [errorSelectedPeserta, setErrorSelectedPeserta] = useState('')

    const form = useForm();

    const addListPeserta = () => {
        const newPesertaList = form.watch('name');

        if (!Array.isArray(newPesertaList)) {
            return;
        }

        const updatedList = [...listSelectedPeserta];
        let hasDuplicate = false;

        let duplicateNames: string[] = [];

        newPesertaList.forEach((peserta: any) => {
            const exists = updatedList.some((item: any) => item.nip === peserta.nip);
            if (!exists) {
                updatedList.push(peserta);
            } else {
                hasDuplicate = true;
                duplicateNames.push(peserta.nama);
            }
        });

        setListSelectedPeserta(updatedList);

        if (hasDuplicate) {
            setErrorSelectedPeserta(
                `Nama ${duplicateNames.join(', ')} sudah tercantum pada tabel di bawah. Silakan memilih nama lain.`
            );
        } else {
            setErrorSelectedPeserta('');
        }

        form.setValue('name', []);
    };


    const deletePeserta = (id: string | undefined) => {
        if (id) {
            setListSelectedPeserta(listSelectedPeserta.filter((peserta: any) => peserta.id !== id));
        }
    }

    // Fetch Data Field 
    const [searchKaryawan, setSearchKaryawan] = useDebouncedState("a");

    const { data: listKaryawan = [],
        isLoading: isLoadingKaryawan,
        isError: isErrorKaryawan,
        error: errorKaryawan
    } = useQuery({
        queryKey: ["search-user", searchKaryawan],
        queryFn: () => getNamaKaryawanSearchFn(searchKaryawan),
        enabled: !!searchKaryawan && isOpen,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (isErrorKaryawan) {
            toast.error(`Failed to fetch data akademi: ${(errorKaryawan as any)?.description || "Unknown error"}`);
        }
    }, [isErrorKaryawan]);


    useEffect(() => {
        if (!isOpen) {
            setListSelectedPeserta([])
        }
    }, [isOpen])

    return (
        <ModalChildren
            isOpen={isOpen}
            onClose={onClose}
            title='Tambah Karyawan'
            noCloseBackground
        >
            <div className="flex flex-col gap-4 w-[1100px] justify-start pr-2">
                <div className="flex gap-4 justify-between items-end">
                    <Form {...form}>
                        <div className='w-full '>
                            <InputComboboxMultipleSelect
                                qa="name"
                                name="name"
                                showBadges={false}
                                control={form.control}
                                label="Nama"
                                placeholder={listKaryawan?.data?.length === 5 ? '-' : "Pilih nama"}
                                listData={listKaryawan?.data ?? []}
                                renderLabel={(item: any) => `${item.nama} (${item.nip})`}
                                compareFn={(item, value) => item?.nip === value?.nip}
                                loading={isLoadingKaryawan}
                                onInputChange={setSearchKaryawan}
                            />
                        </div>
                    </Form>
                    <div className="flex h-full items-end">
                        <Button
                            qa-button='button-add-peserta'
                            variant='primary'
                            disabled={listSelectedPeserta.length < 0 || form.watch('name') === undefined}
                            className="w-[9rem] flex items-center justify-center gap-2"
                            onClick={() => addListPeserta()}
                        >
                            <Plus className="w-5 h-5" />
                            <span className="text-sm">Tambah</span>
                        </Button>
                    </div>
                </div>

                <div className="rounded-md border-[2px] overflow-clip min-h-[15rem]">
                    <Table className='table-fixed'>
                        <TableHeader className='bg-gray-50'>
                            <TableRow>
                                <TableHead className="text-center w-[70px]">No.</TableHead>
                                <TableHead className="w-[150px]">NIP</TableHead>
                                <TableHead className="w-[150px]">Nama</TableHead>
                                <TableHead className="w-[150px]">Posisi</TableHead>
                                <TableHead className="w-[150px]">Unit Kerja</TableHead>
                                <TableHead className="w-[150px]">Status Karyawan</TableHead>
                                <TableHead className="text-center w-[70px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className={`relative ${listSelectedPeserta.length === 0 ? 'h-[15rem]' : 'h-0'}`}>
                            {
                                listSelectedPeserta.length === 0
                                    ? <div className="absolute top-0 h-full w-full grid place-items-center">
                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                            <PackageOpen className="w-7 h-7 " />
                                            <span className="text-sm">Data tidak tersedia</span>
                                        </div>
                                    </div>
                                    : listSelectedPeserta.map((data: any, i: number) => (
                                        <TableRow key={data.id}>
                                            <TableCell className="font-medium py-4 text-center">
                                                <div className="text-center flex justify-center items-center relative scale-90">
                                                    <span className='z-20 text-[13px] font-medium'>
                                                        {i + 1}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className='py-2'>{data.nip}</TableCell>
                                            <TableCell className='py-2'>{data.nama}</TableCell>
                                            <TableCell className='py-2'>{data.posisi}</TableCell>
                                            <TableCell className='py-2'>{data.unit_kerja}</TableCell>
                                            <TableCell className='py-2'>{data.status_karyawan}</TableCell>
                                            <TableCell className="py-2 flex justify-center">
                                                <Button
                                                    qa-button='button-add-action'
                                                    variant='ghost'
                                                    onClick={() => deletePeserta(data.id)}
                                                    className='flex items-center justify-center h-fit px-3 py-2 gap-2 cursor-pointer hover:bg-rose-100'
                                                >
                                                    <Trash2 className='h-4 w-4 text-rose-500' />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            }
                        </TableBody>
                    </Table>
                </div>

                <div className="w-full flex justify-end items-center mt-4 gap-3">
                    <Button
                        qa-button='button-cancel-peserta'
                        variant='ghost'
                        className="w-[9rem] flex items-center justify-center gap-2"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        qa-button='button-submit-peserta'
                        variant='primary'
                        className="w-[9rem] flex items-center justify-center gap-2"
                        onClick={() => {
                            addListInputPeserta(listSelectedPeserta)
                            setListSelectedPeserta([])
                            onClose()
                        }}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </ModalChildren>
    )
}
