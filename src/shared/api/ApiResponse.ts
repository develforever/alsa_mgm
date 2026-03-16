
export interface ApiResponseInfo {
    message: string;
}

export interface ApiResponseSingle<T> {
    data?: T;
    error?: ApiError;
}

export interface ApiResponseList<T> {
    data: T[];
    error?: ApiError;
    meta?: ApiMeta;
}

export interface ApiError {
    message: string;
    code: number;
    stack?: string;
}

export interface ApiMeta {
    page: number
    limit: number
    total: number
    links?: {
        details?: string
    }
    entity?: {
        primaryKey: string
    }
}


export type ApiResponse<T> = ApiResponseSingle<T> | ApiResponseList<T> | ApiResponseInfo | ApiError;
