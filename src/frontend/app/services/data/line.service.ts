
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractDataService } from '../data.service';
import { ALAssLine } from '../../../../shared/models/types';
import { ApiResponse } from '../../../../shared/api/ApiResponse';

@Injectable({
    providedIn: 'root'
})
export class DataLineService extends AbstractDataService {
    getLines(productId?: number): Observable<ApiResponse<ALAssLine>> {
        const url = productId ? `${this.apiUrl}/lines?productId=${productId}` : `${this.apiUrl}/lines`;
        return this.http.get<ApiResponse<ALAssLine>>(url);
    }

    addLine(line: Partial<ALAssLine>) {
        return this.http.post<ApiResponse<ALAssLine>>(`${this.apiUrl}/lines`, line);
    }

    updateLine(id: number, line: Partial<ALAssLine>) {
        return this.http.put<ApiResponse<ALAssLine>>(`${this.apiUrl}/lines/${id}`, line);
    }

    deleteLine(id: number) {
        return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/lines/${id}`);
    }
}