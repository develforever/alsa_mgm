
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px;">
      <h3>Lista Produktów</h3>
      <p>Ten widok jest chroniony przez AuthGuard.</p>
      </div>
  `
})
export class ProductListComponent implements OnInit {
  ngOnInit() {
    console.log('Widok listy produktów załadowany pomyślnie!');
  }
}