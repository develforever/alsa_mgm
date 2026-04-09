import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductionPlanService } from '../../../../services/data/production-plan.service';
import { DataProductService } from '../../../assembly/components/product-list/service/product.service';
import { DataAssemblyLineService } from '../../../assembly/components/line-list/service/line.service';
import { ProductionPlan, ProductionPlanStatus, ProductionPriority, ALWStation } from '../../../../../../shared/models/types';
import { ApiResponseSingle } from '../../../../../../shared/api/ApiResponse';

@Component({
  selector: 'app-production-plan-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatSnackBarModule,
  ],
  templateUrl: './production-plan-form.component.html',
  styleUrls: ['./production-plan-form.component.scss'],
})
export class ProductionPlanFormComponent implements OnInit {
  private service = inject(ProductionPlanService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private productService = inject(DataProductService);
  private lineService = inject(DataAssemblyLineService);
  private destroyRef = inject(DestroyRef);

  planForm!: FormGroup;
  isEdit = false;
  planId?: number;
  loading = false;

  // Data for dropdowns
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  products: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assemblyLines: any[] = [];

  // Enums for template
  statuses = Object.values(ProductionPlanStatus);
  priorities = Object.values(ProductionPriority);

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
    this.loadAssemblyLines();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.planId = parseInt(id, 10);
      this.loadPlan(this.planId);
    }
  }

  private loadProducts(): void {
    this.loading = true;
    this.productService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      next: (response: any) => {
        this.products = response.data || [];
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Błąd podczas ładowania produktów', 'Zamknij', { duration: 3000 });
        this.loading = false;
      },
    });
  }

  private loadAssemblyLines(): void {
    this.loading = true;
    this.lineService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      next: (response: any) => {
        this.assemblyLines = response.data || [];
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Błąd podczas ładowania linii montażowych', 'Zamknij', { duration: 3000 });
        this.loading = false;
      },
    });
  }

  private initForm(): void {
    this.planForm = this.fb.group({
      productId: ['', Validators.required],
      assemblyLineId: ['', Validators.required],
      workstationIds: [[]],
      plannedStartDate: ['', Validators.required],
      plannedEndDate: ['', Validators.required],
      plannedQuantity: ['', [Validators.required, Validators.min(1)]],
      priority: [ProductionPriority.Normal, Validators.required],
      status: [ProductionPlanStatus.Draft],
      notes: [''],
    });
  }

  private loadPlan(id: number): void {
    this.loading = true;
    this.service.getProductionPlan(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response: ApiResponseSingle<ProductionPlan>) => {
        if (response.data) {
          const plan = response.data;
          this.planForm.patchValue({
            productId: plan.productId,
            assemblyLineId: plan.assemblyLineId,
            workstationIds: plan.workstations?.map((w: ALWStation) => w.ALWStationID) || [],
            plannedStartDate: plan.plannedStartDate,
            plannedEndDate: plan.plannedEndDate,
            plannedQuantity: plan.plannedQuantity,
            priority: plan.priority,
            status: plan.status,
            notes: plan.notes,
          });
        }
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Błąd podczas ładowania planu', 'Zamknij', { duration: 3000 });
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.planForm.invalid) {
      this.planForm.markAllAsTouched();
      return;
    }

    const formValue = this.planForm.value;
    const request = {
      ...formValue,
      plannedStartDate: this.formatDateForApi(formValue.plannedStartDate),
      plannedEndDate: this.formatDateForApi(formValue.plannedEndDate),
    };

    if (this.isEdit && this.planId) {
      this.service.updateProductionPlan(this.planId, request).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.snackBar.open('Plan zaktualizowany pomyślnie', 'Zamknij', { duration: 3000 });
          this.router.navigate(['/production-plans']);
        },
        error: () => {
          this.snackBar.open('Błąd podczas aktualizacji planu', 'Zamknij', { duration: 3000 });
        },
      });
    } else {
      this.service.createProductionPlan(request).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.snackBar.open('Plan utworzony pomyślnie', 'Zamknij', { duration: 3000 });
          this.router.navigate(['/production-plans']);
        },
        error: () => {
          this.snackBar.open('Błąd podczas tworzenia planu', 'Zamknij', { duration: 3000 });
        },
      });
    }
  }

  private formatDateForApi(date: Date | string): string {
    if (!date) return '';
    if (typeof date === 'string') return date;
    return date.toISOString();
  }

  onCancel(): void {
    this.router.navigate(['/production-plans']);
  }
}
