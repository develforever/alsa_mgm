import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DataAssemblyLineService } from './service/line.service';
import { SmartListLayoutComponent } from '../../../../ui/data/layout/smart-list-layout.component';
import { AppTableCellDefDirective } from '../../../../ui/data/AppTableCellDefDirective';

import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-assembly-line-list',
  standalone: true,
  imports: [SmartListLayoutComponent, AppTableCellDefDirective, TranslocoModule],
  templateUrl: './line-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineListComponent {
  protected readonly dataTableService = inject(DataAssemblyLineService);
}