

import { AfterViewInit, ChangeDetectorRef, Component, computed, ContentChildren, EventEmitter, inject, Input, Output, QueryList, signal, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { catchError, merge, Observable, of, startWith, Subject, switchMap } from 'rxjs';
import { ApiResponse, ApiResponseList, ApiResponseSingle } from '../../../../shared/api/ApiResponse';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AppTableCellDefDirective } from './AppTableCellDefDirective';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AppUiDialogYesNoComponent, YesNoDialogData } from '../dialog/yes-no.dialog.component';

export interface TableFetchOptions {
    page: number;
    limit: number;
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
        DatePipe,
        MatButtonModule
    ],
    styleUrls: ['./table.component.scss'],
    styles: [`
    :host {
        padding: 10px;
    }
    `]
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class AppUiDataTableComponent<T extends Record<string, any>> implements AfterViewInit {

    @Output() editAction = new EventEmitter<T>();
    @Output() deleteAction = new EventEmitter<T>();

    @Input() refresh$ = new Subject<void>();

    @Input() pageSize = 10;
    @Input() displayedColumns: string[] = [];

    detectedColumns = signal<string[]>([]);
    columnsToShow = computed(() => {
        const allColumns = ['select', ...this.displayedColumns, ...this.detectedColumns(), 'actions'];
        const uniqueColumnsSet = new Set(allColumns);

        return [...uniqueColumnsSet];
    });

    @Input() columnTypes: Record<string, ColumnType> = {};
    @Input({ required: true }) fetchFn!: PaginatedFetchFn<T> | FlatFetchFn<T>;
    readonly dialog = inject(MatDialog);

    selection = new SelectionModel<T>(true, []);
    private cdr = inject(ChangeDetectorRef);
    dataSource = new MatTableDataSource<T>([]);
    isLoading = true;
    totalElements = 0;

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    @ContentChildren(AppTableCellDefDirective)
    customCellDefs!: QueryList<AppTableCellDefDirective>;

    getCustomTemplate(columnName: string) {
        return this.customCellDefs?.find(def => def.columnName === columnName)?.template;
    }

    ngAfterViewInit() {

        this.init();
    }

    init() {
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
                        console.error(err);
                        return of({ data: [], total: 0 } as ApiResponseList<T>);
                    })
                );

            })
        ).subscribe((data: ApiResponse<T> | ApiResponse<T[]>) => {

            if ('message' in data && !('data' in data)) {
                console.error('Błąd API:', data.message);
                this.isLoading = false;
                return;
            }

            const response = data as ApiResponseList<T> | ApiResponseSingle<T> | ApiResponseSingle<T[]>;

            const rows = Array.isArray(response.data) ? response.data : [response.data];

            this.dataSource.data = rows as T[];
            this.totalElements = ('total' in response) && response.total !== undefined ? response.total : rows.length;

            if (rows.length > 0) {
                this.autoDetectColumns(rows[0]);
                this.autoDetectTypes(rows[0]);

            }

            this.isLoading = false;
            this.cdr.detectChanges();
        });
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
}