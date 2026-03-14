
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractDataService } from '../data.service';
import { ApiResponse, ApiResponseInfo } from '../../../../shared/api/ApiResponse';
import { HttpParams } from '@angular/common/http';
import { GetProductsSchema, PatchProductsSchema } from '../../../../shared/api/product/schema';

@Injectable({
  providedIn: 'root'
})
export class DataProductService extends AbstractDataService {

  getProducts(page?: number, size?: number): Observable<ApiResponse<GetProductsSchema>> {
    let params = new HttpParams()

    if (page) {
      params = params.set('page', page.toString());
    }

    if (size) {
      params = params.set('size', size.toString());
    }

    return this.http.get<ApiResponse<GetProductsSchema>>(`${this.apiUrl}/products`, {
      params,
    });
  }

  addProduct(product: Partial<GetProductsSchema>) {
    return this.http.post<ApiResponse<GetProductsSchema>>(`${this.apiUrl}/products`, product);
  }

  updateProduct(id: number, product: PatchProductsSchema) {
    return this.http.patch<ApiResponse<GetProductsSchema>>(`${this.apiUrl}/products/${id}`, product);
  }

  deleteProduct(id: number) {
    return this.http.delete<ApiResponse<ApiResponseInfo>>(`${this.apiUrl}/products/${id}`);
  }
}