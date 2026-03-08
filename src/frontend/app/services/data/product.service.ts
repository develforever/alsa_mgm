
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractDataService } from '../data.service';
import { Product } from '../../../../shared/models/types';
import { ApiResponse } from '../../../../shared/api/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class DataProductService extends AbstractDataService {

  getProducts(): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/products`);
  }

  addProduct(product: Partial<Product>) {
    return this.http.post<ApiResponse<Product>>(`${this.apiUrl}/products`, product);
  }

  updateProduct(id: number, product: Partial<Product>) {
    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/products/${id}`, product);
  }

  deleteProduct(id: number) {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/products/${id}`);
  }
}