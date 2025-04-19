export interface DataProps {
    peserta: any;
    id_peserta: number;
    tanggal_lahir: string;
}

export interface Karyawan {
    idsdm?: string,
    nama?: string,
    nip?: string
}

export const listStatus = [
    {
        name: 'All',
        value: ''
    },
    {
        name: 'Aktif',
        value: '1'
    },
    {
        name: 'Nonaktif',
        value: '0'
    }
]