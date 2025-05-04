import * as yup from 'yup';

const MAX_FILE_SIZE_20 = 20 * 1024 * 1024;

export const schema = yup.object().shape({
    nama_materi: yup.string()
        .required('Nama Materi harus diisi.')
        .typeError('Nama Materi harus diisi.'),
    file_materi: yup
        .mixed()
        .test("fileSize", "Ukuran maksimal file 20 MB!", (value: any) => {
            return value && value[0]?.size <= MAX_FILE_SIZE_20
        })
        .test("type", "Hanya support untuk file bertipe .pdf", (value: any) => {
            return value && value[0]?.type === 'application/pdf'
        }).required('File harus diisi!'),
    nama_test: yup.string()
        .required('Nama Materi harus diisi.')
        .typeError('Nama Materi harus diisi.'),
    file_test: yup
        .mixed()
        .test("fileSize", "Ukuran maksimal file 20 MB!", (value: any) => {
            return value && value[0]?.size <= MAX_FILE_SIZE_20
        })
        .test("type", "Hanya support untuk file bertipe .pdf", (value: any) => {
            return value && value[0]?.type === 'application/pdf'
        }).required('File harus diisi!'),
})
