import { Component, OnInit, signal, inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Product, ALAssLine, LineStatus } from '../../models/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-line-list',
  standalone: true,
  templateUrl: './line-list.component.html',
  imports: [
    CommonModule, 
    FormsModule,
  ],
})
export class LineListComponent implements OnInit {
  private dataService = inject(DataService);

  lines = signal<ALAssLine[]>([]);
  products = signal<Product[]>([]); // Potrzebne do dropdowna
  
  // Model dla nowej linii
  newLine = { Name: '', ProductID: null as number | null, Status: 1 };

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.dataService.getLines().subscribe(data => this.lines.set(data));
    this.dataService.getProducts().subscribe(data => this.products.set(data));
  }

  addLine() {
    if (this.newLine.Name && this.newLine.ProductID) {
      this.dataService.addLine(this.newLine as any).subscribe(() => {
        this.loadData();
        this.newLine = { Name: '', ProductID: null, Status: 1 }; // Reset
      });
    }
  }

  editLine(line: ALAssLine) { 
    // Tutaj można otworzyć modal lub inny komponent do edycji
    // Po edycji, wywołać updateLine z nowymi danymi
  }

  deleteLine(line: ALAssLine) {
    this.dataService.deleteLine(line.ALAssLineID).subscribe(() => {
      this.loadData();
    });
  }
}