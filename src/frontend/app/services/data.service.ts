
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export abstract class AbstractDataService {
  protected http = inject(HttpClient);
  protected apiUrl = '/api';

}