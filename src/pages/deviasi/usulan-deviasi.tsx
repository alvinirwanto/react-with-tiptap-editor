import TitlePage from "@/components/title-page";
import LayoutPage from "@/layout/layout-page";
import Editor from "@/components/input/rich-text";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import InputText from "@/components/input/input-text";
import InputCombobox from "@/components/input/input-combobox";
import InputFile from "@/components/input/input-file";
import InputTextarea from "@/components/input/input-textarea";
import { Button } from "@/components/ui/button";
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaUsulanDeviasi } from "./schema";

import InputNumber from "@/components/input/input-number";

import InputDateRange from "@/components/input/input-date-range";
import ConvertToBase64 from "@/lib/convert-to-base64";
import { format } from "date-fns";
import useDebouncedState from "@/hooks/use-debounce-state-search";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { getAkademiSearchFn, getKategoriPelatihanSearchFn, getSubKategoriPelatihanSearchFn } from "@/api/admin/api-search-input";

export default function UsulanDeviasi() {

    const form = useForm({
        resolver: yupResolver(schemaUsulanDeviasi),
        mode: 'onTouched',
        defaultValues: {
            no_memo: '',
            kepada: 'HCD',
            kategori_akademi: '',
            kategori_pelatihan: '',
            sub_kategori_pelatihan: '',
            tanggal_pelaksanaan: undefined,
            tempat_pelaksanaan: '',
            judul_pelatihan: '',
            nominal_anggaran_saat_ini: '',
            anggaran_diusulkan: '',
            perihal: '',
            memo: '',
            upload_file: '',
            catatan: '',
        }

    });

    // Fetch Data Field 
    const [searchKategoriAkademi, setSearchKategoriAkademi] = useDebouncedState(" ");

    const { data: listKategoriAkademi = [],
        isLoading: isLoadingKategoriAkademi,
        isError: isErrorKategoriAkademi,
        error: errorKategoriAkademi
    } = useQuery({
        queryKey: ["search-kategori-akademi", searchKategoriAkademi],
        queryFn: () => getAkademiSearchFn(searchKategoriAkademi),
        enabled: !!searchKategoriAkademi,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (isErrorKategoriAkademi) {
            toast.error(`Failed to fetch data trainer: ${(errorKategoriAkademi as any)?.description || "Unknown error"}`);
        }
    }, [isErrorKategoriAkademi]);


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
        if (!idKategori) {
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


    const onSubmit = async (data: any) => {
        // kategori_akademi
        // kategori_pelatihan
        // sub_pelatihan
        // tempat_pelaksanaan

        const dataSend = {
            anggaran_awal: Number(data.nominal_anggaran_saat_ini),
            anggaran_usulan: Number(data.anggaran_diusulkan),
            catatan: data.catatan,
            file: await ConvertToBase64(data.upload_file[0]),
            id_akademi: 0,
            id_deviasi: 0,
            id_kategori: 0,
            id_sub_kategori: 0,
            id_unit_kerja_dari: 0,
            id_unit_kerja_tujuan: 0,
            isi_memo: data.memo,
            judul_pelatihan: data.judul_pelatihan,
            nomor_memo: data.no_memo,
            perihal: data.perihal,
            tanggal_end: format(data.tanggal_pelaksanaan.to, 'yyyy-MM-dd'),
            tanggal_mulai: format(data.tanggal_pelaksanaan.from, 'yyyy-MM-dd')
        }

        console.log(dataSend);
    }

    return (
        <LayoutPage
            childrenHead={
                <TitlePage title="Usulan Deviasi" />
            }
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="p-2 flex flex-col gap-3">
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
                            name="kepada"
                            qa="kepada"
                            label="Kepada"
                            disabled
                        />

                        <InputCombobox
                            control={form.control}
                            name="kategori_akademi"
                            qa="kategori_akademi"
                            label="Kategori Akademi"
                            listData={listKategoriAkademi?.data || []}
                            placeholder="Pilih Kategori Akademi"
                            renderLabel={(item: any) => item.nama_akademi}
                            compareFn={(item, value) => item?.id_akademi === value?.id_akademi}
                            loading={isLoadingKategoriAkademi}
                            onInputChange={setSearchKategoriAkademi}
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

                        <InputDateRange
                            control={form.control}
                            name="tanggal_pelaksanaan"
                            qa="tanggal_pelaksanaan"
                            label="Rentang Tanggal Pelaksanaan"
                            initialDateFrom={undefined}
                            disabledDate={(date) => {
                                const today = new Date()
                                today.setHours(0, 0, 0, 0)
                                return date < today
                            }}
                        />

                        <InputText
                            control={form.control}
                            name="tempat_pelaksanaan"
                            qa="tempat_pelaksanaan"
                            label="Tempat Pelaksanaan"
                            placeholder="Masukkan Tempat Pelaksanaan"
                        />

                        <InputText
                            control={form.control}
                            name="judul_pelatihan"
                            qa="judul_pelatihan"
                            label="Judul Pelatihan"
                            placeholder="Masukkan Judul Pelatihan"
                        />

                        <InputNumber
                            control={form.control}
                            name="nominal_anggaran_saat_ini"
                            qa="nominal_anggaran_saat_ini"
                            label="Nominal Anggaran Saat Ini"
                            placeholder="Masukkan Nominal Anggaran Saat Ini"
                            value={0}
                            prefix="Rp "
                            thousandSeparator="."
                            decimalSeparator=","
                        />

                        <InputNumber
                            control={form.control}
                            name="anggaran_diusulkan"
                            qa="anggaran_diusulkan"
                            label="Nominal Anggaran Diusulkan"
                            placeholder="Masukkan Nominal Anggaran Diusulkan"
                            value={0}
                            prefix="Rp "
                            thousandSeparator="."
                            decimalSeparator=","
                        />

                        <InputText
                            control={form.control}
                            name="perihal"
                            qa="perihal"
                            label="Perihal"
                            placeholder="Masukkan Nominal Perihal"
                        />

                        <FormField
                            control={form.control}
                            name="memo"
                            render={({ field, fieldState }) => (
                                <FormItem className="flex flex-col space-y-1">
                                    <FormLabel>Memo</FormLabel>
                                    <FormControl>
                                        <Editor
                                            value={field.value}
                                            fieldState={fieldState}
                                            onChange={(val) => {
                                                field.onChange(val)              // update value
                                                form.setValue('memo', val)       // ensure RHF tracks it
                                                // form.trigger('memo')             // trigger validation
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <InputFile
                            control={form.control}
                            name="upload_file"
                            qa="upload_file"
                            label="Upload File"
                            info="File pdf dan maksimal 20 MB"
                            fileType=".pdf"
                        />

                        <InputTextarea
                            control={form.control}
                            name="catatan"
                            qa="catatan"
                            label="Catatan"
                            rows={7}
                        />

                        <div className="flex justify-end items-center space-x-3 mt-10">
                            <Button
                                qa="button-kembali"
                                variant='secondary'
                                size='lg'
                                type="button"
                                className="w-[170px] text-blue-pnm"
                            >
                                Kembali
                            </Button>
                            <Button
                                qa="button-lanjutkan"
                                variant='primary'
                                size='lg'
                                type="submit"
                                className="w-[170px]"
                            >
                                Lanjutkan
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </LayoutPage>
    )
}
