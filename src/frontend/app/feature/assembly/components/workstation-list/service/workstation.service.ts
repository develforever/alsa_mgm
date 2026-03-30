import { Injectable } from '@angular/core';
import { GetWorkstationsSchema, PatchWorkstationsSchema, PostWorkstationsSchema } from '../../../../../../../shared/api/workstation/schema';
import { ICrudService, ITableDataRowAddNavigationData, ITableDataRowClickNavigationData } from '../../../../../ui/data/layout/smart-list-layout.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AbstractCrudService } from '../../../../../services/crud.service';

@Injectable({
  providedIn: 'root'
})
export class DataWorkstationService extends AbstractCrudService<GetWorkstationsSchema, PostWorkstationsSchema, PatchWorkstationsSchema> implements ICrudService<GetWorkstationsSchema>,
  ITableDataRowClickNavigationData<GetWorkstationsSchema>,
  ITableDataRowAddNavigationData {

  constructor() {
    super('/workstations');
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
      ALWStationID: new FormControl({ value: 0, disabled: true }, [Validators.required]),
      Name: new FormControl('', [Validators.required]),
      ShortName: new FormControl('', [Validators.required]),
      PCName: new FormControl('', []),
      AutoStart: new FormControl<boolean>(false, { nonNullable: true, validators: [Validators.required] }),
      CreatedAt: new FormControl({ value: new Date(), disabled: true }, [Validators.required]),
      UpdatedAt: new FormControl({ value: new Date(), disabled: true }, [Validators.required]),
    });
  }

  getSidebarItemRoute(row: GetWorkstationsSchema): unknown[] {
    return ['selected', row.ALWStationID];
  }

  getSidebarAddRoute(): unknown[] {
    return ['add'];
  }

  getAddLabel(): string {
    return 'Add Workstation';
  }

  mapFormToModel(value: Record<string, unknown>): Record<string, unknown> {
    return {
      ...value,
      AutoStart: value['AutoStart'] ? 1 : 0,
    };
  }

  mapModelToForm(item: GetWorkstationsSchema): Record<string, unknown> {
    return {
      ...(item as unknown as Record<string, unknown>),
      AutoStart: item.AutoStart === 1
    };
  }
}
