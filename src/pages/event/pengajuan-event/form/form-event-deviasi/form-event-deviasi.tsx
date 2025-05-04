import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import LayoutPengajuanEvent from "../../../_layout/layout-pengajuan-event";
import InputCombobox from "@/components/input/input-combobox";

import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PiCreditCardFill } from "react-icons/pi";
import PdfViewer from "@/components/pdf-viewer";
import { schema } from "./schema";
import { useQuery } from "@tanstack/react-query";
import useDebouncedState from "@/hooks/use-debounce-state-search";
import { getDeviasiSearchFn } from "@/api/admin/api-deviasi";
import toast from "react-hot-toast";


interface FormEventDeviasiProps {
    nextStep: () => void;
    prevStep?: () => void;
    onComplete?: any;
    updateStatus?: any;
}
export default function FormEventDeviasi({
    nextStep,
    prevStep,
    onComplete,
    updateStatus
}: Readonly<FormEventDeviasiProps>) {

    const form = useForm({
        mode: 'onTouched',
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        const stored = localStorage.getItem('form-event-data');

        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.step2) {
                form.setValue('no_memo_deviasi', parsed.step2.no_memo_deviasi)
            }
        }
    }, []);

    // Fetch Data Field 
    const [searchDeviasi, setSearchDeviasi] = useDebouncedState(" ");

    const {
        data: listDeviasi = [],
        isLoading: isLoadingDeviasi,
        isError: isErrorDeviasi,
        error: errorDeviasi
    } = useQuery({
        queryKey: ["search-deviasi", searchDeviasi],
        queryFn: () => getDeviasiSearchFn(searchDeviasi),
        enabled: !!searchDeviasi,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (isErrorDeviasi) {
            toast.error(`Failed to fetch data akademi: ${(errorDeviasi as any)?.description || "Unknown error"}`);
        }
    }, [isErrorDeviasi]);


    const onSubmit = (data: any) => {
        onComplete(2, data || {});
        updateStatus(2, true)
        nextStep();
    };

    const pdfUrl = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';


    return (
        <LayoutPengajuanEvent
            title="Deviasi"
            prefix={<PiCreditCardFill className='text-3xl text-blue-pnm' />}

        >
            <Form {...form}>
                <form className="h-full flex flex-col justify-between gap-4 pt-4">
                    <div className="flex flex-col gap-3">
                        <InputCombobox
                            control={form.control}
                            name="no_memo_deviasi"
                            qa="no_memo_deviasi"
                            label="Nomor Memo Deviasi"
                            listData={listDeviasi?.data  || []}
                            placeholder="Pilih Nomor Memo Deviasi"
                            renderLabel={(item: any) => `${item.nomor_memo} - ${item.judul_pelatihan}`}
                            compareFn={(item, value) => item?.id_deviasi === value?.id_deviasi}
                            onInputChange={setSearchDeviasi}
                            loading={isLoadingDeviasi}
                        />

                        {
                            form.watch('no_memo_deviasi') && (
                                <PdfViewer pdfUrl={pdfUrl} />
                            )
                        }
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
