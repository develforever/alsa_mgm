import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DataAssemblyLineService } from './service/line.service';
import { SmartListLayoutComponent } from '../../../../ui/data/layout/smart-list-layout.component';
import { AppTableCellDefDirective } from '../../../../ui/data/AppTableCellDefDirective';

@Component({
  selector: 'app-assembly-line-list',
  standalone: true,
  imports: [SmartListLayoutComponent, AppTableCellDefDirective],
  templateUrl: './line-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineListComponent {
  protected readonly dataTableService = inject(DataAssemblyLineService);
}