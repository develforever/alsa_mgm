import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, ApiResponseSingle } from '../../../../shared/api/ApiResponse';
import { ProductionPlan, ProductionPlanStatus, ProductionPriority } from '../../../../shared/models/types';

export interface CreateProductionPlanRequest {
  productId: number;
  assemblyLineId: number;
  workstationIds?: number[];
  plannedStartDate: string;
  plannedEndDate: string;
  plannedQuantity: number;
  priority?: ProductionPriority;
  notes?: string;
}

export interface UpdateProductionPlanRequest {
  productId?: number;
  assemblyLineId?: number;
  workstationIds?: number[];
  plannedStartDate?: string;
  plannedEndDate?: string;
  plannedQuantity?: number;
  status?: ProductionPlanStatus;
  priority?: ProductionPriority;
  notes?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  actualQuantity?: number;
}

export interface ProductionPlanFilter {
  productId?: number;
  assemblyLineId?: number;
  status?: ProductionPlanStatus;
  startDateFrom?: string;
  startDateTo?: string;
}

export interface ProductionPlanStats {
  total: number;
  byStatus: {
    draft: number;
    scheduled: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
  upcoming: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductionPlanService {
  private http = inject(HttpClient);
  private apiUrl = '/api/production-plans';

  getProductionPlans(
    page = 0,
    size = 10,
    filter?: ProductionPlanFilter
  ): Observable<ApiResponse<ProductionPlan[]>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filter) {
      if (filter.productId) {
        params = params.set('productId', filter.productId.toString());
      }
      if (filter.assemblyLineId) {
        params = params.set('assemblyLineId', filter.assemblyLineId.toString());
      }
      if (filter.status) {
        params = params.set('status', filter.status);
      }
      if (filter.startDateFrom) {
        params = params.set('startDateFrom', filter.startDateFrom);
      }
      if (filter.startDateTo) {
        params = params.set('startDateTo', filter.startDateTo);
      }
    }

    return this.http.get<ApiResponse<ProductionPlan[]>>(this.apiUrl, { params });
  }

  getProductionPlan(id: number): Observable<ApiResponseSingle<ProductionPlan>> {
    return this.http.get<ApiResponseSingle<ProductionPlan>>(`${this.apiUrl}/${id}`);
  }

  createProductionPlan(request: CreateProductionPlanRequest): Observable<ApiResponseSingle<ProductionPlan>> {
    return this.http.post<ApiResponseSingle<ProductionPlan>>(this.apiUrl, request);
  }

  updateProductionPlan(
    id: number,
    request: UpdateProductionPlanRequest
  ): Observable<ApiResponseSingle<ProductionPlan>> {
    return this.http.put<ApiResponseSingle<ProductionPlan>>(`${this.apiUrl}/${id}`, request);
  }

  deleteProductionPlan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getPlansByDateRange(startDate: string, endDate: string): Observable<ApiResponse<ProductionPlan[]>> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<ApiResponse<ProductionPlan[]>>(`${this.apiUrl}/calendar/range`, { params });
  }

  getUpcomingPlans(limit = 10): Observable<ApiResponse<ProductionPlan[]>> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<ApiResponse<ProductionPlan[]>>(`${this.apiUrl}/upcoming/list`, { params });
  }

  getStats(): Observable<ApiResponse<ProductionPlanStats>> {
    return this.http.get<ApiResponse<ProductionPlanStats>>(`${this.apiUrl}/stats/overview`);
  }
}
