

import { AfterViewInit, ChangeDetectorRef, Component, computed, ContentChildren, EventEmitter, inject, Input, Output, QueryList, signal, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { catchError, filter, merge, Observable, of, startWith, Subject, switchMap } from 'rxjs';
import { ApiMeta, ApiResponse, ApiResponseList, ApiResponseSingle } from '../../../../shared/api/ApiResponse';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AppTableCellDefDirective } from './AppTableCellDefDirective';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AppUiDialogYesNoComponent, YesNoDialogData } from '../dialog/yes-no.dialog.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

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
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class AppUiDataTableComponent<T extends Record<string, any>> implements AfterViewInit {

    @Output() editAction = new EventEmitter<T>();
    @Output() deleteAction = new EventEmitter<T>();
    @Output() rowClick = new EventEmitter<{ row: T, selected: boolean }>();

    @Input() refresh$ = new Subject<void>();
    @Input() pageSize = 10;
    @Input() displayedColumns: string[] = [];


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

    private meta: ApiMeta | undefined;

    getCustomTemplate(columnName: string) {
        return this.customCellDefs?.find(def => def.columnName === columnName)?.template;
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


        this.selection.changed
            .subscribe((event: { added: T[], removed: T[], source: SelectionModel<T> }) => {

                const last = event.source.selected[event.source.selected.length - 1];
                this.rowClick.emit({ row: last, selected: event.source.isSelected(last) });
            });

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
                        return of({ data: [], meta: { page: 0, limit: 0, total: 0 } } as ApiResponseList<T>);
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

        this.selection.toggle(row);
        //this.rowClick.emit({ row, selected: this.selection.isSelected(row) });

    }

    private initSelection() {
        const sidebar = this.route.snapshot.children
            .find((c: any) => c.outlet === 'sidebar');

        if (sidebar?.params['id']) {
            const primaryKey = this.meta?.entity?.primaryKey;

            if (!primaryKey) {
                return;
            }

            const row = this.dataSource.data.find(row => String(row[primaryKey]) === String(sidebar.params['id']));

            if (row) {
                this.selection.select(row);
                this.lastSelectedViaRouteItem = row;
                this.cdr.detectChanges()
            }
        } else if (this.lastSelectedViaRouteItem) {
            this.selection.deselect(this.lastSelectedViaRouteItem);
            this.lastSelectedViaRouteItem = undefined;
            this.cdr.detectChanges()
        }
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