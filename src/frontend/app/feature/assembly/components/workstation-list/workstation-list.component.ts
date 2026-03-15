
import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataWorkstationService } from '../../../../services/data/workstation.service';
import { ALWStation } from '../../../../../../shared/models/types';
import { ensureArray } from '../../../../utils/api.utils';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-assembly-workstation-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './workstation-list.component.html',
})
export class WorkstationListComponent implements OnInit {
  private dataService = inject(DataWorkstationService);
  stations = signal<ALWStation[]>([]);
  newStation = { Name: '', ShortName: '', PCName: '', AutoStart: 0 };

  ngOnInit() { this.load(); }
  load() {

    forkJoin({
      stations: this.dataService.getWorkstations().pipe(ensureArray<ALWStation>()),
    }).subscribe(({ stations }) => {
      this.stations.set(stations);
    });

  }

  addStation() {
    this.dataService.addWorkstation(this.newStation).subscribe(() => {
      this.load();
      this.newStation = { Name: '', ShortName: '', PCName: '', AutoStart: 0 };
    });
  }

  deleteStation(id: number) {
    if (confirm('Are youe sure?')) {
      this.dataService.deleteWorkstation(id).subscribe(() => this.load());
    }
  }
}