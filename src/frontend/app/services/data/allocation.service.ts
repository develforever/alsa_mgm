
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractDataService } from '../data.service';
import { Allocation } from '../../../../shared/models/types';
import { ApiResponse } from '../../../../shared/api/ApiResponse';

@Injectable({
    providedIn: 'root'
})
export class DataAllocationService extends AbstractDataService {

    constructor() {
        super('/allocations');
    }

    getAllocations(): Observable<ApiResponse<Allocation>> {
        return this.http.get<ApiResponse<Allocation>>(`${this.getPath()}`);
    }


    allocateWorkstation(lineId: number, stationId: number): Observable<ApiResponse<Allocation>> {
        return this.http.post<ApiResponse<Allocation>>(`${this.getPath()}`, {
            ALAssLineID: lineId,
            ALWStationID: stationId
        });
    }

    removeAllocations(ids: number[]): Observable<ApiResponse<any>> {

        return this.http.delete<ApiResponse<any>>(`${this.getPath()}`, {
            params: {
                ids: ids.join(",")
            }
        });
    }
}