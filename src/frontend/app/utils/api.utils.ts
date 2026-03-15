import { map, pipe } from 'rxjs';
import { ApiResponse } from '../../../shared/api/ApiResponse';

export function ensureArray<T>() {
    return pipe(
        map((response: ApiResponse<T>) => {
            if ('data' in response && response.data !== undefined) {
                return Array.isArray(response.data) ? response.data : [response.data as T];
            }
            return [] as T[];
        })
    );
}