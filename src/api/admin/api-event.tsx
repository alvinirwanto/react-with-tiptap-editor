import API from "@/lib/axios-client";

export const addImportPesertaMutationFn = async (data: any) => {
    const response = await API.post(`/event/event/import-peserta`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    return response || [];
}