
import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../../services/data.service';
import { Product } from '../../../../../../shared/models/types';

@Component({
  selector: 'assembly-product-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  private dataService = inject(DataService);

  products = signal<Product[]>([]);
  newProductName = '';

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.dataService.getProducts().subscribe(data => this.products.set(data));
  }

  addProduct() {
    if (!this.newProductName.trim()) return;

    const productData = { Name: this.newProductName, Active: 1 };
    this.dataService.addProduct(productData).subscribe(() => {
      this.newProductName = '';
      this.loadProducts();
    });
  }

  toggleActive(product: Product) {
    const updated = { ...product, Active: product.Active === 1 ? 0 : 1 };
    this.dataService.updateProduct(product.ProductID, updated).subscribe(() => {
      this.loadProducts();
    });
  }

  deleteProduct(product: Product) {
    this.dataService.deleteProduct(product.ProductID).subscribe(() => {
      this.loadProducts();
    });
  }
}