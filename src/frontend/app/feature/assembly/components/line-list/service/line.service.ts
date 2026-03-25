import { Injectable } from '@angular/core';
import { ALAssLine, LineStatus } from '../../../../../../../shared/models/types';
import {
  ICrudService,
  ITableDataRowAddNavigationData,
  ITableDataRowClickNavigationData,
} from '../../../../../ui/data/layout/smart-list-layout.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AbstractCrudService } from '../../../../../services/crud.service';

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
    ITableDataRowAddNavigationData
{
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
