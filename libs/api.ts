import axios, {AxiosRequestConfig} from 'axios';

type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export async function api(url: string, method: ApiMethod, options?: AxiosRequestConfig) {
    return axios({
        url: `http://localhost:3000${url}`,
        method: method,
        ...options,
        headers: {
            ...options?.headers,
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.data)
        .catch((error) => {
            console.error('API Error:', error);
            throw error;
        });

}