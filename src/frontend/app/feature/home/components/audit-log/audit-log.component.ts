import { Component, inject, OnInit, signal, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { AppUiDataTableComponent, TableFetchOptions } from '../../../../ui/data/table.component';
import { DataAuditService, AuditLogFilter } from '../../../../services/data/audit.service';
import { SimpleContextMenuComponent } from '../../../../ui/context-menu/simple-context-menu.component';
import { ContextMenuProvider, ContextMenuAction, ContextMenuContext } from '../../../../ui/context-menu/context-menu-config.interface';
import { ContextMenuServiceImpl } from '../../../../ui/context-menu/context-menu.service';
import { JsonPreviewDialogComponent, JsonPreviewDialogData } from '../../../../ui/context-menu/json-preview-dialog.component';
import { ContextMenuTriggerService } from '../../../../ui/context-menu/context-menu-trigger.service';

@Component({
  selector: 'app-home-audit-log-component',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatChipsModule,
    AppUiDataTableComponent,
    SimpleContextMenuComponent,
  ],
})
export class AuditLogComponent implements OnInit, ContextMenuProvider, OnDestroy {
  private dataService = inject(DataAuditService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private contextMenuService = inject(ContextMenuServiceImpl);
  private triggerService = inject(ContextMenuTriggerService);
  private elementRef = inject(ElementRef);

  filterForm!: FormGroup;
  refresh$ = new Subject<void>();
  
  @ViewChild('auditTable') auditTable!: AppUiDataTableComponent<Record<string, unknown>>;
  
  private documentContextMenuListener: ((event: MouseEvent) => void) | null = null;

  // Filter options
  entityNames = signal<string[]>([]);
  actions = signal<string[]>([]);

  // Active filters display
  activeFilters = signal<string[]>([]);

  displayedColumns: string[] = ['timestamp', 'userEmail', 'action', 'entityName', 'details'];

  fetchLogs = (options: TableFetchOptions) => {
    const filter: AuditLogFilter = {};
    const formValue = this.filterForm.value;

    if (formValue.entityName) filter.entityName = formValue.entityName;
    if (formValue.action) filter.action = formValue.action;
    if (formValue.userEmail) filter.userEmail = formValue.userEmail;
    if (formValue.dateFrom) filter.dateFrom = this.formatDate(formValue.dateFrom);
    if (formValue.dateTo) filter.dateTo = this.formatDate(formValue.dateTo);

    return this.dataService.getAuditLogs(options.page, options.limit, filter);
  };

  ngOnInit(): void {
    this.initForm();
    this.loadFilterOptions();
    this.updateActiveFilters();

    // Subscribe to form changes to update active filters display
    this.filterForm.valueChanges.subscribe(() => {
      this.updateActiveFilters();
    });
    
    // Register as context menu provider
    this.contextMenuService.registerProvider(this);
    
    // Add document-level contextmenu listener
    this.documentContextMenuListener = (event: MouseEvent) => {
      this.onDocumentContextMenu(event);
    };
    document.addEventListener('contextmenu', this.documentContextMenuListener);
  }

  ngOnDestroy(): void {
    // Remove document listener
    if (this.documentContextMenuListener) {
      document.removeEventListener('contextmenu', this.documentContextMenuListener);
    }
  }

  private initForm(): void {
    this.filterForm = this.fb.group({
      entityName: [''],
      action: [''],
      userEmail: [''],
      dateFrom: [null],
      dateTo: [null],
    });
  }

  private loadFilterOptions(): void {
    this.dataService.getEntityNames().subscribe(entities => {
      this.entityNames.set(entities);
    });

    this.dataService.getActions().subscribe(actions => {
      this.actions.set(actions);
    });
  }

  applyFilters(): void {
    this.refresh$.next();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.refresh$.next();
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private updateActiveFilters(): void {
    const formValue = this.filterForm.value;
    const filters: string[] = [];

    if (formValue.entityName) filters.push(`Entity: ${formValue.entityName}`);
    if (formValue.action) filters.push(`Action: ${formValue.action}`);
    if (formValue.userEmail) filters.push(`User: ${formValue.userEmail}`);
    if (formValue.dateFrom) filters.push(`From: ${this.formatDate(formValue.dateFrom)}`);
    if (formValue.dateTo) filters.push(`To: ${this.formatDate(formValue.dateTo)}`);

    this.activeFilters.set(filters);
  }

  removeFilter(filter: string): void {
    if (filter.startsWith('Entity:')) this.filterForm.patchValue({ entityName: '' });
    if (filter.startsWith('Action:')) this.filterForm.patchValue({ action: '' });
    if (filter.startsWith('User:')) this.filterForm.patchValue({ userEmail: '' });
    if (filter.startsWith('From:')) this.filterForm.patchValue({ dateFrom: null });
    if (filter.startsWith('To:')) this.filterForm.patchValue({ dateTo: null });

    this.refresh$.next();
  }
  
  handleContextMenu(detail: { context: ContextMenuContext; actions: ContextMenuAction[]; position: { x: number; y: number } }): void {
    if (detail.actions.length > 0) {
      this.triggerService.trigger({
        context: detail.context,
        actions: detail.actions,
        position: { x: detail.position.x, y: detail.position.y }
      });
    }
  }
  
  onDocumentContextMenu(event: MouseEvent): void {
    // Check if the click happened within this component
    const target = event.target as HTMLElement;
    const clickedInComponent = this.elementRef.nativeElement.contains(target);
    
    if (!clickedInComponent) {
      return;
    }
    
    // Find the closest table row
    const rowElement = target.closest('tr[data-testid="table-row"]');
    if (rowElement) {
      // Prevent default and stop propagation immediately
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      
      // Get the row index from the row element
      const tableElement = rowElement.closest('table');
      if (tableElement && this.auditTable) {
        const rows = Array.from(tableElement.querySelectorAll('tr[data-testid="table-row"]'));
        const rowIndex = rows.indexOf(rowElement);
        
        // Get the data from the table component's dataSource
        const dataSource = this.auditTable.dataSource;
        if (dataSource && rowIndex >= 0 && rowIndex < dataSource.data.length) {
          const rowData = dataSource.data[rowIndex];
          
          // Trigger the context menu with the event position and row data
          const context: ContextMenuContext = {
            element: target,
            data: rowData,
            type: 'table-row'
          };
          
          // Get actions for this context
          const actions = this.contextMenuService.getActionsForContext(context);
          
          if (actions.length > 0) {
            this.triggerService.trigger({
              context,
              actions,
              position: { x: event.clientX, y: event.clientY }
            });
          }
        }
      }
    }
  }
  
  // ContextMenuProvider implementation
  getProviderId(): string {
    return 'audit-log-provider';
  }

  getProviderName(): string {
    return 'Audit Log Provider';
  }

  getSupportedContextTypes(): string[] {
    return ['table-row', 'audit-log-row'];
  }

  getContextMenuActions(context: ContextMenuContext): ContextMenuAction[] {
    if ((context.type !== 'table-row' && context.type !== 'audit-log-row') || !context.data) {
      return [];
    }

    const row = context.data as Record<string, unknown>;
    const actions: ContextMenuAction[] = [];

    // Add JSON preview action
    actions.push({
      id: 'view-json',
      label: 'Podgląd JSON',
      icon: 'code',
      contextType: 'audit-log-row',
      handler: () => {
        const dialogData: JsonPreviewDialogData = {
          title: 'Szczegóły wpisu logu',
          data: row
        };
        
        this.dialog.open(JsonPreviewDialogComponent, {
          width: '800px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          data: dialogData
        });
      }
    });

    // Add copy details action
    actions.push({
      id: 'copy-details',
      label: 'Kopiuj szczegóły',
      icon: 'content_copy',
      contextType: 'audit-log-row',
      handler: () => {
        const details = JSON.stringify(row, null, 2);
        navigator.clipboard.writeText(details);
      }
    });

    return actions;
  }
}