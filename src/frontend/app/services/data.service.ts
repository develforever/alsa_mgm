
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export abstract class AbstractDataService {
  protected http = inject(HttpClient);
  protected apiUrl = '/api';
  protected apiEntityUrl = '';

  constructor(entityUrl: string) {
    this.apiEntityUrl = entityUrl;
  }

  private refreshSubject = new Subject<void>();
  refresh$ = this.refreshSubject.asObservable();

  triggerRefresh() {
    this.refreshSubject.next();
  }

  private notifyChangeSubject = new Subject<void>();
  notifyChange$ = this.notifyChangeSubject.asObservable();

  notifyChange(): void {
    this.notifyChangeSubject.next();
  }

  protected getPath() {
    return this.apiUrl + this.apiEntityUrl;
  }

  protected getPathById(id: string | number) {
    return this.getPath() + '/' + id;
  }



}