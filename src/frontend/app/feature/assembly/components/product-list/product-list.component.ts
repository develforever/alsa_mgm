
import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataProductService } from '../../../../services/data/product.service';
import { TableFetchOptions } from '../../../../ui/data/table.component';
import { AppUiDataTableComponent } from '../../../../ui/data/table.component';
import { GetProductsSchema } from '../../../../../../shared/api/product/schema';
import { buildArray } from '../../../../utils/table.utils';
import { AppTableCellDefDirective } from '../../../../ui/data/AppTableCellDefDirective';
import { Subject } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { YesNoDialogComponent } from '../../../../ui/dialog/yes-no.dialog.component';

@Component({
  selector: 'assembly-product-list',
  imports: [CommonModule, FormsModule, AppUiDataTableComponent, AppTableCellDefDirective, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {

  tableRefresh$ = new Subject<void>();
  private dataService = inject(DataProductService);

  products = signal<GetProductsSchema[]>([]);
  newProductName = '';

  displayedColumns = buildArray<GetProductsSchema, 'actions'>(
    ['ProductID', 'Name', 'Active', 'CreatedAt', 'UpdatedAt'],
    ['actions']
  );
  fetchProducts = (options: TableFetchOptions) => {
    return this.dataService.getProducts(options.page, options.limit);
  };

  readonly dialog = inject(MatDialog);


  ngOnInit(): void {

  }


  addProduct() {
    if (!this.newProductName.trim()) return;

    const productData = { Name: this.newProductName, Active: 1 };
    this.dataService.addProduct(productData).subscribe(() => {
      this.newProductName = '';
      this.tableRefresh$.next();
    });
  }

  toggleActive(product: GetProductsSchema) {

    this.dialog.open(YesNoDialogComponent, {
      data: {
        title: 'Toggle active/inactive',
        content: 'Are you sure you want to toggle active status?'
      }
    }).afterClosed().subscribe((result) => {
      if (!result) return;
      const updated = { Name: product.Name, Active: product.Active === 1 ? 0 : 1 };
      this.dataService.updateProduct(product.ProductID, updated).subscribe(() => {
        this.tableRefresh$.next();
      });

    });


  }

  deleteProduct(product: GetProductsSchema) {
    this.dialog.open(YesNoDialogComponent, {
      data: {
        title: 'Delete product',
        content: 'Are you sure you want to delete this product?'
      }
    }).afterClosed().subscribe((result) => {
      if (!result) return;
      this.dataService.deleteProduct(product.ProductID).subscribe(() => {
        this.tableRefresh$.next();
      });
    });
  }
}


