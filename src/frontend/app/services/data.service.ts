// frontend/src/app/services/data.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ALAssLine, ALWStation, Allocation, AuditLog } from '../models/types';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient);
  private apiUrl = '/api'; // Dzięki proxy.conf.json trafia do Expressa (port 3000)

  // --- PRODUKTY ---
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  addProduct(product: Partial<Product>) {
    return this.http.post<Product>(`${this.apiUrl}/products`, product);
  }

  updateProduct(id: number, product: Partial<Product>) {
    return this.http.put(`${this.apiUrl}/products/${id}`, product);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.apiUrl}/products/${id}`);
  }

  // --- LINIE MONTAŻOWE ---
  getLines(productId?: number): Observable<ALAssLine[]> {
    const url = productId ? `${this.apiUrl}/lines?productId=${productId}` : `${this.apiUrl}/lines`;
    return this.http.get<ALAssLine[]>(url);
  }

  addLine(line: Partial<ALAssLine>) {
    return this.http.post<ALAssLine>(`${this.apiUrl}/lines`, line);
  }

  updateLine(id: number, line: Partial<ALAssLine>) {
    return this.http.put(`${this.apiUrl}/lines/${id}`, line);
  }

  deleteLine(id: number) {
    return this.http.delete(`${this.apiUrl}/lines/${id}`);
  }

  // --- STACJE ROBOCZE ---
  getWorkstations(): Observable<ALWStation[]> {
    return this.http.get<ALWStation[]>(`${this.apiUrl}/workstations`);
  }

  addWorkstation(station: Partial<ALWStation>) {
    return this.http.post<ALWStation>(`${this.apiUrl}/workstations`, station);
  }

  updateWorkstation(id: number, station: Partial<ALWStation>) {
    return this.http.put(`${this.apiUrl}/workstations/${id}`, station);
  }

  deleteWorkstation(id: number) {
    return this.http.delete(`${this.apiUrl}/workstations/${id}`);
  }

  // --- ALOKACJE (PUNKT 8 i 10) ---
  getAllocations(): Observable<Allocation[]> {
    return this.http.get<Allocation[]>(`${this.apiUrl}/allocations`);
  }

  // Punkt 9: Dodawanie alokacji (Sort obliczy backend)
  allocateWorkstation(lineId: number, stationId: number): Observable<Allocation> {
    return this.http.post<Allocation>(`${this.apiUrl}/allocations`, {
      ALAssLineID: lineId,
      ALWStationID: stationId
    });
  }

  // Punkt 10: Masowe usuwanie
  removeAllocations(ids: number[]): Observable<any> {
    // Wiele sposobów na DELETE z body, najbezpieczniejszy to POST na dedykowany endpoint
    return this.http.post(`${this.apiUrl}/allocations/delete-multiple`, { ids });
  }

  getAuditLogs() {
    return this.http.get<AuditLog[]>('/api/audit-logs');
  }
}