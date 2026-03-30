import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { AbstractDataService } from './data.service';
import { ApiResponse, ApiResponseInfo, ApiResponseSingle } from '../../../shared/api/ApiResponse';
import { ICrudService } from '../ui/data/layout/smart-list-layout.component';
import { FormGroup } from '@angular/forms';

export enum Crud_Form_Context {
  CREATE = 'create',
  UPDATE = 'update',
}

export interface FieldConfig {
  key: string;
  type: 'text' | 'number' | 'checkbox' | 'hidden' | 'relation' | 'toggle';
  label?: string;
  // For 'relation' fields
  fetchFn?: (query: string) => Observable<any[]>;
  fetchByIdFn?: (id: any) => Observable<any>;
  displayKey?: string;
  valueKey?: string;
  validations?: Record<string, string>;
}

export abstract class AbstractCrudService<T extends object, CreateT = unknown, UpdateT = unknown>
  extends AbstractDataService
  implements ICrudService<T> {

  getAll(filter?: string): Observable<ApiResponse<T>> {
    let params = new HttpParams();
    if (filter) {
      params = params.set('filter', filter);
    }
    return this.http.get<ApiResponse<T>>(`${this.getPath()}`, {
      params,
    });
  }

  getList(page: number, size: number, filter?: string): Observable<ApiResponse<T>> {
    let params = new HttpParams();

    if (page) {
      params = params.set('page', page.toString());
    }

    if (size) {
      params = params.set('size', size.toString());
    }

    if (filter) {
      params = params.set('filter', filter);
    }

    return this.http.get<ApiResponse<T>>(`${this.getPath()}`, {
      params,
    });
  }

  getOne(id: string | number): Observable<ApiResponseSingle<T>> {
    return this.http.get<ApiResponseSingle<T>>(`${this.getPathById(id)}`);
  }

  create(data: CreateT): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.getPath()}`, data);
  }

  update(id: string | number, data: UpdateT): Observable<ApiResponseSingle<T>> {
    return this.http.patch<ApiResponseSingle<T>>(`${this.getPathById(id)}`, data);
  }

  delete(id: string | number): Observable<ApiResponse<ApiResponseInfo>> {
    return this.http.delete<ApiResponse<ApiResponseInfo>>(`${this.getPathById(id)}`);
  }

  // Abstract methods from ICrudService that still need implementation in concrete class
  abstract getListViewCommands(): unknown[];
  abstract getSidebarBaseRoute(): string;
  abstract getItemEditRoute(id: string | number): unknown[];
  abstract getFormGroup(context?: Crud_Form_Context): FormGroup;
}
