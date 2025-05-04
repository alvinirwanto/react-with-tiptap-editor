import * as yup from 'yup';

export const schema = yup.object({
    rundown: yup.array().of(
        yup.object({
            no_urut: yup
                .number()
                .nullable()
                .notRequired(),
            tanggal: yup.date()
                .test('required-or-undefined', 'Tanggal harus diisi.', (value: any) => value === undefined || value === null || !isNaN(Date.parse(value)))
                .typeError('Tanggal harus diisi.'),
            waktu: yup
                .string()
                .required('Waktu harus diisi.')
                .typeError('Waktu harus diisi.'),
            pic: yup
                .string()
                .required('PIC harus diisi.')
                .typeError('PIC harus diisi.'),
            nama_kegiatan: yup
                .string()
                .required('Nama Kegiatan harus diisi.')
                .typeError('Nama Kegiatan harus diisi.'),
            keterangan: yup
                .string()
                .required('Keterangan harus diisi.')
                .typeError('Keterangan harus diisi.')
        })
    )
});
