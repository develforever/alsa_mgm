
import { Injectable } from '@angular/core';
import { GetProductsSchema, PatchProductsSchema, PostProductsSchema } from '../../../../../../../shared/api/product/schema';
import { ICrudService, ITableDataRowAddNavigationData, ITableDataRowClickNavigationData } from '../../../../../ui/data/layout/smart-list-layout.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AbstractCrudService } from '../../../../../services/crud.service';


@Injectable({
  providedIn: 'root'
})
export class DataProductService extends AbstractCrudService<GetProductsSchema, PostProductsSchema, PatchProductsSchema> implements ICrudService<GetProductsSchema>,
  ITableDataRowClickNavigationData<GetProductsSchema>,
  ITableDataRowAddNavigationData {

  constructor() {
    super('/products');
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

  getFormGroup(): FormGroup {
    return new FormGroup({
      ProductID: new FormControl({ value: 0, disabled: true }, [Validators.required]),
      Name: new FormControl('', [Validators.required]),
      Active: new FormControl<boolean>(false, { nonNullable: true, validators: [Validators.required] }),
      CreatedAt: new FormControl({ value: new Date(), disabled: true }, [Validators.required]),
      UpdatedAt: new FormControl({ value: new Date(), disabled: true }, [Validators.required]),
    });
  }

  getSidebarItemRoute(row: GetProductsSchema): unknown[] {
    return ['selected', row.ProductID];
  }

  getSidebarAddRoute(): unknown[] {
    return ['add'];
  }

  getAddLabel(): string {
    return 'Add Product';
  }

  mapFormToModel(value: Record<string, unknown>): Record<string, unknown> {
    return {
      ...value,
      Active: value['Active'] ? 1 : 0,
    };
  }

  mapModelToForm(item: GetProductsSchema): Record<string, unknown> {
    return {
      ...(item as unknown as Record<string, unknown>),
      Active: item.Active === 1
    };
  }
}