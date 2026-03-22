
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractDataService } from '../data.service';
import { AuditLog } from '../../../../shared/models/types';
import { ApiResponse } from '../../../../shared/api/ApiResponse';


@Injectable({
  providedIn: 'root'
})
export class DataAuditService extends AbstractDataService {

  constructor() {
    super('/audit/logs');
  }

  getAuditLogs(page: number, size: number): Observable<ApiResponse<AuditLog>> {
    return this.http.get<ApiResponse<AuditLog>>(`${this.getPath()}`, {
      params: {
        page: page.toString(),
        size: size.toString(),
      },
    });
  }
}