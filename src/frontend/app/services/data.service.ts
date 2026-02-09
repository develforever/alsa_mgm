// frontend/src/app/services/data.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ALAssLine, ALWStation, Allocation } from '../models/types';

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

  // --- LINIE MONTAŻOWE ---
  getLines(productId?: number): Observable<ALAssLine[]> {
    const url = productId ? `${this.apiUrl}/lines?productId=${productId}` : `${this.apiUrl}/lines`;
    return this.http.get<ALAssLine[]>(url);
  }

  // --- STACJE ROBOCZE ---
  getWorkstations(): Observable<ALWStation[]> {
    return this.http.get<ALWStation[]>(`${this.apiUrl}/workstations`);
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
}