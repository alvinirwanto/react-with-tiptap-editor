import API from "@/lib/axios-client";

export const getUjianMutationFn = async (limit: number, page: number, search: string) => {
    const response = await API.get(`/master/ujian?limit=${limit}&page=${page}&search=${search}`)
    return response?.data || [];
}

export const addUjianMutationFn = async (data: any) => {
    await API.post(`/master/ujian`, data)
}

export const getUjianDetailMutationFn = async (id: number) => {
    const response = await API.get(`/master/ujian/${id}`)
    return response?.data || [];
}

export const editUjianMutationFn = async (data: any) => {
    await API.patch(`/master/ujian`, data)
}

export const updateStatusUjianMutationFn = async (id: number, status: number) => {
    await API.post(`/master/ujian-status?id=${id}&status=${status}`)
}

export const addImportUjianMutationFn = async (data: any) => {
    await API.post(`/master/ujian-import`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
}