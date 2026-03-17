
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractDataService } from '../data.service';
import { ApiResponse, ApiResponseInfo, ApiResponseSingle } from '../../../../shared/api/ApiResponse';
import { HttpParams } from '@angular/common/http';
import { GetProductSchema, GetProductsSchema, PatchProductsSchema, PostProductsSchema } from '../../../../shared/api/product/schema';
import { ITableDataRowAddNavigationData, ITableDataService } from '../../ui/data/layout/smart-list-layout.component';
import { ITableDataRowClickNavigationData } from '../../ui/data/layout/smart-list-layout.component';

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

  getProduct(id: number): Observable<ApiResponseSingle<GetProductSchema>> {
    return this.http.get<ApiResponseSingle<GetProductSchema>>(`${this.apiUrl}/products/${id}`);
  }

  addProduct(product: PostProductsSchema) {
    return this.http.post<ApiResponse<GetProductsSchema>>(`${this.apiUrl}/products`, product);
  }

  updateProduct(id: number, product: PatchProductsSchema) {
    return this.http.patch<ApiResponseSingle<GetProductSchema>>(`${this.apiUrl}/products/${id}`, product);
  }

  deleteProduct(id: number) {
    return this.http.delete<ApiResponse<ApiResponseInfo>>(`${this.apiUrl}/products/${id}`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class ITbleDataProductService extends DataProductService implements ITableDataService<GetProductsSchema>,
  ITableDataRowClickNavigationData<GetProductsSchema>,
  ITableDataRowAddNavigationData<GetProductsSchema> {

  getList(page: number, size: number): Observable<ApiResponse<GetProductsSchema>> {
    return this.getProducts(page, size);
  }

  getRowClickNavigationData(row: GetProductsSchema, selected: boolean): { commands: any[], extras?: any } {
    if (selected) {
      return { commands: ['/assembly/products', { outlets: { sidebar: ['selected', row.ProductID] } }] };
    } else {
      return { commands: ['/assembly/products', { outlets: { sidebar: null } }] };
    }
  }

  getRowAddNavigationData(): { commands: any[], extras?: any } {
    return { commands: ['/assembly/products', { outlets: { sidebar: ['add'] } }] };
  }

  getAddLabel(): string {
    return 'Add Product';
  }
}