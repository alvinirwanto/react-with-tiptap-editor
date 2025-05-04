import TitlePage from "@/components/title-page";
import { useEffect, useState } from "react";
import { FieldError, useFieldArray, useFormContext } from "react-hook-form";

import dummyData from '../../../../../../assets/dummyData.json'
import InputSelect from "@/components/input/input-select";
import InputNumber from "@/components/input/input-number";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PiPlusSquareFill } from "react-icons/pi";
import { getBiayaAkomodasiKonsumsiSearchFn, getUnitSatuanSearchFn } from "@/api/admin/api-search-input";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";


interface FormAkomodasiKonsumsiProps {
    setSubError: (e: boolean) => void;
}
export default function FormAkomodasiKonsumsi(
    { setSubError }: Readonly<FormAkomodasiKonsumsiProps>
) {

    const {
        data: listUnitSatuan = [],
        isLoading: isLoadingUnitSatuan,
        isError: isErrorUnitSatuan,
        error: errorUnitSatuan
    } = useQuery({
        queryKey: ["search-akademi"],
        queryFn: () => getUnitSatuanSearchFn(),
        staleTime: Infinity,
    });

    useEffect(() => {
        if (isErrorUnitSatuan) {
            toast.error(`Failed to fetch data unit: ${(errorUnitSatuan as any)?.description || "Unknown error"}`);
        }
    }, [isErrorUnitSatuan]);


    const {
        data: listBiayaAkomodasiKonsumsi = [],
        isLoading: isLoadingBiayaAkomodasiKonsumsi,
        isError: isErrorBiayaAkomodasiKonsumsi,
        error: errorBiayaAkomodasiKonsumsi
    } = useQuery({
        queryKey: ["search-biaya-akomodasi"],
        queryFn: () => getBiayaAkomodasiKonsumsiSearchFn(),
        staleTime: Infinity,
    });

    useEffect(() => {
        if (isErrorBiayaAkomodasiKonsumsi) {
            toast.error(`Failed to fetch data unit: ${(errorBiayaAkomodasiKonsumsi as any)?.description || "Unknown error"}`);
        }
    }, [isErrorBiayaAkomodasiKonsumsi]);


    const form = useFormContext();

    const {
        fields: akomodasiKonsumsiFields,
        append: appendAkomodasiKonsumsi,
        remove: removeAkomodasiKonsumsi
    } = useFieldArray({
        control: form.control,
        name: 'akomodasi_konsumsi',
    });

    useEffect(() => {
        const subscription = form.watch((value, { name, type }) => {
            if (type !== 'change') return;
            if (!name) return;

            const matchJumlah = /^akomodasi_konsumsi\.(\d+)\.jumlah$/.exec(name);
            const matchFrekuensi = /^akomodasi_konsumsi\.(\d+)\.frekuensi$/.exec(name);
            const matchUnitCost = /^akomodasi_konsumsi\.(\d+)\.unit_cost$/.exec(name);

            const match = matchJumlah || matchFrekuensi || matchUnitCost;
            if (!match) return;

            const index = Number(match[1]);

            const jumlah = form.getValues(`akomodasi_konsumsi.${index}.jumlah`);
            const frekuensi = form.getValues(`akomodasi_konsumsi.${index}.frekuensi`);
            const unitCost = form.getValues(`akomodasi_konsumsi.${index}.unit_cost`);

            if (jumlah && frekuensi && unitCost) {
                const totalCost = (Number(jumlah) * Number(unitCost)) * Number(frekuensi)
                form.setValue(`akomodasi_konsumsi.${index}.total_cost`, totalCost || '');
            }

        });

        return () => subscription.unsubscribe();
    }, [form]);


    const watchFields = form.watch('akomodasi_konsumsi');

    const isErrorArray = (errors: any): errors is FieldError[] => Array.isArray(errors);

    const allFieldsFilled = watchFields?.every((field: any, index: number) => {
        const errors = form.formState.errors.akomodasi_konsumsi;
        const fieldError = isErrorArray(errors) ? errors[index] : errors;

        return (
            field.jenis &&
            field.jumlah &&
            field.unit &&
            field.frekuensi &&
            field.satuan &&
            field.unit_cost &&
            field.total_cost &&
            !fieldError
        );
    });

    const formAkomodasiKonsumsi = form.watch('akomodasi_konsumsi')
    const subTotal = formAkomodasiKonsumsi?.reduce((sum: any, item: any) => sum + (item.total_cost), 0)

    useEffect(() => {
        if (subTotal) {
            form.setValue('sub_total_akomodasi_konsumsi', Number(subTotal))
        }
    }, [subTotal])


    const stored = localStorage.getItem('form-event-data');

    useEffect(() => {
        if (stored) {
            const parsed = JSON.parse(stored);

            // If already save
            if (parsed.step5 && Array.isArray(parsed.step5.akomodasi_konsumsi)) {
                const newAkomodasiKonsumsiLength = parsed.step5.akomodasi_konsumsi.length;
                const currentAkomodasiKonsumsiLength = akomodasiKonsumsiFields.length;

                if (currentAkomodasiKonsumsiLength < newAkomodasiKonsumsiLength) {
                    const rowsToAdd = newAkomodasiKonsumsiLength - currentAkomodasiKonsumsiLength;
                    for (let i = 0; i < rowsToAdd; i++) {
                        appendAkomodasiKonsumsi({
                            jenis: '',
                            jumlah: 0,
                            unit: '',
                            frekuensi: 0,
                            satuan: '',
                            unit_cost: '',
                            total_cost: '',
                        }, { shouldFocus: false });
                    }
                }

                parsed.step5.akomodasi_konsumsi.forEach((item: any, i: number) => {
                    form.setValue(`akomodasi_konsumsi.${i}.jenis`, item.jenis);
                    form.setValue(`akomodasi_konsumsi.${i}.jumlah`, item.jumlah);
                    form.setValue(`akomodasi_konsumsi.${i}.unit`, item.unit);
                    form.setValue(`akomodasi_konsumsi.${i}.frekuensi`, item.frekuensi);
                    form.setValue(`akomodasi_konsumsi.${i}.satuan`, item.satuan);
                    form.setValue(`akomodasi_konsumsi.${i}.unit_cost`, Number(item.unit_cost));
                    form.setValue(`akomodasi_konsumsi.${i}.total_cost`, Number(item.total_cost));
                });
            }
        }

    }, [stored]);

    useEffect(() => {
        akomodasiKonsumsiFields.forEach((item, index) => {
            form.setValue(`akomodasi_konsumsi.${index}.no_urut`, index + 1);
        })
    }, [akomodasiKonsumsiFields])


    // const [errorMessage, setErrorMessage] = useState(false)

    // useEffect(() => {
    //     if (errorMessage) {
    //         setSubError(true)
    //     } else {
    //         setSubError(false)
    //     }
    // }, [errorMessage])


    return (
        <div className="flex flex-col gap-2">
            <TitlePage
                title="Akomodasi dan Konsumsi"
                tag="h3"
                size="md"
                className="text-blue-pnm-2 font-semibold"
            />
            <div className='w-full flex flex-col gap-4 border border-gray-200 rounded-md overflow-clip'>
                <div className='grid grid-cols-[1.3fr_5fr_2.3fr_4fr_2.3fr_4fr_4.5fr_4.5fr_1.5fr] gap-3 text-sm font-semibold bg-bg-table border-b border-gray-200 py-3 pr-2'>
                    <span className='w-full text-center'>No.</span>
                    <span>Jenis Akomodasi</span>
                    <span>Jumlah</span>
                    <span>Unit</span>
                    <span>Frekuensi</span>
                    <span>Satuan</span>
                    <span>Unit Cost</span>
                    <span>Total Cost</span>
                    <span>Action</span>
                </div>
                {
                    akomodasiKonsumsiFields.map((data, index) => (
                        <div key={data.id} className='grid grid-cols-[1.3fr_5fr_2.3fr_4fr_2.3fr_4fr_4.5fr_4.5fr_1.5fr] gap-3 pr-2'>
                            <span className='text-center text-sm font-semibold mt-2'>{index + 1}.</span>

                            <InputSelect
                                control={form.control}
                                name={`akomodasi_konsumsi.${index}.jenis`}
                                qa={`akomodasi_konsumsi.${index}.jenis`}
                                listData={listBiayaAkomodasiKonsumsi?.data
                                    ? Object.values(listBiayaAkomodasiKonsumsi.data).flat()
                                    : []}
                                placeholder="Pilih Jenis Akomodasi"
                                renderLabel={(item: any) => item?.nama}
                                isReset={false}
                                loading={isLoadingBiayaAkomodasiKonsumsi}
                            />

                            <InputNumber
                                control={form.control}
                                name={`akomodasi_konsumsi.${index}.jumlah`}
                                qa={`akomodasi_konsumsi.${index}.jumlah`}
                                placeholder="Masukkan jumlah"
                                value={0}
                                thousandSeparator="."
                                decimalSeparator=","
                            />

                            <InputSelect
                                control={form.control}
                                name={`akomodasi_konsumsi.${index}.unit`}
                                qa={`akomodasi_konsumsi.${index}.unit`}
                                listData={listUnitSatuan?.data?.unit || []}
                                placeholder="Pilih unit"
                                renderLabel={(item: any) => item?.nama}
                                isReset={false}
                                loading={isLoadingUnitSatuan}
                            />

                            <InputNumber
                                control={form.control}
                                name={`akomodasi_konsumsi.${index}.frekuensi`}
                                qa={`akomodasi_konsumsi.${index}.frekuensi`}
                                placeholder="Masukkan frekuensi"
                                value={0}
                                thousandSeparator="."
                                decimalSeparator=","
                            />

                            <InputSelect
                                control={form.control}
                                name={`akomodasi_konsumsi.${index}.satuan`}
                                qa={`akomodasi_konsumsi.${index}.satuan`}
                                listData={listUnitSatuan?.data?.satuan || []}
                                placeholder="Pilih satuan"
                                renderLabel={(item: any) => item?.nama}
                                isReset={false}
                                loading={isLoadingUnitSatuan}
                            />

                            <InputNumber
                                control={form.control}
                                name={`akomodasi_konsumsi.${index}.unit_cost`}
                                qa={`akomodasi_konsumsi.${index}.unit_cost`}
                                placeholder="Masukkan unit cost"
                                value={0}
                                prefix="Rp "
                                thousandSeparator="."
                                decimalSeparator=","
                            />

                            <InputNumber
                                control={form.control}
                                name={`akomodasi_konsumsi.${index}.total_cost`}
                                qa={`akomodasi_konsumsi.${index}.total_cost`}
                                placeholder="Masukkan total cost"
                                disabled
                                value={0}
                                prefix="Rp "
                                thousandSeparator="."
                                decimalSeparator=","
                            />
                            {
                                akomodasiKonsumsiFields.length > 1 && (
                                    <Button
                                        qa='button-delete-scoring'
                                        type="button"
                                        variant='ghost'
                                        size='icon'
                                        className='flex items-center justify-center w-10 h-10 p-0 hover:bg-rose-50'
                                        onClick={() => removeAkomodasiKonsumsi(index)}
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
                        akomodasiKonsumsiFields.length < 10 && (
                            <Button
                                qa='button-add-akomodasi-konsumsi'
                                variant='ghost'
                                type="button"
                                disabled={!allFieldsFilled}
                                onClick={() =>
                                    appendAkomodasiKonsumsi({
                                        jenis: '',
                                        jumlah: 0,
                                        unit: '',
                                        frekuensi: 0,
                                        satuan: '',
                                        unit_cost: '',
                                        total_cost: '',
                                    }, { shouldFocus: false })
                                }
                                className='w-[150px] flex items-center gap-2 rounded-md text-blue-pnm hover:text-blue-pnm hover:bg-blue-100'
                            >
                                <PiPlusSquareFill className='h-6 w-6 text-blue-pnm' />
                                <span>Tambah Data</span>
                            </Button>
                        )
                    }
                </div>
                <div className="flex flex-col text-sm font-semibold tracking-wide">
                    <div className="w-full p-4 bg-blue-pnm-2/20 flex items-center justify-between">
                        <span>Sub Total</span>
                        <span>Rp. {Number(subTotal).toLocaleString('id-ID')}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}