import useDialogSessionStore from '@/stores/session-store'
import useDialogUnauthorizedStore from '@/stores/unauthorized-store'
import axios, { InternalAxiosRequestConfig } from 'axios'


const token = localStorage.getItem("user-auth-pass");

const options = {
    baseURL: import.meta.env.VITE_PUBLIC_API,
    timeout: 10000,
    headers: {
        Authorization: `Bearer ${token}`,
    },
}

const API = axios.create(options)

API.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("user-auth-pass");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (!config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json'; 
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


API.interceptors.response.use((response) => {
    return response
},
    (error) => {
        const { data, status } = error.response

        if (status === 401) {
            const showDialog = useDialogUnauthorizedStore.getState().showDialogUnauthorized
            showDialog()
        } else if (status === 403) {
            const showDialog = useDialogSessionStore.getState().showDialog
            showDialog()
        }


        return Promise.reject({
            ...data
        })
    }
)

export default API;