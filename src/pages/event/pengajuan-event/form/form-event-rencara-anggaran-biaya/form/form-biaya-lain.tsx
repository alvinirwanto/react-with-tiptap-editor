import TitlePage from "@/components/title-page";
import { useEffect } from "react";
import { FieldError, useFieldArray, useFormContext } from "react-hook-form";

import InputSelect from "@/components/input/input-select";
import InputNumber from "@/components/input/input-number";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PiPlusSquareFill } from "react-icons/pi";
import InputText from "@/components/input/input-text";
import { useQuery } from "@tanstack/react-query";
import { getBiayaLainSearchFn, getUnitSatuanSearchFn } from "@/api/admin/api-search-input";
import toast from "react-hot-toast";


interface FormBiayaLainProps {
    setSubError: (e: boolean) => void;
}

export default function FormBiayaLain({
    setSubError
}: Readonly<FormBiayaLainProps>) {

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
        data: listBiayaLain = [],
        isLoading: isLoadingBiayaLain,
        isError: isErrorBiayaLain,
        error: errorBiayaLain
    } = useQuery({
        queryKey: ["search-biaya-lain"],
        queryFn: () => getBiayaLainSearchFn(),
        staleTime: Infinity,
    });

    useEffect(() => {
        if (isErrorBiayaLain) {
            toast.error(`Failed to fetch data unit: ${(errorBiayaLain as any)?.description || "Unknown error"}`);
        }
    }, [isErrorBiayaLain]);


    const form = useFormContext();

    const {
        fields: biayaLainFields,
        append: appendBiayaLain,
        remove: removeBiayaLain
    } = useFieldArray({
        control: form.control,
        name: 'biaya_lain',
    });

    useEffect(() => {
        const subscription = form.watch((value, { name, type }) => {
            if (type !== 'change') return;
            if (!name) return;

            const matchJumlah = /^biaya_lain\.(\d+)\.jumlah$/.exec(name);
            const matchFrekuensi = /^biaya_lain\.(\d+)\.frekuensi$/.exec(name);
            const matchUnitCost = /^biaya_lain\.(\d+)\.unit_cost$/.exec(name);

            const match = matchJumlah || matchFrekuensi || matchUnitCost;
            if (!match) return;

            const index = Number(match[1]);

            const jumlah = form.getValues(`biaya_lain.${index}.jumlah`);
            const frekuensi = form.getValues(`biaya_lain.${index}.frekuensi`);
            const unitCost = form.getValues(`biaya_lain.${index}.unit_cost`);

            if (jumlah && frekuensi && unitCost) {
                const totalCost = (Number(jumlah) * Number(unitCost)) * Number(frekuensi)
                form.setValue(`biaya_lain.${index}.total_cost`, totalCost || '');
            }

        });

        return () => subscription.unsubscribe();
    }, [form]);


    // const [errorMessage, setErrorMessage] = useState(false)

    const watchFields = form.watch('biaya_lain');

    const isErrorArray = (errors: any): errors is FieldError[] => Array.isArray(errors);

    const allFieldsFilled = watchFields?.every((field: any, index: number) => {
        const errors = form.formState.errors.biaya_lain;
        const fieldError = isErrorArray(errors) ? errors[index] : errors;

        return (
            field.deskripsi &&
            field.jumlah &&
            field.unit &&
            field.frekuensi &&
            field.satuan &&
            field.unit_cost &&
            field.total_cost &&
            !fieldError
        );
    });

    const formAkomodasiKonsumsi = form.watch('biaya_lain')
    const subTotal = formAkomodasiKonsumsi?.reduce((sum: any, item: any) => sum + (item.total_cost), 0)

    useEffect(() => {
        if (subTotal) {
            form.setValue('sub_total_biaya_lain', Number(subTotal))
        }
    }, [subTotal])

    const stored = localStorage.getItem('form-event-data');

    useEffect(() => {
        if (stored) {
            const parsed = JSON.parse(stored);

            // If already save
            if (parsed.step5 && Array.isArray(parsed.step5.biaya_lain)) {
                const newBiayaLainLength = parsed.step5.biaya_lain.length;
                const currentBiayaLainLength = biayaLainFields.length;

                if (currentBiayaLainLength < newBiayaLainLength) {
                    const rowsToAdd = newBiayaLainLength - currentBiayaLainLength;
                    for (let i = 0; i < rowsToAdd; i++) {
                        appendBiayaLain({
                            deskripsi: '',
                            jumlah: 0,
                            unit: '',
                            frekuensi: 0,
                            satuan: '',
                            unit_cost: '',
                            total_cost: '',
                        }, { shouldFocus: false });
                    }
                }

                parsed.step5.biaya_lain.forEach((item: any, i: number) => {
                    form.setValue(`biaya_lain.${i}.deskripsi`, item.deskripsi);
                    form.setValue(`biaya_lain.${i}.jumlah`, item.jumlah);
                    form.setValue(`biaya_lain.${i}.unit`, item.unit);
                    form.setValue(`biaya_lain.${i}.frekuensi`, item.frekuensi);
                    form.setValue(`biaya_lain.${i}.satuan`, item.satuan);
                    form.setValue(`biaya_lain.${i}.unit_cost`, Number(item.unit_cost));
                    form.setValue(`biaya_lain.${i}.total_cost`, Number(item.total_cost));
                });
            }
        }

    }, [stored]);

    useEffect(() => {
        biayaLainFields.forEach((item, index) => {
            form.setValue(`biaya_lain.${index}.no_urut`, index + 1);
        })
    }, [biayaLainFields])

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
                title="Biaya Lain"
                tag="h3"
                size="md"
                className="text-blue-pnm-2 font-semibold"
            />
            <div className='w-full flex flex-col gap-4 border border-gray-200 rounded-md overflow-clip'>
                <div className='grid grid-cols-[1.3fr_5fr_2.3fr_4fr_2.3fr_4fr_4.5fr_4.5fr_1.5fr] gap-3 text-sm font-semibold bg-bg-table border-b border-gray-200 py-3 pr-2'>
                    <span className='w-full text-center'>No.</span>
                    <span>Deskripsi</span>
                    <span>Jumlah</span>
                    <span>Unit</span>
                    <span>Frekuensi</span>
                    <span>Satuan</span>
                    <span>Unit Cost</span>
                    <span>Total Cost</span>
                    <span>Action</span>
                </div>
                {
                    biayaLainFields.map((data, index) => (
                        <div key={data.id} className='grid grid-cols-[1.3fr_5fr_2.3fr_4fr_2.3fr_4fr_4.5fr_4.5fr_1.5fr] gap-3 pr-2'>
                            <span className='text-center text-sm font-semibold mt-2'>{index + 1}.</span>

                            <InputSelect
                                control={form.control}
                                name={`biaya_lain.${index}.deskripsi`}
                                qa={`biaya_lain.${index}.deskripsi`}
                                listData={listBiayaLain?.data || []}
                                placeholder="Pilih deskripsi biaya"
                                renderLabel={(item: any) => item?.nama}
                                isReset={false}
                                loading={isLoadingBiayaLain}
                            />

                            <InputNumber
                                control={form.control}
                                name={`biaya_lain.${index}.jumlah`}
                                qa={`biaya_lain.${index}.jumlah`}
                                placeholder="Masukkan jumlah"
                                value={0}
                                thousandSeparator="."
                                decimalSeparator=","
                            />

                            <InputSelect
                                control={form.control}
                                name={`biaya_lain.${index}.unit`}
                                qa={`biaya_lain.${index}.unit`}
                                listData={listUnitSatuan?.data?.unit || []}
                                placeholder="Pilih unit"
                                renderLabel={(item: any) => item?.nama}
                                isReset={false}
                                loading={isLoadingUnitSatuan}
                            />

                            <InputNumber
                                control={form.control}
                                name={`biaya_lain.${index}.frekuensi`}
                                qa={`biaya_lain.${index}.frekuensi`}
                                placeholder="Masukkan frekuensi"
                                value={0}
                                thousandSeparator="."
                                decimalSeparator=","
                            />

                            <InputSelect
                                control={form.control}
                                name={`biaya_lain.${index}.satuan`}
                                qa={`biaya_lain.${index}.satuan`}
                                listData={listUnitSatuan?.data?.satuan || []}
                                placeholder="Pilih satuan"
                                renderLabel={(item: any) => item?.nama}
                                isReset={false}
                                loading={isLoadingUnitSatuan}
                            />

                            <InputNumber
                                control={form.control}
                                name={`biaya_lain.${index}.unit_cost`}
                                qa={`biaya_lain.${index}.unit_cost`}
                                placeholder="Masukkan unit cost"
                                value={0}
                                prefix="Rp "
                                thousandSeparator="."
                                decimalSeparator=","
                            />

                            <InputNumber
                                control={form.control}
                                name={`biaya_lain.${index}.total_cost`}
                                qa={`biaya_lain.${index}.total_cost`}
                                placeholder="Masukkan total cost"
                                disabled
                                value={0}
                                prefix="Rp "
                                thousandSeparator="."
                                decimalSeparator=","
                            />
                            {
                                biayaLainFields.length > 1 && (
                                    <Button
                                        qa='button-delete-scoring'
                                        type="button"
                                        variant='ghost'
                                        size='icon'
                                        className='flex items-center justify-center w-10 h-10 p-0 hover:bg-rose-50'
                                        onClick={() => removeBiayaLain(index)}
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
                        biayaLainFields.length < 10 && (
                            <Button
                                qa='button-add-akomodasi-konsumsi'
                                variant='ghost'
                                type="button"
                                disabled={!allFieldsFilled}
                                onClick={() =>
                                    appendBiayaLain({
                                        deskripsi: '',
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