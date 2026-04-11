

import { AfterViewInit, ChangeDetectorRef, Component, computed, ContentChildren, EventEmitter, inject, Input, OnDestroy, Output, QueryList, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { catchError, filter, merge, Observable, of, startWith, Subject, switchMap } from 'rxjs';
import { ApiMeta, ApiResponse, ApiResponseList, ApiResponseSingle, ApiError } from '../../../../shared/api/ApiResponse';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AppTableCellDefDirective } from './AppTableCellDefDirective';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AppUiDialogYesNoComponent, YesNoDialogData } from '../dialog/yes-no.dialog.component';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { ContextMenuServiceImpl } from '../context-menu/context-menu.service';
import { ContextMenuContext } from '../context-menu/models/context.model';
import { ContextMenuAction } from '../context-menu/models/action.model';

export interface TableFetchOptions {
    page: number;
    limit: number;
    filter?: string;
}

export type ColumnType = 'text' | 'date' | 'boolean' | 'number' | 'action_delete_edit' | 'custom';

export type PaginatedFetchFn<T> = (options: TableFetchOptions) => Observable<ApiResponse<T>>;
export type FlatFetchFn<T> = () => Observable<ApiResponse<T[]> | ApiResponseList<T>>;

@Component({
    selector: 'app-ui-data-table-component',
    templateUrl: './table-component.html',
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatIconModule,
        DatePipe,
        MatButtonModule
    ],
    styleUrls: ['./table.component.scss'],
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class AppUiDataTableComponent<T extends Record<string, any>> implements AfterViewInit, OnDestroy {

    @Output() editAction = new EventEmitter<T>();
    @Output() deleteAction = new EventEmitter<T>();
    @Output() rowClick = new EventEmitter<{ row: T, selected: boolean }>();
    @Output() errorOccurred = new EventEmitter<ApiError>();
    @Output() contextMenu = new EventEmitter<{ context: ContextMenuContext; actions: ContextMenuAction[]; position: { x: number; y: number } }>();
    @Output() dataLoadFailed = new EventEmitter<{ message: string; code?: number }>();

    @Input() refresh$ = new Subject<void>();
    @Input() pageSize = 10;
    @Input() displayedColumns: string[] = [];
    @Input() showErrorNotification = true;

    private router = inject(Router);
    private route = inject(ActivatedRoute);

    private lastSelectedViaRouteItem: T | undefined;

    detectedColumns = signal<string[]>([]);
    columnsToShow = computed(() => {
        const allColumns = ['select', ...this.displayedColumns, ...this.detectedColumns(), 'actions'];
        const uniqueColumnsSet = new Set(allColumns);

        return [...uniqueColumnsSet];
    });

    @Input() columnTypes: Record<string, ColumnType> = {};
    @Input() externalCellDefs?: QueryList<AppTableCellDefDirective>;
    @Input({ required: true }) fetchFn!: PaginatedFetchFn<T> | FlatFetchFn<T>;
    readonly dialog = inject(MatDialog);
    private snackBar = inject(MatSnackBar);
    private contextMenuService = inject(ContextMenuServiceImpl);

    selection = new SelectionModel<T>(true, []);
    private cdr = inject(ChangeDetectorRef);
    dataSource = new MatTableDataSource<T>([]);
    isLoading = true;
    hasError = false;
    errorMessage = '';
    totalElements = 0;
    selectedRowId: string | number | null = null;

    private destroy$ = new Subject<void>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    @ContentChildren(AppTableCellDefDirective)
    customCellDefs!: QueryList<AppTableCellDefDirective>;

    elementRef = inject(ElementRef);

    private meta: ApiMeta | undefined;

    getCustomTemplate(columnName: string) {
        return this.customCellDefs?.find(def => def.columnName === columnName)?.template
            || this.externalCellDefs?.find(def => def.columnName === columnName)?.template;
    }

    ngAfterViewInit() {

        this.init();
    }

    init() {

        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            this.initSelection();
        });

        this.initSelection();


        // Removed selection.changed subscription to decouple multi-selection from sidebar navigation

        merge(
            this.paginator.page,
            this.refresh$
        ).pipe(
            startWith({}),
            switchMap(() => {
                this.isLoading = true;
                this.dataSource.data = [];
                this.cdr.detectChanges();

                const options: TableFetchOptions = {
                    page: this.paginator.pageIndex,
                    limit: this.paginator.pageSize
                };

                let stream$: Observable<ApiResponse<T> | ApiResponse<T[]>>;
                if (this.fetchFn.length === 0) {
                    stream$ = (this.fetchFn as FlatFetchFn<T>)();
                } else {
                    stream$ = (this.fetchFn as PaginatedFetchFn<T>)(options);
                }

                return stream$.pipe(
                    catchError((err): Observable<ApiResponseList<T>> => {
                        const errorMessage = err?.error?.message || err?.message || 'Wystąpił błąd podczas ładowania danych';
                        const errorCode = err?.status || err?.error?.code || 500;
                        
                        // Emit error event for parent components
                        this.dataLoadFailed.emit({ message: errorMessage, code: errorCode });
                        
                        // Show snackbar notification
                        if (this.showErrorNotification) {
                            this.snackBar.open(`Błąd: ${errorMessage}`, 'Zamknij', {
                                duration: 5000,
                                panelClass: ['error-snackbar'],
                                horizontalPosition: 'center',
                                verticalPosition: 'bottom'
                            });
                        }
                        
                        // Set error state
                        this.hasError = true;
                        this.errorMessage = errorMessage;
                        
                        return of({ data: [], meta: { page: 0, limit: 0, total: 0 } } as ApiResponseList<T>);
                    })
                );

            })
        ).subscribe((data: ApiResponse<T> | ApiResponse<T[]>) => {

            if ('message' in data && !('data' in data)) {
                const apiError = data as unknown as ApiError;
                this.errorOccurred.emit(apiError);
                this.hasError = true;
                this.errorMessage = apiError.message;
                
                if (this.showErrorNotification) {
                    this.snackBar.open(`Błąd API: ${apiError.message}`, 'Zamknij', {
                        duration: 5000,
                        panelClass: ['error-snackbar']
                    });
                }
                
                this.isLoading = false;
                this.cdr.detectChanges();
                return;
            }
            
            // Clear error state on successful load
            this.hasError = false;
            this.errorMessage = '';

            const response = data as ApiResponseList<T> | ApiResponseSingle<T> | ApiResponseSingle<T[]>;
            this.meta = 'meta' in response ? response.meta : undefined;

            const rows = response.data !== undefined
                ? (Array.isArray(response.data) ? response.data : [response.data])
                : [];

            this.dataSource.data = rows as T[];
            this.totalElements = this.meta?.total || rows.length;

            if (rows.length > 0) {
                this.initSelection();
                this.autoDetectColumns(rows[0]);
                this.autoDetectTypes(rows[0]);

            }

            this.isLoading = false;
            this.cdr.detectChanges();
        });
    }

    rowClickHandler(row: T) {
        this.rowClick.emit({ row, selected: true });
    }

    onContextMenu(event: MouseEvent, row: T): void {
        event.preventDefault();
        event.stopPropagation();

        const context: ContextMenuContext = {
            element: event.target as HTMLElement,
            data: row,
            type: 'table-row'
        };

        const actions = this.contextMenuService.getActionsForContext(context);
        
        console.log('[Table] Context menu triggered:', { context, actions, position: { x: event.clientX, y: event.clientY } });
        
        // Emit event for parent components to handle
        this.contextMenu.emit({
            context,
            actions,
            position: { x: event.clientX, y: event.clientY }
        });
    }

    private initSelection() {
        const sidebar = this.route.snapshot.children
            .find((c: ActivatedRouteSnapshot) => c.outlet === 'sidebar');

        if (sidebar?.params['id']) {
            this.selectedRowId = sidebar.params['id'];
        } else {
            this.selectedRowId = null;
        }
        this.cdr.detectChanges();
    }

    autoDetectColumns(sampleRow: T) {
        this.detectedColumns.set(Object.keys(sampleRow));
    }

    autoDetectTypes(sampleRow: T) {
        this.columnsToShow().forEach(column => {
            if (this.columnTypes[column] || column === 'actions') {
                return;
            }
            const value = sampleRow[column];
            if (typeof value === 'boolean' || value === true || value === false) {
                this.columnTypes[column] = 'boolean';
                return;
            }
            if (column.toLowerCase() === 'active') {
                this.columnTypes[column] = 'boolean';
                return;
            }
            if (typeof value === 'number') {
                this.columnTypes[column] = 'number';
                return;
            }
            if (typeof value === 'string' && value.length >= 10) {
                const isDateName = column.toLowerCase().includes('date')
                    || column.toLowerCase().endsWith('at')
                    || column.toLowerCase().includes('timestamp');
                const isDateParsed = !isNaN(Date.parse(value));

                if (isDateName && isDateParsed) {
                    this.columnTypes[column] = 'date';
                    return;
                }
            }
            this.columnTypes[column] = 'text';
        });
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }


    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }
        this.selection.select(...this.dataSource.data);
    }

    isRowActive(row: T): boolean {
        const primaryKey = this.meta?.entity?.primaryKey;
        if (!primaryKey) return false;
        return String(row[primaryKey]) === String(this.selectedRowId);
    }

    openDialog($event: Event, row: T, dialogData: YesNoDialogData): Promise<[T, boolean]> {
        $event.stopPropagation();
        $event.preventDefault();

        return new Promise((resolve) => {
            this.dialog.open(AppUiDialogYesNoComponent, {
                data: dialogData
            }).afterClosed().subscribe((result: boolean) => {
                resolve([row, result]);
            });
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}