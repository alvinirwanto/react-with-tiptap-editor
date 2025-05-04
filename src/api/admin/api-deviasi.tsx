import API from "@/lib/axios-client";

export const getDeviasiSearchFn = async (query: string) => {
    const response = await API.get(`/event/deviasi-search?search=${query}`);
    return response?.data || [];
};

export const addDeviasiMutationFn = async (data: any) => {
    await API.post(`/event/deviasi`, data)
}

export const getDeviasiDetailMutationFn = async (id: number) => {
    const response = await API.get(`/event/deviasi/${id}`)
    return response?.data || [];
}