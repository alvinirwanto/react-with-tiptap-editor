import API from "@/lib/axios-client";

export const getUserSearchFn = async (query: string) => {
    const response = await API.get(`/master/karyawan-search?search=${query}`);
    return response?.data || [];
};

export const getLokasiSearchFn = async () => {
    const response = await API.get(`/master/lokasi`);
    return response?.data || [];
};

export const getRoleSearchFn = async () => {
    const response = await API.get(`/master/role`);
    return response?.data || [];
};

export const getNamaUjianSearchFn = async (query: string) => {
    const response = await API.get(`/master/nama-ujian?parent-ujian=${query}`);
    return response?.data || [];
};

export const getPerusahaanSearchFn = async () => {
    const response = await API.get(`/master/perusahaan`);
    return response?.data || [];
};

export const getUnitKerjaSearchFn = async (query: string) => {
    const response = await API.get(`/master/unit-kerja?search=${query}`);
    return response?.data || [];
};

export const getPosisiSearchFn = async (query: string) => {
    const response = await API.get(`/master/posisi?search=${query}`);
    return response?.data || [];
};

export const getKategoriUjianSearchFn = async () => {
    const response = await API.get(`/master/kategori-ujian`);
    return response?.data || [];
};

export const getParentUjianSearchFn = async () => {
    const response = await API.get(`/master/parent-ujian`);
    return response?.data || [];
};

export const getModelKepribadianSearchFn = async () => {
    const response = await API.get(`/master/model-test-kepribadian`);
    return response?.data || [];
};

export const getPesertaSearchFn = async (query: string) => {
    const response = await API.get(`/master/peserta?search=${query}`);
    return response?.data?.data || [];
};

export const getPesertaActiveSearchFn = async (query: string) => {
    const response = await API.get(`/master/peserta-search?search=${query}`);
    return response?.data?.data || [];
};

export const getTujuanUjianSearchFn = async () => {
    const response = await API.get(`/master/tujuan-ujian`);
    return response?.data || [];
};

export const getUjianListKategoriSearchFn = async () => {
    const response = await API.get(`/master/ujian-list-kategori`);
    return response?.data || [];
};