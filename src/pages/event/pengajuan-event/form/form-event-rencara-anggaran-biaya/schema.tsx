import * as yup from 'yup';

export const schema = yup.object({
    trainer: yup.array().of(
        yup.object({
            no_urut: yup
                .number()
                .nullable()
                .notRequired(),
            trainer: yup
                .string()
                .required('Trainer harus diisi.')
                .typeError('Trainer harus diisi.'),

            jumlah: yup
                .number()
                .required('Jumlah harus diisi.')
                .typeError('Jumlah harus diisi.')
                .min(1, 'Jumlah minimal 1'),

            unit: yup
                .object()
                .required('Unit harus diisi.')
                .typeError('Unit harus diisi.'),

            frekuensi: yup
                .number()
                .required('Frekuensi harus diisi.')
                .typeError('Frekuensi harus diisi.')
                .min(1, 'Frekuensi minimal 1'),

            satuan: yup
                .object()
                .required('Satuan harus diisi.')
                .typeError('Satuan harus diisi.'),

            unit_cost: yup
                .string()
                .required('Unit cost harus diisi.')
                .typeError('Unit cost harus diisi.'),

            total_cost: yup
                .string()
                .required('Total cost harus diisi.')
                .typeError('Total cost harus diisi.'),
            tipe_trainer: yup
                .string()
                .nullable()
                .notRequired()
        })
    ),

    akomodasi_konsumsi: yup.array().of(
        yup.object({
            no_urut: yup
                .number()
                .nullable()
                .notRequired(),
            jenis: yup
                .object()
                .required('Jenis akomodasi harus diisi.')
                .typeError('Jenis akomodasi harus diisi.'),

            jumlah: yup
                .number()
                .required('Jumlah harus diisi.')
                .typeError('Jumlah harus diisi.')
                .min(1, 'Jumlah minimal 1'),

            unit: yup
                .object()
                .required('Unit harus diisi.')
                .typeError('Unit harus diisi.'),

            frekuensi: yup
                .number()
                .required('Frekuensi harus diisi.')
                .typeError('Frekuensi harus diisi.')
                .min(1, 'Frekuensi minimal 1'),

            satuan: yup
                .object()
                .required('Satuan harus diisi.')
                .typeError('Satuan harus diisi.'),

            unit_cost: yup
                .string()
                .required('Unit cost harus diisi.')
                .typeError('Unit cost harus diisi.'),

            total_cost: yup
                .string()
                .required('Total cost harus diisi.')
                .typeError('Total cost harus diisi.')
        })
    ),

    biaya_lain: yup.array().of(
        yup.object({
            no_urut: yup
                .number()
                .nullable()
                .notRequired(),
            deskripsi: yup
                .object()
                .required('Deskripsi harus diisi.')
                .typeError('Deskripsi harus diisi.'),

            jumlah: yup
                .number()
                .required('Jumlah harus diisi.')
                .typeError('Jumlah harus diisi.')
                .min(1, 'Jumlah minimal 1'),

            unit: yup
                .object()
                .required('Unit harus diisi.')
                .typeError('Unit harus diisi.'),

            frekuensi: yup
                .number()
                .required('Frekuensi harus diisi.')
                .typeError('Frekuensi harus diisi.')
                .min(1, 'Frekuensi minimal 1'),

            satuan: yup
                .object()
                .required('Satuan harus diisi.')
                .typeError('Satuan harus diisi.'),

            unit_cost: yup
                .string()
                .required('Unit cost harus diisi.')
                .typeError('Unit cost harus diisi.'),

            total_cost: yup
                .string()
                .required('Total cost harus diisi.')
                .typeError('Total cost harus diisi.')
        })
    ),
    sub_total_trainer: yup
        .string()
        .required(),
    sub_total_akomodasi_konsumsi: yup
        .string()
        .required(),
    sub_total_biaya_lain: yup
        .string()
        .required(),
});
