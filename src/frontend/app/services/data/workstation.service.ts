
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractDataService } from '../data.service';
import { ALWStation } from '../../../../shared/models/types';
import { ApiResponse, ApiResponseList } from '../../../../shared/api/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class DataWorkstationService extends AbstractDataService {

  constructor() {
    super('/workstations');
  }

  getWorkstations(): Observable<ApiResponseList<ALWStation>> {
    return this.http.get<ApiResponseList<ALWStation>>(`${this.getPath()}`);
  }

  addWorkstation(station: Partial<ALWStation>) {
    return this.http.post<ApiResponse<ALWStation>>(`${this.getPath()}`, station);
  }

  updateWorkstation(id: number, station: Partial<ALWStation>) {
    return this.http.put<ApiResponse<ALWStation>>(`${this.getPathById(id)}`, station);
  }

  deleteWorkstation(id: number) {
    return this.http.delete<ApiResponse<any>>(`${this.getPathById(id)}`);
  }
}