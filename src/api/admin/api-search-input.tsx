import API from "@/lib/axios-client";

export const getAkademiSearchFn = async (query: string) => {
    const response = await API.get(`/master/akademi?search=${query}`);
    return response?.data || [];
};

export const getBiayaAkomodasiKonsumsiSearchFn = async () => {
    const response = await API.get(`/master/biaya-akomodasi-konsumsi`);
    return response?.data || [];
};

export const getBiayaLainSearchFn = async () => {
    const response = await API.get(`/master/biaya-lain`);
    return response?.data || [];
};

export const getLokasiKerjaSearchFn = async (query: string) => {
    const response = await API.get(`/master/lokasi-kerja?search=${query}`);
    return response?.data || [];
};

export const getTipeTrainerSearchFn = async (query: string) => {
    const response = await API.get(`/master/tipe-trainer?search=${query}`);
    return response?.data || [];
};

export const getUnitSatuanSearchFn = async () => {
    const response = await API.get(`/master/unit-satuan`);
    return response?.data || [];
};

export const getNamaKaryawanSearchFn = async (query: string) => {
    const response = await API.get(`/master-user/karyawan-search?search=${query}`);
    return response?.data || [];
};

export const getKategoriPelatihanSearchFn = async (id_lokasi_kerja: string, query: string) => {
    const response = await API.get(`/master/${id_lokasi_kerja}/kategori-pelatihan?search=${query}`);
    return response?.data || [];
};

export const getSubKategoriPelatihanSearchFn = async (id_kategori: number, query: string) => {
    const response = await API.get(`/master/${id_kategori}/sub-kategori-pelatihan?search=${query}`);
    return response?.data || [];
};


export const getTrainerSearchFn = async (id_tipe_trainer: number, query: string) => {
    const response = await API.get(`/master/${id_tipe_trainer}/trainer?search=${query}`);
    return response?.data || [];
};