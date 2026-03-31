
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractDataService } from '../data.service';
import { AuditLog } from '../../../../shared/models/types';
import { ApiResponse } from '../../../../shared/api/ApiResponse';

export interface AuditLogFilter {
  entityName?: string;
  action?: string;
  userEmail?: string;
  dateFrom?: string;
  dateTo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataAuditService extends AbstractDataService {

  constructor() {
    super('/audit/logs');
  }

  getAuditLogs(page: number, size: number, filter?: AuditLogFilter): Observable<ApiResponse<AuditLog>> {
    const params: Record<string, string> = {
      page: page.toString(),
      size: size.toString(),
    };

    if (filter?.entityName) params['entityName'] = filter.entityName;
    if (filter?.action) params['action'] = filter.action;
    if (filter?.userEmail) params['userEmail'] = filter.userEmail;
    if (filter?.dateFrom) params['dateFrom'] = filter.dateFrom;
    if (filter?.dateTo) params['dateTo'] = filter.dateTo;

    return this.http.get<ApiResponse<AuditLog>>(`${this.getPath()}`, { params });
  }

  getEntityNames(): Observable<string[]> {
    return this.http.get<string[]>(`/api/audit/entities`);
  }

  getActions(): Observable<string[]> {
    return this.http.get<string[]>(`/api/audit/actions`);
  }
}