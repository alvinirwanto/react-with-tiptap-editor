import API from "@/lib/axios-client";

export const getUsersMutationFn = async (limit: number, page: number, search: string) => {
    const response = await API.get(`/master/user?limit=${limit}&page=${page}&search=${search}`)
    return response?.data || [];
}

export const getUserDetailMutationFn = async (id: number) => {
    const response = await API.get(`/master/user/${id}`)
    return response?.data || [];
}

export const addUsersMutationFn = async (data: any) => {
    await API.post(`/master/user`, data)
}

export const editUsersMutationFn = async (data: any) => {
    await API.patch(`/master/user`, data)
}

export const updateStatusUserMutationFn = async (id: number, status: number) => {
    await API.post(`/master/user-status?id=${id}&status=${status}`)
}