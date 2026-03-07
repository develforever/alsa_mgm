import { Component, OnInit, signal, inject } from '@angular/core';
import { DataService } from '../../../../services/data.service';
import { CommonModule } from '@angular/common';
import { AuditLog } from '../../../../../../shared/models/types';

@Component({
  selector: 'home-audit-log-component',
  templateUrl: './audit-log.component.html',
  imports: [
    CommonModule,
  ],
})
export class AuditLogComponent implements OnInit {
  private dataService = inject(DataService);

  logs = signal<AuditLog[]>([]);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.dataService.getAuditLogs().subscribe(data => this.logs.set(data));
  }

}