import API from "@/lib/axios-client";

export const getSoalsMutationFn = async (limit: number, page: number, search: string) => {
    const response = await API.get(`/master/soal?limit=${limit}&page=${page}&search=${search}`)
    return response?.data || [];
}

export const getCreateSoalMutationFn = async () => {
    const response = await API.get(`/master/soal/get-create`)
    return response?.data || [];
}

export const updateStatusSoalMutationFn = async (id: number, status: number) => {
    await API.post(`/master/soal-status?id=${id}&status=${status}`)
}

export const addSoalMutationFn = async (data: any, onUploadProgress: (progressEvent: any) => void) => {
    await API.post(`/master/soal`, data, {
        onUploadProgress
    })
}

export const editSoalMutationFn = async (data: any) => {
    await API.patch(`/master/soal`, data)
}

export const getSoalDetailMutationFn = async (id: number) => {
    const response = await API.get(`/master/soal/${id}`)
    return response?.data || [];
}

export const getSoalExcelTemplateMutationFn = async (jenis_soal: string) => {
    const response = await API.get(`/master/soal-xls-template?jenis-soal=${jenis_soal}`, {
        responseType: 'blob' // Ensure response is a Blob
    });
    return response;
}

export const addImportSoalMutationFn = async (data: any) => {
    await API.post(`/master/soal-import`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
}