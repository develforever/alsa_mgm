import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { AppUiDataTableComponent, TableFetchOptions } from '../../../../ui/data/table.component';
import { ProductionPlanService, ProductionPlanFilter } from '../../../../services/data/production-plan.service';
import { ProductionPlan, ProductionPlanStatus, ProductionPriority } from '../../../../../../shared/models/types';
import { ProductionPlanStatusPipe } from '../../pipes/production-plan-status.pipe';
import { ProductionPriorityPipe } from '../../pipes/production-priority.pipe';

@Component({
  selector: 'app-production-plan-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatMenuModule,
    MatDialogModule,
    AppUiDataTableComponent,
    ProductionPlanStatusPipe,
    ProductionPriorityPipe,
  ],
  templateUrl: './production-plan-list.component.html',
  styleUrls: ['./production-plan-list.component.scss'],
})
export class ProductionPlanListComponent implements OnInit {
  private service = inject(ProductionPlanService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);

  filterForm!: FormGroup;
  refresh$ = new Subject<void>();

  // Filter options
  statuses = signal<ProductionPlanStatus[]>([
    ProductionPlanStatus.Draft,
    ProductionPlanStatus.Scheduled,
    ProductionPlanStatus.InProgress,
    ProductionPlanStatus.Completed,
    ProductionPlanStatus.Cancelled,
  ]);

  priorities = signal<ProductionPriority[]>([
    ProductionPriority.Low,
    ProductionPriority.Normal,
    ProductionPriority.High,
    ProductionPriority.Critical,
  ]);

  // Expose enums to template
  planStatus = ProductionPlanStatus;

  // Active filters display
  activeFilters = signal<string[]>([]);

  displayedColumns: string[] = [
    'id',
    'product',
    'assemblyLine',
    'plannedStartDate',
    'plannedEndDate',
    'plannedQuantity',
    'status',
    'priority',
    'actions',
  ];

  fetchPlans = (options: TableFetchOptions) => {
    const formValue = this.filterForm.value;
    const filter: ProductionPlanFilter = {
      productId: formValue.productId || undefined,
      assemblyLineId: formValue.assemblyLineId || undefined,
      status: formValue.status || undefined,
      startDateFrom: formValue.startDateFrom || undefined,
      startDateTo: formValue.startDateTo || undefined,
    };
    return this.service.getProductionPlans(options.page, options.limit, filter);
  };

  ngOnInit(): void {
    this.initForm();
    this.updateActiveFilters();

    this.filterForm.valueChanges.subscribe(() => {
      this.updateActiveFilters();
    });
  }

  private initForm(): void {
    this.filterForm = this.fb.group({
      productId: [''],
      assemblyLineId: [''],
      status: [''],
      startDateFrom: [''],
      startDateTo: [''],
    });
  }

  applyFilters(): void {
    this.refresh$.next();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.refresh$.next();
  }

  private updateActiveFilters(): void {
    const formValue = this.filterForm.value;
    const filters: string[] = [];

    if (formValue.productId) filters.push(`Produkt: ${formValue.productId}`);
    if (formValue.assemblyLineId) filters.push(`Linia: ${formValue.assemblyLineId}`);
    if (formValue.status) filters.push(`Status: ${formValue.status}`);
    if (formValue.startDateFrom) filters.push(`Od: ${formValue.startDateFrom}`);
    if (formValue.startDateTo) filters.push(`Do: ${formValue.startDateTo}`);

    this.activeFilters.set(filters);
  }

  removeFilter(filter: string): void {
    if (filter.startsWith('Produkt:')) this.filterForm.patchValue({ productId: '' });
    if (filter.startsWith('Linia:')) this.filterForm.patchValue({ assemblyLineId: '' });
    if (filter.startsWith('Status:')) this.filterForm.patchValue({ status: '' });
    if (filter.startsWith('Od:')) this.filterForm.patchValue({ startDateFrom: '' });
    if (filter.startsWith('Do:')) this.filterForm.patchValue({ startDateTo: '' });
    this.refresh$.next();
  }

  deletePlan(plan: ProductionPlan): void {
    if (confirm(`Czy na pewno chcesz usunąć plan produkcji #${plan.id}?`)) {
      this.service.deleteProductionPlan(plan.id).subscribe(() => {
        this.refresh$.next();
      });
    }
  }

  getStatusColor(status: ProductionPlanStatus): string {
    switch (status) {
      case ProductionPlanStatus.Draft:
        return 'default';
      case ProductionPlanStatus.Scheduled:
        return 'primary';
      case ProductionPlanStatus.InProgress:
        return 'accent';
      case ProductionPlanStatus.Completed:
        return 'success';
      case ProductionPlanStatus.Cancelled:
        return 'warn';
      default:
        return 'default';
    }
  }

  getPriorityColor(priority: ProductionPriority): string {
    switch (priority) {
      case ProductionPriority.Low:
        return 'default';
      case ProductionPriority.Normal:
        return 'primary';
      case ProductionPriority.High:
        return 'accent';
      case ProductionPriority.Critical:
        return 'warn';
      default:
        return 'default';
    }
  }
}
