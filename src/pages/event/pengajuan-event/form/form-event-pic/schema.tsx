import * as yup from 'yup';

export const schema = yup.object({
    pic: yup.array().of(
        yup.object({
            no_urut: yup
                .number()
                .nullable()
                .notRequired(),
            nama_pic: yup
                .object()
                .required('Nama PIC harus diisi.')
                .typeError('Nama PIC harus diisi.'),
            posisi: yup
                .string()
                .required('Posisi harus diisi.')
                .typeError('Posisi harus diisi.')
        })
    ),
    trainer_internal: yup.array().of(
        yup.object({
            no_urut: yup
                .number()
                .nullable()
                .notRequired(),
            nama_trainer: yup
                .object()
                .required('Nama Trainer harus diisi.')
                .typeError('Nama Trainer harus diisi.'),
            materi: yup
                .string()
                .required('Materi harus diisi.')
                .typeError('Materi harus diisi.'),
            unit_kerja: yup
                .string()
                .required('Unit Kerja harus diisi.')
                .typeError('Unit Kerja harus diisi.'),
            tipe_trainer: yup
                .string()
                .nullable()
                .notRequired(),
        })
    ),
    trainer_eksternal: yup.array().of(
        yup.object({
            no_urut: yup
                .number()
                .nullable()
                .notRequired(),
            isNew: yup
                .boolean()
                .nullable()
                .notRequired(),
            nama_trainer: yup
                .mixed()
                .test('is-string-or-object', 'Nama Trainer harus diisi.', (value, context) => {
                    const { isNew } = context.parent; // Access isNew from the same object
                    if (isNew) {
                        return yup.string().required('Nama Trainer harus diisi.').isValidSync(value);
                    } else {
                        return yup.object().required('Nama Trainer harus diisi.').isValidSync(value);
                    }
                }),
            nama_pt: yup
                .string()
                .required('Nama PT harus diisi.')
                .typeError('Nama PT harus diisi.'),
            no_hp: yup
                .string()
                .required('Nomor handphone harus diisi!')
                .min(9, 'Masukkan nomor handphone yang valid!')
                .max(15, 'Masukkan nomor handphone yang valid!')
                .matches(/^8\d{0,14}$/, 'Nomor handphone harus dimulai dengan angka 8 dan maksimal 15 karakter!')
                .typeError('Nomor handphone harus diisi!'),
            materi: yup
                .string()
                .required('Materi harus diisi.')
                .typeError('Materi harus diisi.'),
            tipe_trainer: yup
                .string()
                .nullable()
                .notRequired(),
        })
    )
});
