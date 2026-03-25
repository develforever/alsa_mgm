import { AfterViewInit, Component, computed, ContentChildren, EventEmitter, inject, Input, OnInit, Output, QueryList, ViewChild } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ApiResponse, ApiResponseInfo, ApiResponseSingle } from "../../../../../shared/api/ApiResponse";
import { YesNoDialogData } from "../../dialog/yes-no.dialog.component";
import { AppTableCellDefDirective } from "../AppTableCellDefDirective";
import { Router, RouterLink } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { LayoutComponent } from "./smart-list/layout.component";
import { AppUiDataTableComponent, TableFetchOptions } from "../table.component";
import { MatButtonModule } from "@angular/material/button";
import { SmartListService } from "./smart-list/smart-list.service";

export interface INotifyChangeService {

    notifyChange(): void;
    notifyChange$: Observable<void>;
}

export interface ITableDataRowAddNavigationData {
    getSidebarAddRoute(): unknown[];
    getAddLabel(): string;
}

export interface ITableDataRowClickNavigationData<T extends object> {
    getSidebarItemRoute(row: T): unknown[];
}

export interface ITableDataService<T extends object> {
    getList(page: number, size: number): Observable<ApiResponse<T>>;
    getAll(): Observable<ApiResponse<T>>;
}

export interface ICrudService<T extends object> extends ITableDataService<T>, INotifyChangeService {
    getOne(id: string | number): Observable<ApiResponseSingle<T>>;
    create(data: unknown): Observable<ApiResponse<T>>;
    update(id: string | number, data: unknown): Observable<ApiResponseSingle<T>>;
    delete(id: string | number): Observable<ApiResponse<ApiResponseInfo>>;

    getListViewCommands(): unknown[];
    getSidebarBaseRoute(): string;
    getItemEditRoute(id: string | number): unknown[];
    getFormGroup(): FormGroup;
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
    providers: [SmartListService],
    imports: [
        LayoutComponent,
        AppUiDataTableComponent,
        RouterLink,
        MatButtonModule
    ],
})
export class SmartListLayoutComponent<T extends object> implements OnInit, AfterViewInit {
    @ViewChild('myTable') myTable!: AppUiDataTableComponent<T>;
    @ContentChildren(AppTableCellDefDirective) externalCellDefs?: QueryList<AppTableCellDefDirective>;

    @Output() rowClicked = new EventEmitter<{ row: T, selected: boolean }>();

    @Input() dataService!: ICrudService<T>;

    tableRefresh$ = new Subject<void>();

    private router = inject(Router);
    private smartListService = inject(SmartListService);


    ngOnInit(): void {
        this.smartListService.setDataService(this.dataService);

        // Calculate base route (current URL without outlets)
        const baseRoute = this.router.url.split('(')[0];
        this.smartListService.baseRoute.set(baseRoute);

        this.dataService.notifyChange$.subscribe(() => {
            this.tableRefresh$.next();
        });
    }

    ngAfterViewInit(): void {
        this.myTable.selection.changed.subscribe(() => {
            if (this.myTable.selection.selected.length > 1) {
                const baseRoute = this.smartListService.baseRoute();
                this.router.navigate([baseRoute, { outlets: { sidebar: null } }]);
            }
        });
    }

    addLabel = computed(() => {
        if ('getAddLabel' in this.dataService) {
            return (this.dataService as unknown as ITableDataRowAddNavigationData).getAddLabel();
        }
        return 'Add';
    });

    addRowNavigation = computed(() => {
        if ('getSidebarAddRoute' in this.dataService) {
            const sidebarRoute = (this.dataService as unknown as ITableDataRowAddNavigationData).getSidebarAddRoute();
            return [this.smartListService.baseRoute(), { outlets: { sidebar: sidebarRoute } }];
        }
        return [];
    });


    fetchFn = (options: TableFetchOptions) => {
        return this.dataService.getList(options.page, options.limit);
    }


    onRowClick(event: { row: T, selected: boolean }) {
        const baseRoute = this.smartListService.baseRoute();
        const selectedCount = this.myTable.selection.selected.length;

        if (selectedCount <= 1 && 'getSidebarItemRoute' in this.dataService) {
            const sidebarRoute = (this.dataService as unknown as ITableDataRowClickNavigationData<T>).getSidebarItemRoute(event.row);
            console.log(sidebarRoute, baseRoute);
            this.router.navigate([baseRoute, { outlets: { sidebar: sidebarRoute } }]);
        } else {
            this.router.navigate([baseRoute, { outlets: { sidebar: null } }]);
        }

        this.rowClicked.emit(event);
    }


    openDialog($event: Event, row: T, dialogData: YesNoDialogData): Promise<[T, boolean]> {
        return this.myTable.openDialog($event, row, dialogData);
    }

}