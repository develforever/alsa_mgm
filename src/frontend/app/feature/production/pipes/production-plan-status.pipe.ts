import { Pipe, PipeTransform, inject } from '@angular/core';
import { ProductionPlanStatus } from '../../../../../shared/models/types';
import { TranslocoService } from '@jsverse/transloco';

@Pipe({
  name: 'productionPlanStatus',
  standalone: true
})
export class ProductionPlanStatusPipe implements PipeTransform {
  private transloco = inject(TranslocoService);

  transform(status: ProductionPlanStatus): string {
    switch (status) {
      case ProductionPlanStatus.Draft:
        return this.transloco.translate('ENUM.PLAN_STATUS.DRAFT');
      case ProductionPlanStatus.Scheduled:
        return this.transloco.translate('ENUM.PLAN_STATUS.SCHEDULED');
      case ProductionPlanStatus.InProgress:
        return this.transloco.translate('ENUM.PLAN_STATUS.IN_PROGRESS');
      case ProductionPlanStatus.Completed:
        return this.transloco.translate('ENUM.PLAN_STATUS.COMPLETED');
      case ProductionPlanStatus.Cancelled:
        return this.transloco.translate('ENUM.PLAN_STATUS.CANCELLED');
      default:
        return status;
    }
  }
}
