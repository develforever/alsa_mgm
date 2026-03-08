import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppUiDataTableComponent, TableFetchOptions } from '../../../../ui/data/table.component';
import { DataAuditService } from '../../../../services/data/audit.service';

@Component({
  selector: 'home-audit-log-component',
  templateUrl: './audit-log.component.html',
  imports: [
    CommonModule,
    AppUiDataTableComponent,
  ],
})
export class AuditLogComponent {
  private dataService = inject(DataAuditService);

  displayedColumns: string[] = ['timestamp', 'userEmail', 'action', 'entityName', 'details'];
  fetchLogs = (options: TableFetchOptions) => {
    return this.dataService.getAuditLogs(options.page, options.limit);
  };


}