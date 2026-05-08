import { Injectable, inject } from '@angular/core';
import { LineStatus } from '../../../../../../../shared/models/types';
import {
  ICrudService,
  ITableDataRowAddNavigationData,
  ITableDataRowClickNavigationData,
} from '../../../../../ui/data/layout/smart-list-layout.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AbstractCrudService, FieldConfig } from '../../../../../services/crud.service';
import { DataProductService } from '../../product-list/service/product.service';
import { map } from 'rxjs';
import { GetLineSchema, PatchLinesSchema, PostLinesSchema } from '../../../../../../../shared/api/line/schema';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root',
})
export class DataAssemblyLineService
  extends AbstractCrudService<GetLineSchema, PostLinesSchema, PatchLinesSchema>
  implements
  ICrudService<GetLineSchema>,
  ITableDataRowClickNavigationData<GetLineSchema>,
  ITableDataRowAddNavigationData {

  private productService = inject(DataProductService);
  private transloco = inject(TranslocoService);

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

  getFormGroup(): FormGroup {
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

  getFormConfig(): Record<string, FieldConfig> {
    return {
      Name: {
        key: 'Name',
        type: 'text',
        label: this.transloco.translate('ASSEMBLY.FORM.LINE_NAME'),
        validations: {
          required: this.transloco.translate('ASSEMBLY.FORM.LINE_NAME_REQUIRED'),
        }
      },
      Status: {
        key: 'Status',
        type: 'toggle',
        label: this.transloco.translate('ASSEMBLY.FORM.LINE_STATUS'),
      },
      ProductID: {
        key: 'ProductID',
        type: 'relation',
        label: this.transloco.translate('ASSEMBLY.FORM.LINE_PRODUCT'),
        fetchFn: (query) => this.productService.getAll(query).pipe(map(res => ('data' in res && Array.isArray(res.data)) ? res.data : [])),
        fetchByIdFn: (id) => this.productService.getOne(id).pipe(map(res => ('data' in res) ? res.data : null)),
        displayKey: 'Name',
        valueKey: 'ProductID',
        validations: {
          required: this.transloco.translate('ASSEMBLY.FORM.LINE_PRODUCT_REQUIRED'),
        }
      }
    };
  }

  mapFormToModel(value: Record<string, unknown>): Record<string, unknown> {
    return {
      ...value,
      Status: value['Status'] ? 1 : 2, // Active = 1, Locked = 2
    };
  }

  mapModelToForm(item: GetLineSchema): Record<string, unknown> {
    return {
      ...(item as unknown as Record<string, unknown>),
      Status: item.Status === 1
    };
  }

  getSidebarItemRoute(row: GetLineSchema): unknown[] {
    return ['selected', row.ALAssLineID];
  }

  getSidebarAddRoute(): unknown[] {
    return ['add'];
  }

  getAddLabel(): string {
    return this.transloco.translate('ASSEMBLY.ADD_LINE');
  }
}
