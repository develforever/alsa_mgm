
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractDataService } from '../data.service';
import { Allocation } from '../../../../shared/models/types';
import { ApiResponse } from '../../../../shared/api/ApiResponse';

@Injectable({
    providedIn: 'root'
})
export class DataAllocationService extends AbstractDataService {


    getAllocations(): Observable<ApiResponse<Allocation>> {
        return this.http.get<ApiResponse<Allocation>>(`${this.apiUrl}/allocations`);
    }


    allocateWorkstation(lineId: number, stationId: number): Observable<ApiResponse<Allocation>> {
        return this.http.post<ApiResponse<Allocation>>(`${this.apiUrl}/allocations`, {
            ALAssLineID: lineId,
            ALWStationID: stationId
        });
    }

    removeAllocations(ids: number[]): Observable<ApiResponse<any>> {

        return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/allocations`, {
            params: {
                ids: ids.join(",")
            }
        });
    }
}