
export interface ApiResponseInfo {
    message: string;
}

export interface ApiResponseSingle<T> {
    data?: T;
    error?: ApiError;
}

export interface ApiResponseList<T> {
    data: T[];
    total: number;
    error?: ApiError;
}

export interface ApiError {
    message: string;
    code: number;
    stack?: string;
}


export type ApiResponse<T> = ApiResponseSingle<T> | ApiResponseList<T> | ApiResponseInfo | ApiError;
