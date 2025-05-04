import InputCombobox from "@/components/input/input-combobox";
import InputText from "@/components/input/input-text";
import TitlePage from "@/components/title-page";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { FieldError, useFieldArray, useFormContext } from "react-hook-form";
import { PiPlusSquareFill } from "react-icons/pi";

import { useQuery } from "@tanstack/react-query";
import { getNamaKaryawanSearchFn } from "@/api/admin/api-search-input";
import toast from "react-hot-toast";
import useDebouncedState from "@/hooks/use-debounce-state-search";

export default function FormPic() {

    const form = useFormContext();

    const {
        fields: picFields,
        append: appendPic,
        remove: removePic
    } = useFieldArray({
        control: form.control,
        name: 'pic',
    });


    useEffect(() => {
        const subscription = form.watch((value, { name, type }) => {
            if (type !== 'change') return;
            if (!name?.includes('nama_pic')) return;

            const match = /^pic\.(\d+)\.nama_pic$/.exec(name);
            if (!match) return;

            const index = Number(match[1]);
            const selectedPic = form.getValues(`pic.${index}.nama_pic`);
            const posisiValue = selectedPic?.posisi || '';

            form.setValue(`pic.${index}.posisi`, posisiValue || '');

            setTimeout(() => {
                form.trigger(`pic.${index}.posisi`);
                form.setValue(`pic.${index}.posisi`, posisiValue || '');
            }, 50);
        });

        return () => subscription.unsubscribe();
    }, [form]);

    useEffect(() => {
        picFields.forEach((item, index) => {
            form.setValue(`pic.${index}.no_urut`, index + 1);
        })
    }, [picFields])

    const watchFields = form.watch('pic');

    const isErrorArray = (errors: any): errors is FieldError[] => Array.isArray(errors);

    const allFieldsFilled = watchFields?.every((field: any, index: number) => {
        const errors = form.formState.errors.pic;
        const fieldError = isErrorArray(errors) ? errors[index] : errors;

        return (
            field.nama_pic &&
            field.posisi &&
            !fieldError
        );
    });

    // Fetch Data Field 
    const [searchKaryawan, setSearchKaryawan] = useDebouncedState("a");

    const { data: listKaryawan = [],
        isLoading: isLoadingKaryawan,
        isError: isErrorKaryawan,
        error: errorKaryawan
    } = useQuery({
        queryKey: ["search-user", searchKaryawan],
        queryFn: () => getNamaKaryawanSearchFn(searchKaryawan),
        enabled: !!searchKaryawan,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (isErrorKaryawan) {
            toast.error(`Failed to fetch data akademi: ${(errorKaryawan as any)?.description || "Unknown error"}`);
        }
    }, [isErrorKaryawan]);

    const stored = localStorage.getItem('form-event-data');

    useEffect(() => {
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.step4 && Array.isArray(parsed.step4.pic)) {
                const newPicLength = parsed.step4.pic.length;
                const currentPicLength = picFields.length;

                if (currentPicLength < newPicLength) {
                    const rowsToAdd = newPicLength - currentPicLength;
                    for (let i = 0; i < rowsToAdd; i++) {
                        appendPic({
                            no_urut: 0,
                            nama_pic: '',
                            posisi: ''
                        }, { shouldFocus: false });
                    }
                }

                parsed.step4.pic.forEach((item: any, i: number) => {
                    form.setValue(`pic.${i}.nama_pic`, item.nama_pic);
                    form.setValue(`pic.${i}.posisi`, item.posisi);
                });
            }
        }
    }, [stored]);

    return (
        <div className="flex flex-col gap-2">
            <TitlePage
                title="PIC / Panitia"
                tag="h3"
                size="md"
                className="text-blue-pnm-2 font-semibold"
            />
            <div className='w-full flex flex-col gap-4 border border-gray-200 rounded-md overflow-clip'>
                <div className='grid grid-cols-[.8fr_5fr_5fr_.8fr] gap-4 text-sm font-semibold bg-bg-table border-b border-gray-200 py-3'>
                    <span className='text-center'>No.</span>
                    <span>Nama PIC</span>
                    <span>Posisi</span>
                    <span>Action</span>
                </div>
                {
                    picFields.map((data, index) => (
                        <div key={data.id} className='grid grid-cols-[.8fr_5fr_5fr_.8fr] gap-4'>
                            <span className='text-center text-sm font-semibold mt-2'>{index + 1}.</span>
                            <InputCombobox
                                control={form.control}
                                name={`pic.${index}.nama_pic`}
                                qa={`pic.${index}.nama_pic`}
                                listData={listKaryawan?.data || []}
                                placeholder="Pilih nama PIC"
                                renderLabel={(item: any) => `${item.nama} (${item.nip})`}
                                compareFn={(item, value) => item?.nip === value?.nip}
                                loading={isLoadingKaryawan}
                                onInputChange={setSearchKaryawan}
                            />
                            <InputText
                                qa={`pic.${index}.posisi`}
                                name={`pic.${index}.posisi`}
                                control={form.control}
                                placeholder='Masukkan posisi'
                                disabled
                            />
                            {
                                picFields.length > 1 && (
                                    <Button
                                        qa='button-delete-scoring'
                                        type="button"
                                        variant='ghost'
                                        size='icon'
                                        className='flex items-center justify-center w-10 h-10 p-0 hover:bg-rose-50'
                                        onClick={() => removePic(index)}
                                    >
                                        <Trash2 className='text-rose-500 h-4 w-4' />
                                    </Button>
                                )
                            }
                        </div>
                    )
                    )
                }

                <div className='flex justify-end m-3'>
                    {
                        picFields.length < 10 && (
                            <Button
                                qa='button-add-pic'
                                variant='ghost'
                                type="button"
                                disabled={!allFieldsFilled}
                                onClick={() =>
                                    appendPic({
                                        no_urut: 0,
                                        nama_pic: '',
                                        posisi: '',
                                    })
                                }
                                className='w-[150px] flex items-center gap-2 rounded-md text-blue-pnm hover:text-blue-pnm hover:bg-blue-100'
                            >
                                <PiPlusSquareFill className='h-6 w-6 text-blue-pnm' />
                                <span>Tambah PIC</span>
                            </Button>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
