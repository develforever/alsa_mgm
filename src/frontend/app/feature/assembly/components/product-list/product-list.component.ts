
import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataProductService, ITbleDataProductService } from '../../../../services/data/product.service';
import { GetProductsSchema } from '../../../../../../shared/api/product/schema';
import { Subject } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { SmartListLayoutComponent } from "../../../../ui/data/layout/smart-list-layout.component";

@Component({
  selector: 'app-assembly-product-list',
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, RouterModule, SmartListLayoutComponent],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {

  private router = inject(Router);
  tableRefresh$ = new Subject<void>();

  dataTableService = inject(ITbleDataProductService);

  products = signal<GetProductsSchema[]>([]);

  toggleDialogData = { title: 'Zmiana statusu', content: 'Na pewno?' }
  deleteDialogData = { title: 'Usuwanie', content: 'Na pewno?' }

  dataServiceRefresh$ = inject(DataProductService).refresh$;


  ngOnInit(): void {
    this.dataServiceRefresh$.subscribe(() => {
      this.tableRefresh$.next();
    });

  }

  readonly dialog = inject(MatDialog);

  openSidebar(event: { row: GetProductsSchema, selected: boolean }) {
    if (event.selected) {
      this.router.navigate(['/assembly/products', { outlets: { sidebar: ['selected', event.row.ProductID] } }]);
    } else {
      this.router.navigate(['/assembly/products', { outlets: { sidebar: null } }]);
    }
  }

  toggleActive = ([row, result]: [GetProductsSchema, boolean]) => {
    if (!result) return;
    const updated = { Name: row.Name, Active: row.Active === 1 ? 0 : 1 };
    this.dataTableService.updateProduct(row.ProductID, updated).subscribe(() => {
      this.tableRefresh$.next();
    });

  }

  deleteProduct = ([row, result]: [GetProductsSchema, boolean]) => {
    if (!result) return;
    this.dataTableService.deleteProduct(row.ProductID).subscribe(() => {
      this.tableRefresh$.next();
      this.router.navigate(['/assembly/products', { outlets: { sidebar: null } }]);
    });
  }
}


