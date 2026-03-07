import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { DataService } from '../../../../services/data.service';
import { CommonModule } from '@angular/common';
import { AuditLog } from '../../../../../../shared/models/types';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AppUiDataTableComponent, TableFetchOptions } from '../../../../ui/data/table.component';


@Component({
  selector: 'home-audit-log-component',
  templateUrl: './audit-log.component.html',
  imports: [
    CommonModule,
    AppUiDataTableComponent,
  ],
})
export class AuditLogComponent {
  private dataService = inject(DataService);

  displayedColumns: string[] = ['timestamp', 'userEmail', 'action', 'entityName', 'details'];
  fetchLogs = (options: TableFetchOptions) => {
    return this.dataService.getAuditLogs(options.page, options.limit);
  };

}