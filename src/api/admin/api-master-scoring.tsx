import API from "@/lib/axios-client";

export const getScoringMutationFn = async (limit: number, page: number, search: string) => {
    const response = await API.get(`/master/scoring?limit=${limit}&page=${page}&search=${search}`)
    return response?.data || [];
}

export const getScoringDetailMutationFn = async (id: number) => {
    const response = await API.get(`/master/scoring/${id}`)
    return response?.data || [];
}

export const addScoringMutationFn = async (data: any) => {
    await API.post(`/master/scoring`, data)
}

export const editScoringMutationFn = async (data: any) => {
    await API.patch(`/master/scoring`, data)
}

export const updateStatusScoringMutationFn = async (id: number, status: number) => {
    await API.post(`/master/scoring-status?id=${id}&status=${status}`)
}