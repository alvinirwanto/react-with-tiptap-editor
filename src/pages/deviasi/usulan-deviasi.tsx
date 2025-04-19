import TitlePage from "@/components/title-page";
import LayoutPage from "@/layout/layout-page";
import Editor from "@/components/input/rich-text";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import InputText from "@/components/input/input-text";
import InputCombobox from "@/components/input/input-combobox";
import InputDate from "@/components/input/input-date";
import InputFile from "@/components/input/input-file";
import InputTextarea from "@/components/input/input-textarea";
import { Button } from "@/components/ui/button";
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaUsulanDeviasi } from "./schema";

export default function UsulanDeviasi() {

    const form = useForm({
        resolver: yupResolver(schemaUsulanDeviasi),
        mode: 'onTouched',
        defaultValues: {
            no_memo: '',
            kepada: '',
            kategori_akademi: '',
            kategori_pelatihan: '',
            sub_pelatihan: '',
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

    const dummyData = [
        {
            id: 1,
            name: 'Contoh 1',
            ket: 'Keterangan 1'
        },
        {
            id: 2,
            name: 'Contoh 2',
            ket: 'Keterangan 2'
        },
        {
            id: 3,
            name: 'Contoh 3',
            ket: 'Keterangan 3'
        }
    ]

    const onSubmit = async (data: any) => {
        console.log(data);
    }

    console.log(form.formState.errors);
    console.log('memo : ', form.watch('memo'));

    return (
        <LayoutPage
            childrenHead={
                <TitlePage title="Usulan Deviasi" />
            }
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="p-4 flex flex-col gap-4">
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
                            value="HCD"
                            disabled
                        />

                        <InputCombobox
                            control={form.control}
                            name="kategori_akademi"
                            qa="kategori_akademi"
                            label="Kategori Akademi"
                            listData={dummyData || []}
                            placeholder="Pilih Kategori Akademi"
                            renderLabel={(item: any) => item?.name}
                            compareFn={(item, value) => item?.id === value?.id}
                        />

                        <InputCombobox
                            control={form.control}
                            name="kategori_pelatihan"
                            qa="kategori_pelatihan"
                            label="Kategori Pelatihan"
                            listData={dummyData || []}
                            placeholder="Pilih Kategori Pelatihan"
                            renderLabel={(item: any) => item?.name}
                            compareFn={(item, value) => item?.id === value?.id}
                        />

                        <InputCombobox
                            control={form.control}
                            name="sub_pelatihan"
                            qa="sub_pelatihan"
                            label="Sub Pelatihan"
                            listData={dummyData || []}
                            placeholder="Pilih Sub Pelatihan"
                            renderLabel={(item: any) => item?.name}
                            compareFn={(item, value) => item?.id === value?.id}
                        />

                        <InputDate
                            control={form.control}
                            name="tanggal_pelaksanaan"
                            qa="tanggal_pelaksanaan"
                            label="Tanggal Pelaksanaan"
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

                        <InputText
                            control={form.control}
                            name="nominal_anggaran_saat_ini"
                            qa="nominal_anggaran_saat_ini"
                            label="Nominal Anggaran Saat Ini"
                            placeholder="Masukkan Nominal Anggaran Saat Ini"
                        />

                        <InputText
                            control={form.control}
                            name="anggaran_diusulkan"
                            qa="anggaran_diusulkan"
                            label="Nominal Anggaran Diusulkan"
                            placeholder="Masukkan Nominal Anggaran Diusulkan"
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
                            rows={10}
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
