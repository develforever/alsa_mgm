import { Pipe, PipeTransform } from '@angular/core';
import { ProductionPriority } from '../../../../../shared/models/types';

@Pipe({
  name: 'productionPriority',
  standalone: true
})
export class ProductionPriorityPipe implements PipeTransform {
  transform(priority: ProductionPriority): string {
    switch (priority) {
      case ProductionPriority.Low:
        return 'Niski';
      case ProductionPriority.Normal:
        return 'Normalny';
      case ProductionPriority.High:
        return 'Wysoki';
      case ProductionPriority.Critical:
        return 'Krytyczny';
      default:
        return String(priority);
    }
  }
}
