
import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../../services/data.service';
import { ALWStation } from '../../../../../../shared/models/types';

@Component({
  selector: 'assembly-workstation-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './workstation-list.component.html',
})
export class WorkstationListComponent implements OnInit {
  private dataService = inject(DataService);
  stations = signal<ALWStation[]>([]);
  newStation = { Name: '', ShortName: '', PCName: '', AutoStart: 0 };

  ngOnInit() { this.load(); }
  load() { this.dataService.getWorkstations().subscribe(d => this.stations.set(d)); }

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