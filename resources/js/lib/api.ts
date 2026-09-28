import { AxiosError, create, type AxiosRequestConfig } from 'axios';
import type { z } from 'zod';

/**
 * Cliente HTTP para endpoints JSON (los formularios/paginas usan Inertia, no esto).
 * Toda respuesta se valida con un schema zod: si el backend cambia, falla aqui y no en un componente.
 */
export const http = create({
    baseURL: '/',
    withCredentials: true,
    withXSRFToken: true,
    headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
});

export class ApiError extends Error {
    constructor(
        message: string,
        readonly status: number,
        readonly fieldErrors: Record<string, string[]> = {},
    ) {
        super(message);
    }
}

async function request<S extends z.ZodType>(config: AxiosRequestConfig, schema: S): Promise<z.infer<S>> {
    try {
        const response = await http.request(config);
        return schema.parse(response.data);
    } catch (error) {
        if (error instanceof AxiosError) {
            const body = error.response?.data as
                | { message?: string; errors?: Record<string, string[]> }
                | undefined;
            throw new ApiError(body?.message ?? error.message, error.response?.status ?? 0, body?.errors);
        }
        throw error;
    }
}

export const api = {
    get: <S extends z.ZodType>(url: string, schema: S, params?: Record<string, unknown>) =>
        request({ method: 'GET', url, params }, schema),
    post: <S extends z.ZodType>(url: string, schema: S, data?: unknown) =>
        request({ method: 'POST', url, data }, schema),
    put: <S extends z.ZodType>(url: string, schema: S, data?: unknown) =>
        request({ method: 'PUT', url, data }, schema),
    delete: <S extends z.ZodType>(url: string, schema: S) => request({ method: 'DELETE', url }, schema),
};
