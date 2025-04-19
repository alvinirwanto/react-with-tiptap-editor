import * as yup from 'yup'

const MAX_FILE_SIZE_20 = 20 * 1024 * 1024;

export const schemaUsulanDeviasi = yup.object().shape({
    no_memo: yup.string()
        .required('Nomor Memo harus diisi.')
        .typeError('Nomor Memo harus diisi.'),

    kepada: yup.string()
        .nullable()
        .notRequired()
        .default(null),

    kategori_akademi: yup.object()
        .required('Kategori Akademi harus diisi.')
        .typeError('Kategori Akademi harus diisi.'),

    kategori_pelatihan: yup.object()
        .required('Kategori Pelatihan harus diisi.')
        .typeError('Kategori Pelatihan harus diisi.'),

    sub_pelatihan: yup.object()
        .required('Sub Pelatihan harus diisi.')
        .typeError('Sub Pelatihan harus diisi.'),

    tanggal_pelaksanaan: yup.date()
        .required('Tanggal Pelaksanaan harus diisi.')
        .typeError('Tanggal Pelaksanaan harus diisi.'),

    tempat_pelaksanaan: yup.string()
        .required('Tempat Pelaksanaan harus diisi.')
        .typeError('Tempat Pelaksanaan harus diisi.'),

    judul_pelatihan: yup.string()
        .required('Judul Pelatihan harus diisi.')
        .typeError('Judul Pelatihan harus diisi.'),

    nominal_anggaran_saat_ini: yup.string()
        .required('Nominal Anggaran Saat Ini harus diisi.')
        .typeError('Nominal Anggaran Saat Ini harus diisi.'),

    anggaran_diusulkan: yup.string()
        .required('Anggaran Diusulkan harus diisi.')
        .typeError('Anggaran Diusulkan harus diisi.'),


    perihal: yup.string()
        .required('Perihal harus diisi.')
        .typeError('Perihal harus diisi.'),

    memo: yup
        .string()
        .transform((value) => {
            // Normalize default empty Tiptap content
            const cleaned = value?.replace(/<p[^>]*><\/p>/g, '').trim();
            return cleaned;
        })
        .test('not-empty', 'Memo harus diisi.', (value) => {
            return !!value && value.trim() !== '';
        })
        .required('Memo harus diisi.'),      

    upload_file: yup
        .mixed()
        .test("fileSize", "Ukuran maksimal file 20 MB!", (value: any) => {
            return value && value[0]?.size <= MAX_FILE_SIZE_20
        })
        .test("type", "Hanya support untuk file bertipe .pdf", (value: any) => {
            return value && value[0]?.type === 'application/pdf'
        }).required('File harus diisi!'),

    catatan: yup.string()
        .required('Catatan harus diisi.')
        .typeError('Catatan harus diisi.'),

})