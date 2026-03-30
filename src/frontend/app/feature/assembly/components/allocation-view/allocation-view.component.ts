import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DataAllocationService } from './service/allocation.service';
import { SmartListLayoutComponent } from '../../../../ui/data/layout/smart-list-layout.component';
import { AppTableCellDefDirective } from '../../../../ui/data/AppTableCellDefDirective';

@Component({
  selector: 'app-assembly-allocation-view',
  standalone: true,
  imports: [SmartListLayoutComponent, AppTableCellDefDirective],
  templateUrl: './allocation-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllocationViewComponent {
  protected readonly dataTableService = inject(DataAllocationService);
}