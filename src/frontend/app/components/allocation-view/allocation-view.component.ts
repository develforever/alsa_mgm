// frontend/src/app/components/allocation-view/allocation-view.component.ts
import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Allocation, ALAssLine, ALWStation } from '../../models/types';

@Component({
  selector: 'app-allocation-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './allocation-view.component.html',
  styleUrls: ['./allocation-view.component.scss']
})
export class AllocationViewComponent implements OnInit {
  private dataService = inject(DataService);

  // Dane z API
  allocations = signal<Allocation[]>([]);
  lines = signal<ALAssLine[]>([]);
  stations = signal<ALWStation[]>([]);

  // Formularz nowej alokacji
  selectedLineId: number | null = null;
  selectedStationId: number | null = null;

  // Filtrowanie i masowe usuwanie
  filterText = signal('');
  selectedIds = new Set<number>();

  // Reaktywne filtrowanie tabeli (na Frontendzie dla szybkości)
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
    this.dataService.getAllocations().subscribe(d => this.allocations.set(d));
    this.dataService.getLines().subscribe(d => this.lines.set(d));
    this.dataService.getWorkstations().subscribe(d => this.stations.set(d));
  }

  save() {
    if (this.selectedLineId && this.selectedStationId) {
      this.dataService.allocateWorkstation(this.selectedLineId, this.selectedStationId)
        .subscribe(() => {
          this.loadAll();
          this.selectedStationId = null; // Reset stacji dla wygody
        });
    }
  }

  toggleSelect(id: number) {
    this.selectedIds.has(id) ? this.selectedIds.delete(id) : this.selectedIds.add(id);
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