import { Injectable } from '@angular/core';
import { ALAssLine, LineStatus } from '../../../../../../../shared/models/types';
import {
  ICrudService,
  ITableDataRowAddNavigationData,
  ITableDataRowClickNavigationData,
} from '../../../../../ui/data/layout/smart-list-layout.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AbstractCrudService, Crud_Form_Context, FieldConfig } from '../../../../../services/crud.service';
import { DataProductService } from '../../product-list/service/product.service';
import { map } from 'rxjs';
import { inject } from '@angular/core';

export type PostLineSchema = Pick<ALAssLine, 'ProductID' | 'Name' | 'Status'>;
export type PatchLineSchema = Partial<PostLineSchema>;

@Injectable({
  providedIn: 'root',
})
export class DataAssemblyLineService
  extends AbstractCrudService<ALAssLine, PostLineSchema, PatchLineSchema>
  implements
  ICrudService<ALAssLine>,
  ITableDataRowClickNavigationData<ALAssLine>,
  ITableDataRowAddNavigationData {

  private productService = inject(DataProductService);

  constructor() {
    super('/lines');
  }

  getListViewCommands(): unknown[] {
    return [this.getSidebarBaseRoute()];
  }

  getSidebarBaseRoute(): string {
    return `/assembly/${this.apiEntityUrl}`;
  }

  getItemEditRoute(id: string | number): unknown[] {
    return ['edit', id];
  }

  getFormGroup(context?: Crud_Form_Context): FormGroup {

    return new FormGroup({
      ALAssLineID: new FormControl({ value: 0, disabled: true }, [Validators.required]),
      Name: new FormControl('', [Validators.required]),
      ProductID: new FormControl<number | null>(null, [Validators.required]),
      Status: new FormControl<LineStatus>(LineStatus.Active, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  getFormConfig(context?: Crud_Form_Context): Record<string, FieldConfig> {
    return {
      ProductID: {
        key: 'ProductID',
        type: 'relation',
        label: 'Wybierz Produkt',
        displayKey: 'Name',
        valueKey: 'ProductID',
        fetchFn: (query: string) => this.productService.getList(1, 100, query).pipe(map(res => {
          const items = ('data' in res && Array.isArray(res.data)) ? res.data : [];
          if (!query) return items;
          return items.filter((p: unknown) => {
            const pName = (p as { Name: string }).Name;
            return pName?.toLowerCase().includes(query.toLowerCase());
          });
        })),
        fetchByIdFn: (id: number) => this.productService.getOne(id).pipe(map(res => ('data' in res ? res.data : undefined)))
      }
    };
  }

  getSidebarItemRoute(row: ALAssLine): unknown[] {
    return ['selected', row.ALAssLineID];
  }

  getSidebarAddRoute(): unknown[] {
    return ['add'];
  }

  getAddLabel(): string {
    return 'Add Line';
  }
}
