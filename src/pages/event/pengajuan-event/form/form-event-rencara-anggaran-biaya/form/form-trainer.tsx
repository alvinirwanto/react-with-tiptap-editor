import InputText from "@/components/input/input-text";
import TitlePage from "@/components/title-page";
import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import InputSelect from "@/components/input/input-select";
import InputNumber from "@/components/input/input-number";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getUnitSatuanSearchFn } from "@/api/admin/api-search-input";
import toast from "react-hot-toast";

interface FormTrainerProps {
    anggaranDeviasi: number;
    setSubError: (e: boolean) => void;
}
export default function FormTrainer({
    anggaranDeviasi,
    setSubError
}: Readonly<FormTrainerProps>) {

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

    const form = useFormContext();

    const {
        fields: trainerFields,
        append: appendTrainer
    } = useFieldArray({
        control: form.control,
        name: 'trainer',
    });

    useEffect(() => {
        const subscription = form.watch((value, { name, type }) => {
            if (type !== 'change') return;
            if (!name) return;

            const matchJumlah = /^trainer\.(\d+)\.jumlah$/.exec(name);
            const matchFrekuensi = /^trainer\.(\d+)\.frekuensi$/.exec(name);
            const matchUnitCost = /^trainer\.(\d+)\.unit_cost$/.exec(name);

            const match = matchJumlah || matchFrekuensi || matchUnitCost;
            if (!match) return;

            const index = Number(match[1]);

            const jumlah = form.getValues(`trainer.${index}.jumlah`);
            const frekuensi = form.getValues(`trainer.${index}.frekuensi`);
            const unitCost = form.getValues(`trainer.${index}.unit_cost`);

            if (jumlah && frekuensi && unitCost) {
                const totalCost = (Number(jumlah) * Number(unitCost)) * Number(frekuensi)
                form.setValue(`trainer.${index}.total_cost`, totalCost || '');
            }

        });

        return () => subscription.unsubscribe();
    }, [form]);


    const [errorMessage, setErrorMessage] = useState(false)

    const formTrainer = form.watch('trainer')

    const subTotalTrainer = formTrainer.reduce((sum: number, item: any) => {
        const cost = Number(item.total_cost)
        return sum + (isNaN(cost) ? 0 : cost)
    }, 0)

    const subTotalTrainerEksternal = formTrainer
        .filter((item: any) => item.tipe_trainer === 'eksternal')
        .reduce((sum: number, item: any) => {
            const cost = Number(item.total_cost)
            return sum + (isNaN(cost) ? 0 : cost)
        }, 0)

    const sisaAnggaranTrainerEksternal = 3000000 - Number(subTotalTrainerEksternal)

    useEffect(() => {
        if (sisaAnggaranTrainerEksternal < 0 && !anggaranDeviasi) {
            setErrorMessage(true)
        } else {
            setErrorMessage(false)
        }
    }, [sisaAnggaranTrainerEksternal])

    useEffect(() => {
        if (subTotalTrainer && !errorMessage) {
            form.setValue('sub_total_trainer', Number(subTotalTrainer))
        }
    }, [subTotalTrainer])


    const stored = localStorage.getItem('form-event-data');

    useEffect(() => {
        if (stored) {
            const parsed = JSON.parse(stored);

            console.log(parsed.step5.trainer);

            // If already save
            if (parsed.step5.trainer && Array.isArray(parsed.step5.trainer) && parsed.step5.trainer.length > 0) {
                const newTrainerLength = parsed.step5.trainer.length;
                const currentTrainerLength = trainerFields.length;

                if (currentTrainerLength < newTrainerLength) {
                    const rowsToAdd = newTrainerLength - currentTrainerLength;
                    for (let i = 0; i < rowsToAdd; i++) {
                        appendTrainer({
                            trainer: '',
                            jumlah: 0,
                            unit: '',
                            frekuensi: 0,
                            satuan: '',
                            unit_cost: '',
                            total_cost: '',
                            tipe_trainer: ''
                        }, { shouldFocus: false });
                    }
                }

                parsed.step5.trainer.forEach((item: any, i: number) => {
                    form.setValue(`trainer.${i}.trainer`, item.trainer);
                    form.setValue(`trainer.${i}.jumlah`, item.jumlah);
                    form.setValue(`trainer.${i}.unit`, item.unit);
                    form.setValue(`trainer.${i}.frekuensi`, item.frekuensi);
                    form.setValue(`trainer.${i}.satuan`, item.satuan);
                    form.setValue(`trainer.${i}.unit_cost`, Number(item.unit_cost));
                    form.setValue(`trainer.${i}.total_cost`, Number(item.total_cost));
                    form.setValue(`trainer.${i}.tipe_trainer`, item.tipe_trainer);
                });

                setTimeout(() => {
                    setSubError(false);
                }, 50)

                // For first setup
            } else
                if (parsed.step4 && Array.isArray(parsed.step4.trainer_internal) && Array.isArray(parsed.step4.trainer_eksternal)) {

                    const keysArray1 = Object.keys(parsed.step4.trainer_internal[0]);
                    const keysArray2 = Object.keys(parsed.step4.trainer_eksternal[0]);

                    const commonKeys = keysArray1.filter(key => keysArray2.includes(key));

                    // Now map and pick only common keys
                    const combineList = [...parsed.step4.trainer_internal, ...parsed.step4.trainer_eksternal].map(obj => {
                        const filtered: { [key: string]: any } = {};

                        for (const key of commonKeys) {
                            if (key in obj) {
                                filtered[key] = obj[key];
                            }
                        }
                        return filtered;
                    });


                    const combineListLength = combineList.length;
                    const currentListLength = trainerFields.length;

                    if (currentListLength < combineListLength) {
                        const rowsToAdd = combineListLength - currentListLength;
                        for (let i = 0; i < rowsToAdd; i++) {
                            appendTrainer({
                                trainer: '',
                                jumlah: 0,
                                unit: '',
                                frekuensi: 0,
                                satuan: '',
                                unit_cost: '',
                                total_cost: '',
                                tipe_trainer: ''
                            }, { shouldFocus: false });
                        }
                    }

                    combineList.forEach((item: any, i: number) => {
                        form.setValue(`trainer.${i}.trainer`, item.nama_trainer.name || item.nama_trainer);
                        form.setValue(`trainer.${i}.jumlah`, 1);
                        form.setValue(`trainer.${i}.unit`, {
                            unit_satuan: "unit",
                            nama: "Pax"
                        });
                        form.setValue(`trainer.${i}.frekuensi`, 1);
                        form.setValue(`trainer.${i}.satuan`, {
                            unit_satuan: "satuan",
                            nama: "Kali"
                        });
                        form.setValue(`trainer.${i}.tipe_trainer`, item.tipe_trainer);
                    });
                }

        }

    }, [stored]);

    useEffect(() => {
        trainerFields.forEach((item, index) => {
            form.setValue(`trainer.${index}.no_urut`, index + 1);
        })
    }, [trainerFields])


    useEffect(() => {
        if (errorMessage) {
            setSubError(true);
        } else {
            setSubError(false);
        }
    }, [errorMessage, setSubError])


    return (
        <div className="flex flex-col gap-2">
            <TitlePage
                title="Trainer"
                tag="h3"
                size="md"
                className="text-blue-pnm-2 font-semibold"
            />
            <div className='w-full flex flex-col gap-4 border border-gray-200 rounded-md overflow-clip'>
                <div className='grid grid-cols-[1.3fr_5fr_2.3fr_4fr_2.3fr_4fr_4.5fr_4.5fr] gap-3 text-sm font-semibold bg-bg-table border-b border-gray-200 py-3 pr-2'>
                    <span className='w-full text-center'>No.</span>
                    <span>Trainer</span>
                    <span>Jumlah</span>
                    <span>Unit</span>
                    <span>Frekuensi</span>
                    <span>Satuan</span>
                    <span>Unit Cost</span>
                    <span>Total Cost</span>
                </div>
                {
                    trainerFields
                        .map((data: any, index: number) => ({ ...data, index }))
                        .sort((a, b) => {
                            // Ensure internal comes first
                            const tipeA = form.getValues(`trainer.${a.index}.tipe_trainer`);
                            const tipeB = form.getValues(`trainer.${b.index}.tipe_trainer`);
                            return tipeA === 'internal' && tipeB === 'eksternal' ? -1 : 0;
                        })
                        .map((data, idx, arr) => {
                            const tipe = form.watch(`trainer.${data.index}.tipe_trainer`);
                            const prevTipe = idx > 0 ? form.watch(`trainer.${arr[idx - 1].index}.tipe_trainer`) : null;

                            return (
                                <div key={data.id}>
                                    {
                                        tipe === 'internal' && prevTipe !== 'internal' && (
                                            <div className="mb-4 flex flex-col gap-4">
                                                <span className="pl-4 text-gray-400 text-sm">Trainer Internal</span>
                                            </div>
                                        )
                                    }
                                    {
                                        tipe === 'eksternal' && prevTipe === 'internal' && (
                                            <div className="mb-4 flex flex-col gap-4">
                                                <hr className="border border-dashed" />
                                                <span className="pl-4 text-gray-400 text-sm">Trainer Eksternal</span>
                                            </div>
                                        )
                                    }
                                    <div className='grid grid-cols-[1.3fr_5fr_2.3fr_4fr_2.3fr_4fr_4.5fr_4.5fr] gap-3 pr-2'>
                                        <span className='text-center text-sm font-semibold mt-2'>{data.index + 1}.</span>
                                        <InputText
                                            qa={`trainer.${data.index}.trainer`}
                                            name={`trainer.${data.index}.trainer`}
                                            control={form.control}
                                            placeholder='Masukkan trainer'
                                            disabled
                                        />
                                        <InputNumber
                                            control={form.control}
                                            name={`trainer.${data.index}.jumlah`}
                                            qa={`trainer.${data.index}.jumlah`}
                                            placeholder="Masukkan jumlah"
                                            value={0}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            disabled
                                        />
                                        <InputSelect
                                            control={form.control}
                                            name={`trainer.${data.index}.unit`}
                                            qa={`trainer.${data.index}.unit`}
                                            listData={listUnitSatuan?.data?.unit || []}
                                            placeholder="Pilih unit"
                                            renderLabel={(item: any) => item?.nama}
                                            isReset={false}
                                            loading={isLoadingUnitSatuan}
                                            disabled
                                        />
                                        <InputNumber
                                            control={form.control}
                                            name={`trainer.${data.index}.frekuensi`}
                                            qa={`trainer.${data.index}.frekuensi`}
                                            placeholder="Masukkan frekuensi"
                                            value={0}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            disabled
                                        />
                                        <InputSelect
                                            control={form.control}
                                            name={`trainer.${data.index}.satuan`}
                                            qa={`trainer.${data.index}.satuan`}
                                            listData={listUnitSatuan?.data?.satuan || []}
                                            placeholder="Pilih satuan"
                                            renderLabel={(item: any) => item?.nama}
                                            isReset={false}
                                            loading={isLoadingUnitSatuan}
                                            disabled
                                        />
                                        <InputNumber
                                            control={form.control}
                                            name={`trainer.${data.index}.unit_cost`}
                                            qa={`trainer.${data.index}.unit_cost`}
                                            placeholder="Masukkan unit cost"
                                            value={0}
                                            prefix="Rp "
                                            thousandSeparator="."
                                            decimalSeparator=","
                                        />
                                        <InputNumber
                                            control={form.control}
                                            name={`trainer.${data.index}.total_cost`}
                                            qa={`trainer.${data.index}.total_cost`}
                                            placeholder="Masukkan total cost"
                                            disabled
                                            value={0}
                                            prefix="Rp "
                                            thousandSeparator="."
                                            decimalSeparator=","
                                        />
                                    </div>
                                </div>
                            );
                        })
                }
                <div className="flex flex-col text-sm font-semibold tracking-wide">
                    {
                        !anggaranDeviasi && (
                            <>
                                {
                                    errorMessage && (
                                        <div className="bg-rose-100 px-3 py-2 flex items-center gap-2">
                                            <Info className="h-3.5 w-3.5 text-rose-500" />
                                            <span className="text-rose-500 text-[13px] font-normal">Sub total untuk <span className="font-bold">Trainer Eksternal</span> melebihi anggaran yang telah ditentukan</span>
                                        </div>
                                    )
                                }
                                <div className="w-full p-4 bg-gray-100 flex items-center justify-between">
                                    <span>Sisa Anggaran Trainer Eksternal</span>
                                    <span className={cn(errorMessage ? 'text-rose-500' : 'text-black')}>Rp. {Number(sisaAnggaranTrainerEksternal).toLocaleString('id-ID')}</span>
                                </div>
                            </>
                        )
                    }
                    <div className="w-full p-4 bg-blue-pnm-2/20 flex items-center justify-between">
                        <span>Sub Total</span>
                        <span>Rp. {Number(subTotalTrainer).toLocaleString('id-ID')}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
