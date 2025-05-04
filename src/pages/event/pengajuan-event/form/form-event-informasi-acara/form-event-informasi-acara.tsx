import InputText from "@/components/input/input-text";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import LayoutPengajuanEvent from "../../../_layout/layout-pengajuan-event";
import dummyData from '../../../../../assets/dummyData.json'
import InputCombobox from "@/components/input/input-combobox";
import InputDateRange from "@/components/input/input-date-range";
import InputTextarea from "@/components/input/input-textarea";
import InputComboboxMultipleSelect from "@/components/input/input-combobox-multiselect";

import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { schema } from "./schema";
import useDebouncedState from "@/hooks/use-debounce-state-search";
import { useQuery } from "@tanstack/react-query";
import { getAkademiSearchFn, getKategoriPelatihanSearchFn, getSubKategoriPelatihanSearchFn } from "@/api/admin/api-search-input";
import toast from "react-hot-toast";


interface FormEventInformasiAcaraProps {
    nextStep: () => void;
    prevStep?: () => void;
    onComplete?: any;
    updateStatus?: any;
}
export default function FormEventInformasiAcara({
    nextStep,
    prevStep,
    onComplete,
    updateStatus
}: Readonly<FormEventInformasiAcaraProps>) {

    const [isReset, setIsReset] = useState(false)


    const form = useForm({
        mode: 'onTouched',
        resolver: yupResolver(schema),
        defaultValues: {
            unit_kerja: "Kantor Pusat"
        }
    });

    const stored = localStorage.getItem('form-event-data');

    useEffect(() => {
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.step1) {
                form.setValue('divisi', parsed.step1.divisi)
                form.setValue('akademi', parsed.step1.akademi)
                form.setValue('kategori_pelatihan', parsed.step1.kategori_pelatihan)
                form.setValue('sub_kategori_pelatihan', parsed.step1.sub_kategori_pelatihan)
                form.setValue('no_memo', parsed.step1.no_memo)
                form.setValue('judul_pelatihan', parsed.step1.judul_pelatihan)

                form.trigger('tanggal_pelaksanaan')
                form.setValue('tanggal_pelaksanaan', {
                    from: parsed.step1.tanggal_pelaksanaan.from,
                    to: parsed.step1.tanggal_pelaksanaan.to
                })

                form.setValue('durasi_pembelajaran', parsed.step1.durasi_pembelajaran)
                form.setValue('tempat_pelaksanaan', parsed.step1.tempat_pelaksanaan)
                form.setValue('target_peserta', parsed.step1.target_peserta)
                form.setValue('tujuan_pelatihan', parsed.step1.tujuan_pelatihan)
            }
        }
    }, []);


    // Fetch Data Field 
    const [searchAkademi, setSearchAkademi] = useDebouncedState(" ");

    const {
        data: listAkademi = [],
        isLoading: isLoadingAkademi,
        isError: isErrorAkademi,
        error: errorAkademi
    } = useQuery({
        queryKey: ["search-akademi", searchAkademi],
        queryFn: () => getAkademiSearchFn(searchAkademi),
        enabled: !!searchAkademi,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (isErrorAkademi) {
            toast.error(`Failed to fetch data akademi: ${(errorAkademi as any)?.description || "Unknown error"}`);
        }
    }, [isErrorAkademi]);


    const [searchKategoriPelatihan, setSearchKategoriPelatihan] = useDebouncedState("a")

    const {
        data: listKategoriPelatihan = [],
        isLoading: isLoadingKategoriPelatihan,
        isError: isErrorKategoriPelatihan,
        error: errorKategoriPelatihan
    } = useQuery({
        queryKey: ["search-akademi", searchKategoriPelatihan],
        queryFn: () => getKategoriPelatihanSearchFn('1', searchKategoriPelatihan),
        enabled: !!searchKategoriPelatihan,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (isErrorKategoriPelatihan) {
            toast.error(`Failed to fetch data akademi: ${(errorKategoriPelatihan as any)?.description || "Unknown error"}`);
        }
    }, [isErrorKategoriPelatihan]);


    const idKategori = (form.watch('kategori_pelatihan') as { id_kategori: number })?.id_kategori;

    useEffect(() => {
        if(!idKategori) {
            form.setValue('sub_kategori_pelatihan', [])
        }
    }, [idKategori])

    const [searchSubKategoriPelatihan, setSearchSubKategoriPelatihan] = useDebouncedState("")

    const {
        data: listSubKategoriPelatihan = [],
        isLoading: isLoadingSubKategoriPelatihan,
        isError: isErrorSubKategoriPelatihan,
        error: errorSubKategoriPelatihan
    } = useQuery({
        queryKey: ["search-akademi", searchSubKategoriPelatihan],
        queryFn: () => getSubKategoriPelatihanSearchFn(idKategori, searchSubKategoriPelatihan),
        enabled: !!idKategori,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (isErrorSubKategoriPelatihan) {
            toast.error(`Failed to fetch data akademi: ${(errorSubKategoriPelatihan as any)?.description || "Unknown error"}`);
        }
    }, [isErrorSubKategoriPelatihan]);

    const onSubmit = (data: any) => {
        onComplete(1, data);
        updateStatus(1, true)

        nextStep();
    };

    const normalizeDate = (date?: string | Date) => {
        if (!date) return undefined
        const d = new Date(date)
        d.setHours(0, 0, 0, 0)
        return d
    }


    return (
        <LayoutPengajuanEvent
            title="Informasi Acara"
        >
            <Form {...form}>
                <form className="h-full flex flex-col justify-between gap-4 pt-4">
                    <div className="flex flex-col gap-3">
                        <InputText
                            qa="unit_kerja"
                            name="unit_kerja"
                            label="Unit Kerja"
                            disabled
                            control={form.control}
                        />

                        <InputCombobox
                            control={form.control}
                            name="divisi"
                            qa="divisi"
                            label="Divisi"
                            listData={dummyData || []}
                            placeholder="Pilih Divisi"
                            renderLabel={(item: any) => item?.name}
                            compareFn={(item, value) => item?.id === value?.id}
                        />

                        <div className="grid grid-cols-3 gap-4">
                            <InputCombobox
                                control={form.control}
                                name="akademi"
                                qa="akademi"
                                label="Akademi"
                                listData={listAkademi?.data || []}
                                placeholder="Pilih Akademi"
                                renderLabel={(item: any) => item?.nama_akademi}
                                compareFn={(item, value) => item?.id_akademi === value?.id_akademi}
                                onInputChange={setSearchAkademi}
                                loading={isLoadingAkademi}
                            />

                            <InputCombobox
                                control={form.control}
                                name="kategori_pelatihan"
                                qa="kategori_pelatihan"
                                label="Kategori Pelatihan"
                                listData={listKategoriPelatihan?.data || []}
                                placeholder="Pilih Kategori Pelatihan"
                                renderLabel={(item: any) => item?.nama_kategori}
                                compareFn={(item, value) => item?.id_kategori === value?.id_kategori}
                                onInputChange={setSearchKategoriPelatihan}
                                loading={isLoadingKategoriPelatihan}
                            />

                            <InputCombobox
                                control={form.control}
                                name="sub_kategori_pelatihan"
                                qa="sub_kategori_pelatihan"
                                label="Sub Kategori Pelatihan"
                                listData={listSubKategoriPelatihan?.data || []}
                                placeholder="Pilih Sub Kategori Pelatihan"
                                renderLabel={(item: any) => item?.nama_sub_kategori}
                                compareFn={(item, value) => item?.id_sub_kategori === value?.id_sub_kategori}
                                onInputChange={setSearchSubKategoriPelatihan}
                                loading={isLoadingSubKategoriPelatihan}
                                disabled={!idKategori}
                            />
                        </div>

                        <InputText
                            control={form.control}
                            name="no_memo"
                            qa="no_memo"
                            label="Nomor Memo"
                            description="Contoh: X-999/PNM-XXX"
                            placeholder="Masukkan nomor memo"
                        />

                        <InputText
                            control={form.control}
                            name="judul_pelatihan"
                            qa="judul_pelatihan"
                            label="Judul Pelatihan"
                            placeholder="Masukkan Judul Pelatihan"
                        />

                        <div className="grid grid-cols-[2fr_1fr] gap-4">
                            <InputDateRange
                                control={form.control}
                                name="tanggal_pelaksanaan"
                                qa="tanggal_pelaksanaan"
                                label="Tanggal Pelaksanaan"
                                initialDateFrom={normalizeDate(stored ? JSON.parse(stored)?.step1?.tanggal_pelaksanaan?.from : undefined)}
                                initialDateTo={normalizeDate(stored ? JSON.parse(stored)?.step1?.tanggal_pelaksanaan?.to : undefined)}
                                disabledDate={(date) => {
                                    const today = new Date()
                                    today.setHours(0, 0, 0, 0)
                                    return date < today
                                }}
                                isReset={isReset}
                                setIsReset={setIsReset}
                            />


                            <InputText
                                control={form.control}
                                name="durasi_pembelajaran"
                                qa="durasi_pembelajaran"
                                label="Durasi Pembelajaran"
                                endAdorn="Jam"
                                type="number"
                                placeholder="Masukkan Durasi Pembelajaran"
                            />
                        </div>

                        <InputTextarea
                            control={form.control}
                            name="tempat_pelaksanaan"
                            qa="tempat_pelaksanaan"
                            label="Tempat Pelaksanaan"
                            placeholder="Jl. Sisingamangaraja No.1"
                            description="Isi dengan alamat lengkap (Nama Jalan, Desa, Kecamatan, Kabupaten/Kota, Provinsi)"
                            rows={7}
                        />

                        <InputComboboxMultipleSelect
                            control={form.control}
                            name="target_peserta"
                            qa="target_peserta"
                            label="Target / Sasaran Peserta"
                            placeholder="Pilih Target / Sasaran Peserta"
                            listData={dummyData}
                            renderLabel={(item: any) => item?.name}
                            compareFn={(item, value) => item?.id === value?.id}
                        />

                        <InputTextarea
                            control={form.control}
                            name="tujuan_pelatihan"
                            qa="tujuan_pelatihan"
                            label="Tujuan Pelatihan"
                            placeholder="Tulis tujuan pelatihan"
                            rows={7}
                        />
                    </div>

                    <div className="flex justify-end items-center gap-3 mt-10">
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
