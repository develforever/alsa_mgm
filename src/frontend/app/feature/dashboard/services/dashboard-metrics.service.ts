import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardMetrics {
  products: {
    total: number;
    active: number;
    inactive: number;
  };
  assemblyLines: {
    total: number;
    active: number;
    locked: number;
    closed: number;
  };
  workstations: {
    total: number;
    autoStartEnabled: number;
  };
  allocations: {
    total: number;
  };
  recentActivity: {
    last24h: number;
    last7d: number;
    last30d: number;
  };
}

export interface AssemblyLineStatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface ProductAllocationSummary {
  productName: string;
  productId: number;
  lineCount: number;
  workstationCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardMetricsService {
  private http = inject(HttpClient);

  getMetrics(): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>('/api/dashboard/metrics');
  }

  getAssemblyLineStatusDistribution(): Observable<AssemblyLineStatusDistribution[]> {
    return this.http.get<AssemblyLineStatusDistribution[]>('/api/dashboard/lines/status-distribution');
  }

  getProductAllocationSummary(): Observable<ProductAllocationSummary[]> {
    return this.http.get<ProductAllocationSummary[]>('/api/dashboard/products/allocations');
  }
}
