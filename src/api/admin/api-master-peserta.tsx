import API from "@/lib/axios-client";

export const getPesertaMutationFn = async (limit: number, page: number, search: string) => {
    const response = await API.get(`/master/peserta?limit=${limit}&page=${page}&search=${search}`)
    return response?.data || [];
}

export const addPesertaMutationFn = async (data: any) => {
    await API.post(`/master/peserta`, data)
}

export const getPesertaDetailMutationFn = async (id: number) => {
    const response = await API.get(`/master/peserta/${id}`)
    return response?.data || [];
}

export const editPesertaMutationFn = async (data: any) => {
    await API.patch(`/master/peserta`, data)
}

export const updateStatusPesertaMutationFn = async (id: number, status: number) => {
    await API.post(`/master/peserta-status?id=${id}&status=${status}`)
}

export const addImportPesertaMutationFn = async (data: any) => {
    await API.post(`/master/peserta-import`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
}