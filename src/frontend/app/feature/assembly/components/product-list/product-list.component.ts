import { Component, inject } from '@angular/core';
import { DataProductService } from './service/product.service';
import { SmartListLayoutComponent } from '../../../../ui/data/layout/smart-list-layout.component';

@Component({
  selector: 'app-assembly-product-list',
  imports: [SmartListLayoutComponent],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent {
  dataTableService = inject(DataProductService);
}


