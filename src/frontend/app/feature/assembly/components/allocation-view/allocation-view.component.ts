
import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Allocation, ALWStation } from '../../../../../../shared/models/types';
import { GetLinesSchema } from '../../../../../../shared/api/line/schema';
import { DataAllocationService } from '../../../../services/data/allocation.service';
import { DataWorkstationService } from '../../../../services/data/workstation.service';
import { forkJoin } from 'rxjs';
import { ensureArray } from '../../../../utils/api.utils';
import { DataAssemblyLineService } from '../line-list/service/line.service';

@Component({
  selector: 'app-assembly-allocation-view',
  imports: [CommonModule, FormsModule],
  templateUrl: './allocation-view.component.html',
  styleUrls: ['./allocation-view.component.scss']
})
export class AllocationViewComponent implements OnInit {
  private dataService = inject(DataAllocationService);
  private dataLineService = inject(DataAssemblyLineService);
  private dataStationService = inject(DataWorkstationService);

  allocations = signal<Allocation[]>([]);
  lines = signal<GetLinesSchema[]>([]);
  stations = signal<ALWStation[]>([]);

  selectedLineId: number | null = null;
  selectedStationId: number | null = null;

  filterText = signal('');
  selectedIds = new Set<number>();

  filteredData = computed(() => {
    const term = this.filterText().toLowerCase();
    return this.allocations().filter(a =>
      a.assemblyLine?.Name.toLowerCase().includes(term) ||
      a.workstation?.Name.toLowerCase().includes(term) ||
      a.assemblyLine?.product?.Name.toLowerCase().includes(term)
    );
  });

  ngOnInit() { this.loadAll(); }

  loadAll() {
    forkJoin({
      allocations: this.dataService.getAllocations().pipe(ensureArray<Allocation>()),
      lines: this.dataLineService.getAll().pipe(ensureArray<GetLinesSchema>()),
      stations: this.dataStationService.getWorkstations().pipe(ensureArray<ALWStation>())
    }).subscribe(({ allocations, lines, stations }) => {
      this.allocations.set(allocations);
      this.lines.set(lines);
      this.stations.set(stations);
    });
  }

  save() {
    if (this.selectedLineId && this.selectedStationId) {
      this.dataService.allocateWorkstation(this.selectedLineId, this.selectedStationId)
        .subscribe(() => {
          this.loadAll();
          this.selectedStationId = null;
          this.selectedLineId = null;
        });
    }
  }

  toggleSelect(id: number) {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
  }

  deleteMultiple() {
    if (this.selectedIds.size === 0) return;
    const ids = Array.from(this.selectedIds);
    this.dataService.removeAllocations(ids).subscribe(() => {
      this.selectedIds.clear();
      this.loadAll();
    });
  }
}