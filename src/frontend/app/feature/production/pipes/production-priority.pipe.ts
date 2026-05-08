import { Pipe, PipeTransform, inject } from '@angular/core';
import { ProductionPriority } from '../../../../../shared/models/types';
import { TranslocoService } from '@jsverse/transloco';

@Pipe({
  name: 'productionPriority',
  standalone: true
})
export class ProductionPriorityPipe implements PipeTransform {
  private transloco = inject(TranslocoService);

  transform(priority: ProductionPriority): string {
    switch (priority) {
      case ProductionPriority.Low:
        return this.transloco.translate('ENUM.PRIORITY.LOW');
      case ProductionPriority.Normal:
        return this.transloco.translate('ENUM.PRIORITY.NORMAL');
      case ProductionPriority.High:
        return this.transloco.translate('ENUM.PRIORITY.HIGH');
      case ProductionPriority.Critical:
        return this.transloco.translate('ENUM.PRIORITY.CRITICAL');
      default:
        return String(priority);
    }
  }
}
