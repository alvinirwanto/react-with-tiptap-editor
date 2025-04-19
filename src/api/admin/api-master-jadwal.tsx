import API from "@/lib/axios-client";

export const getJadwalMutationFn = async (limit: number, page: number, search: string) => {
    const response = await API.get(`/master/jadwal?limit=${limit}&page=${page}&search=${search}`)
    return response?.data || [];
}

export const getJadwalDetailMutationFn = async (id: number) => {
    const response = await API.get(`/master/jadwal/${id}`)
    return response?.data || [];
}

export const getJadwalPesertaMutationFn = async (id: number, limit: number, page: number, search: string) => {
    const response = await API.get(`/master/jadwal-peserta/${id}?limit=${limit}&page=${page}&search=${search}`)
    return response?.data || [];
}

export const getJadwalPesertaDetailMutationFn = async (id: number) => {
    const response = await API.get(`/master/jadwal-peserta-detail/${id}`)
    return response?.data || [];
}

export const addJadwalMutationFn = async (data: any) => {
    await API.post(`/master/jadwal`, data)
}

export const editJadwalMutationFn = async (data: any) => {
    await API.patch(`/master/jadwal`, data)
}

export const updateStatusJadwalPesertaMutationFn = async (id: number, status: number) => {
    await API.post(`/master/jadwal-peserta-status/${id}?status=${status}`)
}
