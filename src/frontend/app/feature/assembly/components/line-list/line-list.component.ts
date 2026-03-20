import { Component, OnInit, signal, inject } from '@angular/core';
import { ALAssLine } from '../../../../../../shared/models/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ensureArray } from '../../../../utils/api.utils';;
import { DataLineService } from '../../../../services/data/line.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { GetProductsSchema } from '../../../../../../shared/api/product/schema';
import { DataProductService } from '../product-list/service/product.service';

@Component({
  selector: 'app-assembly-line-list',
  templateUrl: './line-list.component.html',
  imports: [
    CommonModule,
    FormsModule,
  ],
})
export class LineListComponent implements OnInit {
  private dataService = inject(DataProductService);
  private dataLineService = inject(DataLineService);

  lines = signal<ALAssLine[]>([]);
  products = signal<GetProductsSchema[]>([]);

  newLine = { Name: '', ProductID: null as number | null, Status: 1 };

  ngOnInit() {
    this.loadData();
  }

  loadData() {

    forkJoin({
      lines: this.dataLineService.getLines().pipe(ensureArray<ALAssLine>()),
      products: this.dataService.getProducts().pipe(ensureArray<GetProductsSchema>()),
    }).subscribe(({ lines, products }) => {
      this.lines.set(lines);
      this.products.set(products);
    });
  }

  addLine() {
    if (this.newLine.Name && this.newLine.ProductID) {
      this.dataLineService.addLine(this.newLine as any).subscribe(() => {
        this.loadData();
        this.newLine = { Name: '', ProductID: null, Status: 1 };
      });
    }
  }

  editLine(line: ALAssLine) {
    // TODO
  }

  deleteLine(line: ALAssLine) {
    this.dataLineService.deleteLine(line.ALAssLineID).subscribe(() => {
      this.loadData();
    });
  }
}