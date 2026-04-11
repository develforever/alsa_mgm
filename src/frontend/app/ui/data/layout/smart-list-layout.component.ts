import { AfterViewInit, Component, computed, ContentChildren, EventEmitter, inject, Input, OnInit, Output, QueryList, ViewChild, OnDestroy } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ApiResponse, ApiResponseInfo, ApiResponseSingle } from "../../../../../shared/api/ApiResponse";
import { YesNoDialogData } from "../../dialog/yes-no.dialog.component";
import { AppTableCellDefDirective } from "../AppTableCellDefDirective";
import { Router, RouterLink } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { Crud_Form_Context, FieldConfig } from "../../../services/crud.service";
import { LayoutComponent } from "./smart-list/layout.component";
import { AppUiDataTableComponent, TableFetchOptions } from "../table.component";
import { MatButtonModule } from "@angular/material/button";
import { SmartListService } from "./smart-list/smart-list.service";
import { ExportButtonComponent, ExportableColumn } from "../../export-button/export-button.component";
import { ContextMenuProvider, ContextMenuAction, ContextMenuContext } from "../../context-menu/context-menu-config.interface";
import { ContextMenuServiceImpl } from "../../context-menu/context-menu.service";
import { MatDialog } from "@angular/material/dialog";
import { ContextMenuDialogComponent, ContextMenuDialogData } from "../../context-menu/context-menu-dialog.component";
import { SimpleContextMenuComponent } from "../../context-menu/simple-context-menu.component";
import { ContextMenuTriggerService } from "../../context-menu/context-menu-trigger.service";

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
    getList(page: number, size: number, filter?: string): Observable<ApiResponse<T>>;
    getAll(filter?: string): Observable<ApiResponse<T>>;
}

export interface ICrudService<T extends object> extends ITableDataService<T>, INotifyChangeService {
    getOne(id: string | number): Observable<ApiResponseSingle<T>>;
    create(data: unknown): Observable<ApiResponse<T>>;
    update(id: string | number, data: unknown): Observable<ApiResponseSingle<T>>;
    delete(id: string | number): Observable<ApiResponse<ApiResponseInfo>>;

    getListViewCommands(): unknown[];
    getSidebarBaseRoute(): string;
    getItemEditRoute(id: string | number): unknown[];
    getFormGroup(context?: Crud_Form_Context): FormGroup;
    getFormConfig?(context?: Crud_Form_Context): Record<string, FieldConfig>;
    mapFormToModel?(value: Record<string, unknown>): Record<string, unknown>;
    mapModelToForm?(item: T): Record<string, unknown>;
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
        MatButtonModule,
        ExportButtonComponent,
        SimpleContextMenuComponent
    ],
})
export class SmartListLayoutComponent<T extends object> implements OnInit, AfterViewInit, OnDestroy, ContextMenuProvider {
    @ViewChild('myTable') myTable!: AppUiDataTableComponent<T>;
    @ContentChildren(AppTableCellDefDirective) externalCellDefs?: QueryList<AppTableCellDefDirective>;

    @Output() rowClicked = new EventEmitter<{ row: T, selected: boolean }>();

    @Input() dataService!: ICrudService<T>;
    @Input() exportData: T[] = [];
    @Input() exportColumns: ExportableColumn<T>[] = [];
    @Input() exportFilename = 'export.csv';

    tableRefresh$ = new Subject<void>();

    private router = inject(Router);
    private smartListService = inject(SmartListService);
    private contextMenuService = inject(ContextMenuServiceImpl);
    private dialog = inject(MatDialog);
    private triggerService = inject(ContextMenuTriggerService);
    private destroy$ = new Subject<void>();


    ngOnInit(): void {
        this.smartListService.setDataService(this.dataService);

        // Calculate base route (current URL without outlets)
        const baseRoute = this.router.url.split('(')[0];
        this.smartListService.baseRoute.set(baseRoute);

        this.dataService.notifyChange$.subscribe(() => {
            this.tableRefresh$.next();
        });

        // Register as context menu provider
        this.contextMenuService.registerProvider(this);
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
        return this.dataService.getList(options.page, options.limit, options.filter);
    }


    onRowClick(event: { row: T, selected: boolean }) {
        const baseRoute = this.smartListService.baseRoute();
        const selectedCount = this.myTable.selection.selected.length;

        if (selectedCount <= 1 && 'getSidebarItemRoute' in this.dataService) {
            const sidebarRoute = (this.dataService as unknown as ITableDataRowClickNavigationData<T>).getSidebarItemRoute(event.row);
            this.router.navigate([baseRoute, { outlets: { sidebar: sidebarRoute } }]);
        } else {
            this.router.navigate([baseRoute, { outlets: { sidebar: null } }]);
        }

        this.rowClicked.emit(event);
    }


    openDialog($event: Event, row: T, dialogData: YesNoDialogData): Promise<[T, boolean]> {
        return this.myTable.openDialog($event, row, dialogData);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.contextMenuService.unregisterProvider(this.getProviderId());
    }

    // ContextMenuProvider implementation
    getProviderId(): string {
        return `smart-list-${this.smartListService.baseRoute()}`;
    }

    getProviderName(): string {
        return `SmartList: ${this.smartListService.baseRoute()}`;
    }

    getSupportedContextTypes(): string[] {
        return ['table-row'];
    }

    getContextMenuActions(context: ContextMenuContext): ContextMenuAction[] {
        if (context.type !== 'table-row' || !context.data) {
            return [];
        }

        const row = context.data as T;
        const actions: ContextMenuAction[] = [];

        // Add edit action if service supports it
        if ('getItemEditRoute' in this.dataService) {
            actions.push({
                id: 'edit-row',
                label: 'Edytuj',
                icon: 'edit',
                contextType: 'table-row',
                handler: () => {
                    const baseRoute = this.smartListService.baseRoute();
                    const primaryKey = this.getPrimaryKey(row);
                    if (primaryKey) {
                        const id = (row as Record<string, unknown>)[primaryKey] as string | number;
                        const editRoute = (this.dataService as ICrudService<T>).getItemEditRoute(id);
                        this.router.navigate([baseRoute, { outlets: { sidebar: editRoute } }]);
                    }
                }
            });
        }

        // Add delete action
        actions.push({
            id: 'delete-row',
            label: 'Usuń',
            icon: 'delete',
            contextType: 'table-row',
            handler: async () => {
                const primaryKey = this.getPrimaryKey(row);
                if (primaryKey) {
                    const id = (row as Record<string, unknown>)[primaryKey] as string | number;
                    const dialogData: YesNoDialogData = {
                        title: 'Potwierdzenie usunięcia',
                        content: 'Czy na pewno chcesz usunąć ten element?'
                    };
                    
                    const result = await this.openDialog(new Event('click'), row, dialogData);
                    if (result[1]) {
                        this.dataService.delete(id).subscribe(() => {
                            this.tableRefresh$.next();
                        });
                    }
                }
            }
        });

        // Add configure menu action
        actions.push({
            id: 'configure-menu',
            label: 'Konfiguruj menu',
            icon: 'settings',
            contextType: 'table-row',
            separator: true,
            handler: () => {
                this.openContextMenuDialog('table-row');
            }
        });

        return actions;
    }

    private getPrimaryKey(row: T): string | null {
        const keys = Object.keys(row);
        // Common primary key names
        const primaryKeyNames = ['id', 'Id', 'ID', 'uuid', 'UUID'];
        
        for (const pkName of primaryKeyNames) {
            if (keys.includes(pkName)) {
                return pkName;
            }
        }
        
        // If no common key found, use first key
        return keys.length > 0 ? keys[0] : null;
    }

    private openContextMenuDialog(contextType: string): void {
        const availableActions = this.getContextMenuActions({ 
            element: document.createElement('div'), 
            type: contextType,
            data: null 
        });
        
        const currentVisibleActions = this.contextMenuService.getActionsForContext({
            element: document.createElement('div'),
            type: contextType,
            data: null
        }).map(a => a.id);
        
        const dialogData: ContextMenuDialogData = {
            contextType,
            availableActions,
            currentVisibleActions
        };
        
        this.dialog.open(ContextMenuDialogComponent, {
            width: '600px',
            maxWidth: '90vw',
            data: dialogData
        });
    }

    handleContextMenu(detail: { context: ContextMenuContext; actions: ContextMenuAction[]; position: { x: number; y: number } }): void {
        if (detail.actions.length > 0) {
            this.triggerService.trigger({
                context: detail.context,
                actions: detail.actions,
                position: { x: detail.position.x, y: detail.position.y }
            });
        }
    }

}