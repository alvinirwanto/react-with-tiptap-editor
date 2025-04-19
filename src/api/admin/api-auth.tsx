import API from "@/lib/axios-client"

export const loginMutationFn = async (data: any) => {
    const response = await API.post(`/auth/login`, data);
    return response.data;
}

export const resetPasswordMutationFn = async (data: any) => {
    const response = await API.post(`/auth/reset-password`, data);
    return response.data;
}

export const changePasswordMutationFn = async (data: any) => {
    const response = await API.post(`/auth/change-password`, data);
    return response.data
}

export const getMenuModuleMutationFn = async () => {
    const response = await API.get(`/app/module`)
    return response?.data || [];
}