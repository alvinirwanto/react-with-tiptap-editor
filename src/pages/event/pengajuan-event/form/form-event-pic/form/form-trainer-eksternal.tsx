import { getTrainerSearchFn } from "@/api/admin/api-search-input";
import InputCombobox from "@/components/input/input-combobox";
import InputText from "@/components/input/input-text";
import TitlePage from "@/components/title-page";
import { Button } from "@/components/ui/button";
import useDebouncedState from "@/hooks/use-debounce-state-search";
import { useQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { FieldError, useFieldArray, useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { PiPlusSquareFill } from "react-icons/pi";

export default function FormTrainerEksternal() {

    // Fetch Data Field 
    const [searchTrainer, setSearchTrainer] = useDebouncedState(" ");

    const { data: listTrainer = [],
        isLoading: isLoadingTrainer,
        isError: isErrorTrainer,
        error: errorTrainer
    } = useQuery({
        queryKey: ["search-trainer-eksternal", searchTrainer],
        queryFn: () => getTrainerSearchFn(0, searchTrainer),
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
        fields: trainerEksternalFields,
        append: appendTrainerEksternal,
        remove: removeTrainerEksternal
    } = useFieldArray({
        control: form.control,
        name: 'trainer_eksternal',
        shouldUnregister: true,
    });

    useEffect(() => {
        const subscription = form.watch((value, { name, type }) => {
            if (type !== 'change') return;
            if (!name?.includes('nama_trainer')) return;

            const match = RegExp(/^trainer_eksternal\.(\d+)\.nama_trainer$/).exec(name);
            if (!match) return;

            const index = Number(match[1]);
            const selectedTrainer = form.getValues(`trainer_eksternal.${index}.nama_trainer`);

            const noHpValue = selectedTrainer?.no_handphone || '';
            const namaPtValue = selectedTrainer?.nama_perusahaan || '';

            console.log(noHpValue, namaPtValue);

            if (!form.watch(`trainer_eksternal.${index}.isNew`)) {

                form.setValue(`trainer_eksternal.${index}.no_hp`, noHpValue || '', { shouldValidate: false });
                form.trigger(`trainer_eksternal.${index}.no_hp`);

                form.setValue(`trainer_eksternal.${index}.nama_pt`, namaPtValue || '', { shouldValidate: false });
                form.trigger(`trainer_eksternal.${index}.nama_pt`);
                form.setValue(`trainer_eksternal.${index}.tipe_trainer`, 'eksternal');
            }
        });

        return () => subscription.unsubscribe();
    }, [form]);

    useEffect(() => {
        trainerEksternalFields.forEach((trainer_eksternal, index) => {
            form.setValue(`trainer_eksternal.${index}.no_urut`, index + 1);
            form.setValue(`trainer_eksternal.${index}.tipe_trainer`, 'eksternal');
        })
    }, [trainerEksternalFields])


    const watchFields = form.watch('trainer_eksternal');

    const isErrorArray = (errors: any): errors is FieldError[] => Array.isArray(errors);

    const allFieldsFilled = watchFields?.every((field: any, index: number) => {
        const errors = form.formState.errors.pic;
        const fieldError = isErrorArray(errors) ? errors[index] : errors;

        return (
            field.nama_trainer &&
            field.nama_pt &&
            field.no_hp &&
            field.materi &&
            !fieldError
        );
    });

    const stored = localStorage.getItem('form-event-data');

    useEffect(() => {
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.step4 && Array.isArray(parsed.step4.trainer_eksternal)) {
                const newTrainerEksternalLength = parsed.step4.trainer_eksternal.length;
                const currentTrainerEksternalLength = trainerEksternalFields.length;

                // Only append if the number of fields is less than the number of trainer_eksternal in the parsed data
                if (currentTrainerEksternalLength < newTrainerEksternalLength) {
                    const rowsToAdd = newTrainerEksternalLength - currentTrainerEksternalLength;
                    for (let i = 0; i < rowsToAdd; i++) {
                        appendTrainerEksternal({
                            no_urut: 0,
                            isNew: false,
                            nama_trainer: '',
                            nama_pt: '',
                            no_hp: '',
                            materi: '',
                        }, { shouldFocus: false });
                    }
                }

                parsed.step4.trainer_eksternal.forEach((item: any, i: number) => {
                    form.setValue(`trainer_eksternal.${i}.isNew`, item.isNew);
                    form.setValue(`trainer_eksternal.${i}.nama_trainer`, item.nama_trainer);
                    form.setValue(`trainer_eksternal.${i}.nama_pt`, item.nama_pt);
                    form.setValue(`trainer_eksternal.${i}.no_hp`, item.no_hp);
                    form.setValue(`trainer_eksternal.${i}.materi`, item.materi);
                });
            }
        }
    }, [stored]);

    return (
        <div className="flex flex-col gap-2">
            <TitlePage
                title="Trainer Eksternal"
                tag="h3"
                size="md"
                className="text-blue-pnm-2 font-semibold"
            />
            <div className='w-full flex flex-col gap-4 border border-gray-200 rounded-md overflow-clip'>
                <div className='grid grid-cols-[1.2fr_5fr_5fr_5fr_5fr_1.3fr] gap-4 text-sm font-semibold bg-bg-table border-b border-gray-200 py-3'>
                    <span className='text-center'>No.</span>
                    <span>Nama Trainer</span>
                    <span>Nama PT</span>
                    <span>No. Hp</span>
                    <span>Materi</span>
                    <span>Action</span>
                </div>
                {
                    trainerEksternalFields.map((data, index) => (
                        <div key={data.id} className='grid grid-cols-[1.2fr_5fr_5fr_5fr_5fr_1.3fr] gap-4'>
                            <span className='text-center text-sm font-semibold mt-2'>{index + 1}.</span>

                            {
                                form.watch(`trainer_eksternal.${index}.isNew`)
                                    ? <InputText
                                        qa={`trainer_eksternal.${index}.nama_trainer`}
                                        name={`trainer_eksternal.${index}.nama_trainer`}
                                        control={form.control}
                                        placeholder='Masukkan Nama Trainer'
                                    />
                                    : <InputCombobox
                                        control={form.control}
                                        name={`trainer_eksternal.${index}.nama_trainer`}
                                        qa={`trainer_eksternal.${index}.nama_trainer`}
                                        listData={listTrainer?.data || []}
                                        placeholder="Pilih nama PIC"
                                        renderLabel={(item: any) => `${item.nama} (${item.nip})`}
                                        compareFn={(item, value) => item?.nip === value?.nip}
                                        addNewItem
                                        addNewItemFn={() => form.setValue(`trainer_eksternal.${index}.isNew`, true)}
                                        loading={isLoadingTrainer}
                                        onInputChange={setSearchTrainer}
                                    />
                            }

                            <InputText
                                qa={`trainer_eksternal.${index}.nama_pt`}
                                name={`trainer_eksternal.${index}.nama_pt`}
                                control={form.control}
                                placeholder='Masukkan Materi'
                                disabled={!form.watch(`trainer_eksternal.${index}.isNew`)}
                            />
                            <InputText
                                qa={`trainer_eksternal.${index}.no_hp`}
                                name={`trainer_eksternal.${index}.no_hp`}
                                control={form.control}
                                placeholder='Masukkan Unit Kerja'
                                startAdorn="+62"
                                type="number"
                                disabled={!form.watch(`trainer_eksternal.${index}.isNew`)}
                            />
                            <InputText
                                qa={`trainer_eksternal.${index}.materi`}
                                name={`trainer_eksternal.${index}.materi`}
                                control={form.control}
                                placeholder='Masukkan Unit Kerja'
                            />

                            {
                                trainerEksternalFields.length > 1 && (
                                    <Button
                                        qa='button-delete-trainer-eksternal'
                                        type="button"
                                        variant='ghost'
                                        size='icon'
                                        className='flex items-center justify-center w-10 h-10 p-0 hover:bg-rose-50'
                                        onClick={() => removeTrainerEksternal(index)}
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
                        trainerEksternalFields.length < 10 && (
                            <Button
                                qa='button-add-trainer-eksternal'
                                variant='ghost'
                                type="button"
                                disabled={!allFieldsFilled}
                                onClick={() =>
                                    appendTrainerEksternal({
                                        no_urut: 0,
                                        isNew: false,
                                        nama_trainer: '',
                                        nama_pt: '',
                                        no_hp: '',
                                        materi: '',
                                    })
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
