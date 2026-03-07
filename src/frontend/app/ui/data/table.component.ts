

import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { catchError, Observable, of, startWith, switchMap } from 'rxjs';
import { ApiResponse } from '../../../../shared/api/ApiResponse';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    ],
})
export class AppUiDataTableComponent<T> implements AfterViewInit {
    @Input() pageSize = 10;
    @Input() displayedColumns: string[] = [];
    @Input({ required: true }) fetchFn!: TableFetchFn<T>;

    dataSource = new MatTableDataSource<T>([]);
    isLoading = true;
    totalElements = 0;

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngAfterViewInit() {
        this.paginator.page.pipe(
            startWith({}),
            switchMap(() => {
                this.isLoading = true;
                const options: TableFetchOptions = {
                    page: this.paginator.pageIndex,
                    limit: this.paginator.pageSize
                };
                return this.fetchFn(options).pipe(catchError(() => of({ data: [], total: 0 })));
            })
        ).subscribe(data => {

            const rows = Array.isArray(data.data) ? data.data : [data.data];

            this.dataSource.data = rows;
            this.totalElements = data.total;
            this.isLoading = false;
        });
    }
}