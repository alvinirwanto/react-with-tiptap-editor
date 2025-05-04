import * as yup from 'yup'

export const schema = yup.object().shape({
    unit_kerja: yup.string()
        .nullable()
        .notRequired()
        .default(null),
    divisi: yup.object()
        .required('Divisi harus diisi.')
        .typeError('Divisi harus diisi.'),
    akademi: yup.object()
        .required('Akademi harus diisi.')
        .typeError('Akademi harus diisi.'),
    kategori_pelatihan: yup.object()
        .required('Kategori Pelatihan harus diisi.')
        .typeError('Kategori Pelatihan harus diisi.'),
    sub_kategori_pelatihan: yup.object()
        .required('Sub Kategori Pelatihan harus diisi.')
        .typeError('Sub Kategori Pelatihan harus diisi.'),
    no_memo: yup.string()
        .required('Nomor Memo harus diisi.')
        .typeError('Nomor Memo harus diisi.'),
    judul_pelatihan: yup.string()
        .required('Judul Pelatihan harus diisi.')
        .typeError('Judul Pelatihan harus diisi.'),
    tanggal_pelaksanaan: yup
        .object({
            from: yup.date().nullable(),
            to: yup.date().nullable(),
        })
        .test(
            'both-required',
            'Tanggal Pelaksanaan harus diisi!',
            (value) => !!value?.from && !!value?.to
        )
        .required('Tanggal Pelaksanaan harus diisi!')
        .typeError('Tanggal Pelaksanaan harus diisi'),
    durasi_pembelajaran: yup.string()
        .required('Durasi Pembelajaran harus diisi.')
        .typeError('Durasi Pembelajaran harus diisi.'),
    tempat_pelaksanaan: yup.string()
        .required('Tempat Pelaksanaan harus diisi.')
        .typeError('Tempat Pelaksanaan harus diisi.'),
    target_peserta: yup.array()
        .of(
            yup.object().required('Target Peserta harus diisi!')
        )
        .required('Target Peserta harus diisi!')
        .min(1, 'Masukkan minimal 1 Target Peserta')
        .typeError('Target Peserta harus diisi.'),
    tujuan_pelatihan: yup.string()
        .required('Tujuan Pelatihan harus diisi.')
        .typeError('Tujuan Pelatihan harus diisi.'),
})