
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { AbstractDataService } from '../../../../../services/data.service';
import { GetProductSchema, GetProductsSchema, PatchProductsSchema, PostProductsSchema } from '../../../../../../../shared/api/product/schema';
import { ICrudService, ITableDataRowAddNavigationData, ITableDataRowClickNavigationData } from '../../../../../ui/data/layout/smart-list-layout.component';
import { ApiResponse, ApiResponseInfo, ApiResponseSingle } from '../../../../../../../shared/api/ApiResponse';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class DataProductService extends AbstractDataService implements ICrudService<GetProductsSchema>,
  ITableDataRowClickNavigationData<GetProductsSchema>,
  ITableDataRowAddNavigationData {

  private notifyChangeSubject = new Subject<void>();
  notifyChange$ = this.notifyChangeSubject.asObservable();

  notifyChange(): void {
    this.notifyChangeSubject.next();
  }

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

  getList(page: number, size: number): Observable<ApiResponse<GetProductsSchema>> {
    return this.getProducts(page, size);
  }

  getOne(id: string | number): Observable<ApiResponseSingle<GetProductsSchema>> {
    return this.getProduct(id as number) as any;
  }

  create(data: any): Observable<ApiResponse<GetProductsSchema>> {
    return this.addProduct(data);
  }

  update(id: string | number, data: any): Observable<ApiResponseSingle<GetProductsSchema>> {
    return this.updateProduct(id as number, data) as any;
  }

  delete(id: string | number): Observable<ApiResponse<ApiResponseInfo>> {
    return this.deleteProduct(id as number);
  }

  getListViewCommands(): any[] {
    return [this.getSidebarBaseRoute()];
  }

  getSidebarBaseRoute(): string {
    return '/assembly/products';
  }

  getItemEditRoute(id: string | number): any[] {
    return ['edit', id];
  }

  getFormGroup(): FormGroup {
    return new FormGroup({
      ProductID: new FormControl({ value: 0, disabled: true }, [Validators.required]),
      Name: new FormControl('', [Validators.required]),
      Active: new FormControl(false, Validators.required),
      CreatedAt: new FormControl({ value: new Date(), disabled: true }, [Validators.required]),
      UpdatedAt: new FormControl({ value: new Date(), disabled: true }, [Validators.required]),
    });
  }

  getSidebarItemRoute(row: GetProductsSchema): any[] {
    return ['selected', row.ProductID];
  }

  getSidebarAddRoute(): any[] {
    return ['add'];
  }

  getAddLabel(): string {
    return 'Add Product';
  }
}