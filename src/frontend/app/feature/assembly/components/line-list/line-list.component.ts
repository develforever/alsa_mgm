import { Component, inject } from '@angular/core';
import { DataAssemblyLineService } from './service/line.service';
import { SmartListLayoutComponent } from '../../../../ui/data/layout/smart-list-layout.component';

@Component({
  selector: 'app-assembly-line-list',
  imports: [SmartListLayoutComponent],
  templateUrl: './line-list.component.html',
})
export class LineListComponent {
  dataTableService = inject(DataAssemblyLineService);
}