import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Subject } from 'rxjs';
import { AppUiDataTableComponent, TableFetchOptions } from '../../../../ui/data/table.component';
import { User } from '../../../../../../shared/models/types';
import { TranslocoService, TranslocoModule } from '@jsverse/transloco';
import { DataUserService, UserRole, UpdateUserRequest } from '../../../../services/data/user.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatMenuModule,
    MatDividerModule,
    AppUiDataTableComponent,
    TranslocoModule
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  private dataService = inject(DataUserService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private transloco = inject(TranslocoService);

  filterForm!: FormGroup;
  refresh$ = new Subject<void>();

  // Filter options
  availableRoles = signal<UserRole[]>([]);

  // Expose enum to template
  userRole = UserRole;

  // Active filters display
  activeFilters = signal<string[]>([]);

  displayedColumns: string[] = ['avatarUrl', 'username', 'email', 'role', 'isActive', 'lastLoginAt', 'actions'];

  fetchUsers = (options: TableFetchOptions) => {
    const formValue = this.filterForm.value;
    return this.dataService.getUsers(
      options.page,
      options.limit,
      undefined, // filter text
      formValue.role || undefined,
      formValue.isActive !== '' ? formValue.isActive : undefined
    );
  };

  ngOnInit(): void {
    this.initForm();
    this.loadRoles();
    this.updateActiveFilters();

    this.filterForm.valueChanges.subscribe(() => {
      this.updateActiveFilters();
    });
  }

  private initForm(): void {
    this.filterForm = this.fb.group({
      role: [''],
      isActive: [''],
    });
  }

  private loadRoles(): void {
    this.dataService.getRoles().subscribe(roles => {
      this.availableRoles.set(roles as UserRole[]);
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

    if (formValue.role) filters.push(`${this.transloco.translate('USER_MANAGEMENT.ROLE')}: ${formValue.role}`);
    if (formValue.isActive !== '' && formValue.isActive !== null) {
      const activeStr = formValue.isActive ? this.transloco.translate('USER_MANAGEMENT.STATUS_ACTIVE') : this.transloco.translate('USER_MANAGEMENT.STATUS_INACTIVE');
      filters.push(`${this.transloco.translate('PRODUCTION_PLAN.FILTER_STATUS')}: ${activeStr}`);
    }

    this.activeFilters.set(filters);
  }

  removeFilter(filter: string): void {
    if (filter.startsWith(this.transloco.translate('USER_MANAGEMENT.ROLE'))) this.filterForm.patchValue({ role: '' });
    if (filter.startsWith(this.transloco.translate('PRODUCTION_PLAN.FILTER_STATUS'))) this.filterForm.patchValue({ isActive: '' });
    this.refresh$.next();
  }

  updateUserRole(user: User, role: UserRole): void {
    const update: UpdateUserRequest = { role };
    this.dataService.updateUser(user.id!, update).subscribe(() => {
      this.refresh$.next();
    });
  }

  toggleUserActive(user: User): void {
    const update: UpdateUserRequest = { isActive: !user.isActive };
    this.dataService.updateUser(user.id!, update).subscribe(() => {
      this.refresh$.next();
    });
  }

  deleteUser(user: User): void {
    const msg = this.transloco.translate('USER_MANAGEMENT.CONFIRM_DELETE', { username: user.username });
    if (confirm(msg)) {
      this.dataService.deleteUser(user.id!).subscribe(() => {
        this.refresh$.next();
      });
    }
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'admin': return 'primary';
      case 'operator': return 'accent';
      case 'viewer': return 'warn';
      default: return 'default';
    }
  }
}
