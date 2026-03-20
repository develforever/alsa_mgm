import { Component, computed, ContentChildren, EventEmitter, inject, Input, OnInit, Output, QueryList, ViewChild } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ApiResponse } from "../../../../../shared/api/ApiResponse";
import { YesNoDialogData } from "../../dialog/yes-no.dialog.component";
import { AppTableCellDefDirective } from "../AppTableCellDefDirective";
import { NavigationExtras, Router, RouterLink } from "@angular/router";
import { ListSidebarLayoutComponent } from "./smart-list/layout.component";
import { AppUiDataTableComponent, TableFetchOptions } from "../table.component";
import { MatButtonModule } from "@angular/material/button";


export interface INotifyChangeService {

    notifyChange(): void;
    notifyChange$: Observable<void>;
}

export interface ITableDataRowAddNavigationData<T extends Record<string, any>> {

    getRowAddNavigationData(): { commands: any[], extras?: NavigationExtras };

    getAddLabel(): string;
}

export interface ITableDataRowClickNavigationData<T extends Record<string, any>> {

    getRowClickNavigationData(row: T, selected: boolean): { commands: any[], extras?: NavigationExtras };
}

export interface ITableDataService<T extends Record<string, any>> {
    getList(page: number, size: number): Observable<ApiResponse<T>>;
}

/**
 * Example: 
 * 
<app-smart-list-layout #smartLayout [dataService]="dataTableService" [refresh$]="tableRefresh$" (rowClicked)="openSidebar($event)">
    <ng-template appTableCellDef="actions" let-row>
        <button matButton (click)="smartLayout.openDialog($event, row, toggleDialogData).then(toggleActive)">Zmień
        status</button>
        <button matButton
        (click)="smartLayout.openDialog($event, row, deleteDialogData).then(deleteProduct)">Usuń</button>
    </ng-template>
</app-smart-list-layout>

 */
@Component({
    selector: 'app-ui-data-layout-smart-list',
    templateUrl: './smart-list-layout.component.html',
    imports: [
        ListSidebarLayoutComponent,
        AppUiDataTableComponent,
        RouterLink,
        MatButtonModule
    ],
})
export class SmartListLayoutComponent<T extends Record<string, any>> implements OnInit {
    @ViewChild('myTable') myTable!: AppUiDataTableComponent<T>;
    @ContentChildren(AppTableCellDefDirective) externalCellDefs?: QueryList<AppTableCellDefDirective>;

    @Output() rowClicked = new EventEmitter<{ row: T, selected: boolean }>();

    @Input() dataService!: ITableDataService<T> & INotifyChangeService;

    tableRefresh$ = new Subject<void>();

    private router = inject(Router);


    ngOnInit(): void {

        this.dataService.notifyChange$.subscribe(() => {
            this.tableRefresh$.next();
        });

    }

    addLabel = computed(() => {
        if ('getAddLabel' in this.dataService) {
            return (this.dataService as unknown as ITableDataRowAddNavigationData<T>).getAddLabel();
        }
        return 'Add';
    });

    addRowNavigation = computed(() => {
        if ('getRowAddNavigationData' in this.dataService) {
            return (this.dataService as unknown as ITableDataRowAddNavigationData<T>).getRowAddNavigationData().commands;
        }
        return [];
    });


    fetchFn = (options: TableFetchOptions) => {
        return this.dataService.getList(options.page, options.limit);
    }


    onRowClick(event: { row: T, selected: boolean }) {

        if ('getRowClickNavigationData' in this.dataService) {
            const navigationData = (this.dataService as unknown as ITableDataRowClickNavigationData<T>).getRowClickNavigationData(event.row, event.selected);
            this.router.navigate(navigationData.commands, navigationData.extras);
        }

        this.rowClicked.emit(event);
    }


    openDialog($event: Event, row: T, dialogData: YesNoDialogData): Promise<[T, boolean]> {
        return this.myTable.openDialog($event, row, dialogData);
    }

}