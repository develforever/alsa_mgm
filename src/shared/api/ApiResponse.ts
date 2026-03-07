

export interface ApiResponse<T> {
    data: T | T[];
    total: number;
}