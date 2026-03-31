import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractDataService } from '../data.service';
import { User } from '../../../../shared/models/types';
import { ApiResponse, ApiResponseList, ApiResponseSingle } from '../../../../shared/api/ApiResponse';

export enum UserRole {
  Admin = 'admin',
  Operator = 'operator',
  Viewer = 'viewer'
}

export interface UserFilter {
  role?: UserRole;
  isActive?: boolean;
}

export interface UpdateUserRequest {
  role?: UserRole;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DataUserService extends AbstractDataService {

  constructor() {
    super('/users');
  }

  getUsers(page: number, size: number, filter?: string, role?: UserRole, isActive?: boolean): Observable<ApiResponseList<User>> {
    const params: Record<string, string> = {
      page: page.toString(),
      size: size.toString(),
    };

    if (filter) params['filter'] = filter;
    if (role) params['role'] = role;
    if (isActive !== undefined) params['isActive'] = isActive.toString();

    return this.http.get<ApiResponseList<User>>(`${this.getPath()}`, { params });
  }

  getUser(id: number): Observable<ApiResponseSingle<User>> {
    return this.http.get<ApiResponseSingle<User>>(`${this.getPath()}/${id}`);
  }

  updateUser(id: number, data: UpdateUserRequest): Observable<ApiResponseSingle<User>> {
    return this.http.patch<ApiResponseSingle<User>>(`${this.getPath()}/${id}`, data);
  }

  deleteUser(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.getPath()}/${id}`);
  }

  getRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.getPath()}/roles/list`);
  }
}
