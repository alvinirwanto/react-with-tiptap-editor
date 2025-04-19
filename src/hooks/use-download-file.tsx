import API from "@/lib/axios-client";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useDownloadFile = (options?: { customError?: string }) => {
    const { customError = "File download failed" } = options || {};

    return useMutation({
        mutationFn: async ({ url, fileName }: { url: string; fileName: string }) => {
            const response = await API.get(url, { responseType: "blob" });
            return { blob: response.data, fileName };
        },
        onError: (error) => {
            toast.error(`${(error as any)?.description || customError}`);
        },
        onSuccess: ({ blob, fileName }) => {
            downloadBlobFile(blob, fileName);
        }
    });
};


const downloadBlobFile = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};

