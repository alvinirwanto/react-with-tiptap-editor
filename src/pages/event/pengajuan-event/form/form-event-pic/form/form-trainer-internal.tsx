import InputCombobox from "@/components/input/input-combobox";
import InputText from "@/components/input/input-text";
import TitlePage from "@/components/title-page";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { FieldError, useFieldArray, useFormContext } from "react-hook-form";
import { PiPlusSquareFill } from "react-icons/pi";

import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useDebouncedState from "@/hooks/use-debounce-state-search";
import { getTrainerSearchFn } from "@/api/admin/api-search-input";


export default function FormTrainerInternal() {

    // Fetch Data Field 
    const [searchTrainer, setSearchTrainer] = useDebouncedState(" ");

    const { data: listTrainer = [],
        isLoading: isLoadingTrainer,
        isError: isErrorTrainer,
        error: errorTrainer
    } = useQuery({
        queryKey: ["search-trainer-internal", searchTrainer],
        queryFn: () => getTrainerSearchFn(1, searchTrainer),
        enabled: !!searchTrainer,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (isErrorTrainer) {
            toast.error(`Failed to fetch data trainer: ${(errorTrainer as any)?.description || "Unknown error"}`);
        }
    }, [isErrorTrainer]);

    const form = useFormContext();

    const {
        fields: trainerInternalFields,
        append: appendTrainerInternal,
        remove: removeTrainerInternal
    } = useFieldArray({
        control: form.control,
        name: 'trainer_internal',
    });


    useEffect(() => {
        const subscription = form.watch((value, { name, type }) => {
            if (type !== 'change') return;
            if (!name?.includes('nama_trainer')) return;

            const match = RegExp(/^trainer_internal\.(\d+)\.nama_trainer$/).exec(name);
            if (!match) return;

            const index = Number(match[1]);
            const selectedTrainer = form.getValues(`trainer_internal.${index}.nama_trainer`);
            const unitKerjaValue = selectedTrainer?.unit_kerja || '';

            form.setValue(`trainer_internal.${index}.unit_kerja`, unitKerjaValue || '', { shouldValidate: false });
            form.trigger(`trainer_internal.${index}.unit_kerja`);

            form.setValue(`trainer_internal.${index}.no_urut`, index + 1);
            form.setValue(`trainer_internal.${index}.tipe_trainer`, 'internal');
        });

        return () => subscription.unsubscribe();
    }, [form]);

    useEffect(() => {
        trainerInternalFields.forEach((trainer_internal, index) => {
            form.setValue(`trainer_internal.${index}.no_urut`, index + 1);
            form.setValue(`trainer_internal.${index}.tipe_trainer`, 'internal');
        })
    }, [trainerInternalFields])

    const watchFields = form.watch('trainer_internal');

    const isErrorArray = (errors: any): errors is FieldError[] => Array.isArray(errors);

    const allFieldsFilled = watchFields?.every((field: any, index: number) => {
        const errors = form.formState.errors.pic;
        const fieldError = isErrorArray(errors) ? errors[index] : errors;

        return (
            field.nama_trainer &&
            field.materi &&
            field.unit_kerja &&
            !fieldError
        );
    });

    const stored = localStorage.getItem('form-event-data');

    useEffect(() => {
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.step4 && Array.isArray(parsed.step4.trainer_internal)) {
                const newTrainerLength = parsed.step4.trainer_internal.length;
                const currentTrainerLength = trainerInternalFields.length;

                if (currentTrainerLength < newTrainerLength) {
                    // Append only the missing fields
                    const rowsToAdd = newTrainerLength - currentTrainerLength;
                    for (let i = 0; i < rowsToAdd; i++) {
                        appendTrainerInternal({
                            no_urut: 0,
                            nama_trainer: '',
                            materi: '',
                            unit_kerja: ''
                        }, { shouldFocus: false });
                    }
                }

                parsed.step4.trainer_internal.forEach((item: any, i: number) => {
                    form.setValue(`trainer_internal.${i}.nama_trainer`, item.nama_trainer);
                    form.setValue(`trainer_internal.${i}.materi`, item.materi);
                    form.setValue(`trainer_internal.${i}.unit_kerja`, item.unit_kerja);
                });
            }
        }
    }, [stored]);

    return (
        <div className="flex flex-col gap-2">
            <TitlePage
                title="Trainer Internal"
                tag="h3"
                size="md"
                className="text-blue-pnm-2 font-semibold"
            />
            <div className='w-full flex flex-col gap-4 border border-gray-200 rounded-md overflow-clip'>
                <div className='grid grid-cols-[1fr_5fr_5fr_5fr_1fr] gap-4 text-sm font-semibold bg-bg-table border-b border-gray-200 py-3'>
                    <span className='text-center'>No.</span>
                    <span>Nama Trainer</span>
                    <span>Materi</span>
                    <span>Unit Kerja</span>
                    <span>Action</span>
                </div>
                {
                    trainerInternalFields.map((data, index) => (
                        <div key={data.id} className='grid grid-cols-[1fr_5fr_5fr_5fr_1fr] gap-4'>
                            <span className='text-center text-sm font-semibold mt-2'>{index + 1}.</span>

                            <InputCombobox
                                control={form.control}
                                name={`trainer_internal.${index}.nama_trainer`}
                                qa={`trainer_internal.${index}.nama_trainer`}
                                listData={listTrainer?.data || []}
                                placeholder="Pilih nama PIC"
                                renderLabel={(item: any) => `${item.nama} (${item.nip})`}
                                compareFn={(item, value) => item?.nip === value?.nip}
                                loading={isLoadingTrainer}
                                onInputChange={setSearchTrainer}
                            />
                            <InputText
                                qa={`trainer_internal.${index}.materi`}
                                name={`trainer_internal.${index}.materi`}
                                control={form.control}
                                placeholder='Masukkan Materi'
                            />
                            <InputText
                                qa={`trainer_internal.${index}.unit_kerja`}
                                name={`trainer_internal.${index}.unit_kerja`}
                                control={form.control}
                                placeholder='Masukkan Unit Kerja'
                                disabled
                            />
                            {
                                trainerInternalFields.length > 1 && (
                                    <Button
                                        qa='button-delete-trainer-internal'
                                        type="button"
                                        variant='ghost'
                                        size='icon'
                                        className='flex items-center justify-center w-10 h-10 p-0 hover:bg-rose-50'
                                        onClick={() => removeTrainerInternal(index)}
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
                        trainerInternalFields.length < 10 && (
                            <Button
                                qa='button-add-trainer-internal'
                                variant='ghost'
                                type="button"
                                disabled={!allFieldsFilled}
                                onClick={() =>
                                    appendTrainerInternal({
                                        no_urut: 0,
                                        nama_trainer: '',
                                        materi: '',
                                        unit_kerja: ''
                                    }, { shouldFocus: false })
                                }
                                className='w-[170px] flex items-center gap-2 rounded-md text-blue-pnm hover:text-blue-pnm hover:bg-blue-100'
                            >
                                <PiPlusSquareFill className='h-6 w-6 text-blue-pnm' />
                                <span>Tambah Trainer</span>
                            </Button>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
