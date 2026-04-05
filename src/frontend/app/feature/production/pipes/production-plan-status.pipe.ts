import { Pipe, PipeTransform } from '@angular/core';
import { ProductionPlanStatus } from '../../../../../shared/models/types';

@Pipe({
  name: 'productionPlanStatus',
  standalone: true
})
export class ProductionPlanStatusPipe implements PipeTransform {
  transform(status: ProductionPlanStatus): string {
    switch (status) {
      case ProductionPlanStatus.Draft:
        return 'Szkic';
      case ProductionPlanStatus.Scheduled:
        return 'Zaplanowane';
      case ProductionPlanStatus.InProgress:
        return 'W trakcie';
      case ProductionPlanStatus.Completed:
        return 'Zakończone';
      case ProductionPlanStatus.Cancelled:
        return 'Anulowane';
      default:
        return status;
    }
  }
}
