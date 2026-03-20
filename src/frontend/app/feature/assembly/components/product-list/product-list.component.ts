
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { SmartListLayoutComponent } from "../../../../ui/data/layout/smart-list-layout.component";
import { DataProductService } from './service/product.service';

@Component({
  selector: 'app-assembly-product-list',
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, RouterModule, SmartListLayoutComponent],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent {

  private router = inject(Router);

  dataTableService = inject(DataProductService);


}


