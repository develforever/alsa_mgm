
import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataProductService } from '../../../../services/data/product.service';
import { TableFetchOptions } from '../../../../ui/data/table.component';
import { AppUiDataTableComponent } from '../../../../ui/data/table.component';
import { GetProductsSchema } from '../../../../../../shared/api/product/schema';
import { AppTableCellDefDirective } from '../../../../ui/data/AppTableCellDefDirective';
import { Subject } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { AppUiDialogYesNoComponent } from '../../../../ui/dialog/yes-no.dialog.component';

@Component({
  selector: 'app-assembly-product-list',
  imports: [CommonModule, FormsModule, AppUiDataTableComponent, AppTableCellDefDirective, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {

  tableRefresh$ = new Subject<void>();
  private dataService = inject(DataProductService);

  products = signal<GetProductsSchema[]>([]);
  newProductName = '';

  toggleDialogData = { title: 'Zmiana statusu', content: 'Na pewno?' }
  deleteDialogData = { title: 'Usuwanie', content: 'Na pewno?' }

  fetchProducts = (options: TableFetchOptions) => {
    return this.dataService.getProducts(options.page, options.limit);
  };

  readonly dialog = inject(MatDialog);



  addProduct() {
    if (!this.newProductName.trim()) return;

    const productData = { Name: this.newProductName, Active: 1 };
    this.dataService.addProduct(productData).subscribe(() => {
      this.newProductName = '';
      this.tableRefresh$.next();
    });
  }

  toggleActive = ([row, result]: [GetProductsSchema, boolean]) => {
    if (!result) return;
    const updated = { Name: row.Name, Active: row.Active === 1 ? 0 : 1 };
    this.dataService.updateProduct(row.ProductID, updated).subscribe(() => {
      this.tableRefresh$.next();
    });

  }

  deleteProduct = ([row, result]: [GetProductsSchema, boolean]) => {
    if (!result) return;
    this.dataService.deleteProduct(row.ProductID).subscribe(() => {
      this.tableRefresh$.next();
    });
  }

  test = ([row, result]: [GetProductsSchema, boolean]) => {

    this.tableRefresh$.next();

  }
}


