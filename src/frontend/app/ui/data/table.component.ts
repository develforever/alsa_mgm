

import { AfterViewInit, ChangeDetectorRef, Component, ContentChildren, inject, Input, QueryList, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { catchError, merge, Observable, of, startWith, Subject, switchMap } from 'rxjs';
import { ApiResponse, ApiResponseList, ApiResponseSingle } from '../../../../shared/api/ApiResponse';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AppTableCellDefDirective } from './AppTableCellDefDirective';

export interface TableFetchOptions {
    page: number;
    limit: number;
}

export type TableFetchFn<T> = (options: TableFetchOptions) => Observable<ApiResponse<T>>;


@Component({
    selector: 'app-ui-data-table-component',
    templateUrl: './table-component.html',
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatCheckboxModule,
    ],
})
export class AppUiDataTableComponent<T> implements AfterViewInit {

    @Input() refresh$ = new Subject<void>();

    @Input() pageSize = 10;
    @Input() displayedColumns: string[] = [];
    @Input({ required: true }) fetchFn!: TableFetchFn<T>;

    selection = new SelectionModel<T>(true, []);
    private cdr = inject(ChangeDetectorRef);
    dataSource = new MatTableDataSource<T>([]);
    isLoading = true;
    totalElements = 0;

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    // Zbieramy wszystkie własne definicje z wnętrza <app-ui-data-table>
    @ContentChildren(AppTableCellDefDirective)
    customCellDefs!: QueryList<AppTableCellDefDirective>;
    // Funkcja pomocnicza znajdująca szablon dla danej kolumny
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
                return this.fetchFn(options).pipe(
                    catchError((err): Observable<ApiResponse<T>> => {
                        console.error(err);
                        return of({ data: [], total: 0 } as ApiResponseList<T>);
                    })
                );
            })
        ).subscribe(data => {

            if ('message' in data && 'code' in data && !('data' in data)) {
                console.error('Błąd API:', data.message);
                this.isLoading = false;
                return;
            }

            const response = data as ApiResponseList<T> | ApiResponseSingle<T>;

            const rows = Array.isArray(response.data) ? response.data : [response.data];

            this.dataSource.data = rows;
            this.totalElements = ('total' in response) ? response.total : rows.length;
            this.isLoading = false;
            this.cdr.detectChanges();
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
}