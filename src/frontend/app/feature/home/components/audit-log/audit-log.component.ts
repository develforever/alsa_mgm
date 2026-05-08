import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
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
import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppUiDataTableComponent, TableFetchOptions } from '../../../../ui/data/table.component';
import { DataAuditService, AuditLogFilter } from '../../../../services/data/audit.service';
import { ContextMenuServiceImpl } from '../../../../ui/context-menu/context-menu.service';
import { JsonPreviewDialogComponent, JsonPreviewDialogData } from '../../../../ui/context-menu/json-preview-dialog.component';
import { TranslocoService, TranslocoModule } from '@jsverse/transloco';

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
    TranslocoModule
  ],
})
export class AuditLogComponent implements OnInit, OnDestroy {
  private dataService = inject(DataAuditService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private contextMenuService = inject(ContextMenuServiceImpl);
  private transloco = inject(TranslocoService);
  private actionBusSubscription: Subscription | null = null;

  filterForm!: FormGroup;
  refresh$ = new Subject<void>();

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

    // Subscribe to action execution bus - handle 'view-json' with dialog
    this.actionBusSubscription = this.contextMenuService.getActionBus()
      .pipe(filter(event => event.actionId === 'view-json'))
      .subscribe(event => {
        const row = event.context.data as Record<string, unknown> | undefined;
        const dialogData: JsonPreviewDialogData = {
          title: this.transloco.translate('AUDIT.DIALOG_TITLE'),
          data: row
        };
        this.dialog.open(JsonPreviewDialogComponent, {
          width: '800px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          data: dialogData
        });
      });
  }

  ngOnDestroy(): void {
    if (this.actionBusSubscription) {
      this.actionBusSubscription.unsubscribe();
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

    if (formValue.entityName) filters.push(`${this.transloco.translate('AUDIT.FILTER_PREFIX_ENTITY')}: ${formValue.entityName}`);
    if (formValue.action) filters.push(`${this.transloco.translate('AUDIT.FILTER_PREFIX_ACTION')}: ${formValue.action}`);
    if (formValue.userEmail) filters.push(`${this.transloco.translate('AUDIT.FILTER_PREFIX_USER')}: ${formValue.userEmail}`);
    if (formValue.dateFrom) filters.push(`${this.transloco.translate('AUDIT.FILTER_PREFIX_FROM')}: ${this.formatDate(formValue.dateFrom)}`);
    if (formValue.dateTo) filters.push(`${this.transloco.translate('AUDIT.FILTER_PREFIX_TO')}: ${this.formatDate(formValue.dateTo)}`);

    this.activeFilters.set(filters);
  }

  removeFilter(filterStr: string): void {
    if (filterStr.startsWith(this.transloco.translate('AUDIT.FILTER_PREFIX_ENTITY'))) this.filterForm.patchValue({ entityName: '' });
    if (filterStr.startsWith(this.transloco.translate('AUDIT.FILTER_PREFIX_ACTION'))) this.filterForm.patchValue({ action: '' });
    if (filterStr.startsWith(this.transloco.translate('AUDIT.FILTER_PREFIX_USER'))) this.filterForm.patchValue({ userEmail: '' });
    if (filterStr.startsWith(this.transloco.translate('AUDIT.FILTER_PREFIX_FROM'))) this.filterForm.patchValue({ dateFrom: null });
    if (filterStr.startsWith(this.transloco.translate('AUDIT.FILTER_PREFIX_TO'))) this.filterForm.patchValue({ dateTo: null });

    this.refresh$.next();
  }

}