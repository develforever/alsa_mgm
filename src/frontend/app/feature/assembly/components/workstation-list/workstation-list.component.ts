
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DataWorkstationService } from './service/workstation.service';
import { SmartListLayoutComponent } from '../../../../ui/data/layout/smart-list-layout.component';
import { AppTableCellDefDirective } from '../../../../ui/data/AppTableCellDefDirective';

@Component({
  selector: 'app-assembly-workstation-list',
  standalone: true,
  imports: [SmartListLayoutComponent, AppTableCellDefDirective],
  templateUrl: './workstation-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkstationListComponent {
  protected readonly dataTableService = inject(DataWorkstationService);
}