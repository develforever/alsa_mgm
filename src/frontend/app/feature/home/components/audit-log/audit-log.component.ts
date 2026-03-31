import { Component, inject, OnInit, signal } from '@angular/core';
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
import { Subject } from 'rxjs';
import { AppUiDataTableComponent, TableFetchOptions } from '../../../../ui/data/table.component';
import { DataAuditService, AuditLogFilter } from '../../../../services/data/audit.service';

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
  ],
})
export class AuditLogComponent implements OnInit {
  private dataService = inject(DataAuditService);
  private fb = inject(FormBuilder);

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
}