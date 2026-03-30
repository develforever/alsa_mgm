import { Injectable } from '@angular/core';
import { GetAllocationsSchema, PatchAllocationsSchema, PostAllocationsSchema } from '../../../../../../../shared/api/allocation/schema';
import { ICrudService, ITableDataRowAddNavigationData, ITableDataRowClickNavigationData } from '../../../../../ui/data/layout/smart-list-layout.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AbstractCrudService, FieldConfig } from '../../../../../services/crud.service';
import { DataAssemblyLineService } from '../../line-list/service/line.service';
import { DataWorkstationService } from '../../workstation-list/service/workstation.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataAllocationService extends AbstractCrudService<GetAllocationsSchema, PostAllocationsSchema, PatchAllocationsSchema> implements ICrudService<GetAllocationsSchema>,
  ITableDataRowClickNavigationData<GetAllocationsSchema>,
  ITableDataRowAddNavigationData {

  private lineService = inject(DataAssemblyLineService);
  private workstationService = inject(DataWorkstationService);

  constructor() {
    super('/allocations');
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
      ALAssLineWStationAllocationID: new FormControl({ value: 0, disabled: true }, [Validators.required]),
      ALAssLineID: new FormControl<number | null>(null, [Validators.required]),
      ALWStationID: new FormControl<number | null>(null, [Validators.required]),
      Sort: new FormControl(0, [Validators.required]),
      CreatedAt: new FormControl({ value: new Date(), disabled: true }, [Validators.required]),
      UpdatedAt: new FormControl({ value: new Date(), disabled: true }, [Validators.required]),
    });
  }

  getFormConfig(): Record<string, FieldConfig> {
    return {
      ALAssLineID: {
        key: 'ALAssLineID',
        type: 'relation',
        label: 'Linia Montażowa',
        fetchFn: (query) => this.lineService.getAll(query).pipe(map(res => ('data' in res && Array.isArray(res.data)) ? res.data : [])),
        fetchByIdFn: (id) => this.lineService.getOne(id).pipe(map(res => ('data' in res) ? res.data : null)),
        displayKey: 'Name',
        valueKey: 'ALAssLineID',
        validations: {
          required: 'Wybranie linii montażowej jest obowiązkowe',
        }
      },
      ALWStationID: {
        key: 'ALWStationID',
        type: 'relation',
        label: 'Stanowisko Robocze',
        fetchFn: (query) => this.workstationService.getAll(query).pipe(map(res => ('data' in res && Array.isArray(res.data)) ? res.data : [])),
        fetchByIdFn: (id) => this.workstationService.getOne(id).pipe(map(res => ('data' in res) ? res.data : null)),
        displayKey: 'Name',
        valueKey: 'ALWStationID',
        validations: {
          required: 'Wybranie stanowiska roboczego jest obowiązkowe',
        }
      },
      Sort: {
        key: 'Sort',
        type: 'number',
        label: 'Kolejność',
        validations: {
          required: 'Kolejność jest wymagana',
        }
      }
    };
  }

  getSidebarItemRoute(row: GetAllocationsSchema): unknown[] {
    return ['selected', row.ALAssLineWStationAllocationID];
  }

  getSidebarAddRoute(): unknown[] {
    return ['add'];
  }

  getAddLabel(): string {
    return 'Add Allocation';
  }

  mapFormToModel(value: Record<string, unknown>): Record<string, unknown> {
    return value;
  }

  mapModelToForm(item: GetAllocationsSchema): Record<string, unknown> {
    return item as unknown as Record<string, unknown>;
  }

  // Preserve existing allocation-specific methods
  allocateWorkstation(lineId: number, stationId: number) {
    return this.create({ ALAssLineID: lineId, ALWStationID: stationId });
  }

  removeAllocations(ids: number[]) {
    return this.http.delete(`${this.getPath()}`, {
      params: {
        ids: ids.join(",")
      }
    });
  }
}
