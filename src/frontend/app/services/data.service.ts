
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export abstract class AbstractDataService {
  protected http = inject(HttpClient);
  protected apiUrl = '/api';
  private refreshSubject = new Subject<void>();
  refresh$ = this.refreshSubject.asObservable();
  triggerRefresh() {
    this.refreshSubject.next();
  }

}