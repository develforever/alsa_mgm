
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-allocation-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px;">
      <h3>Lista Alokacji Stacji Roboczych</h3>
      <p>Ten widok jest chroniony przez AuthGuard.</p>
      </div>
  `
})
export class AllocationViewComponent implements OnInit {
  ngOnInit() {
    console.log('Widok alokacji załadowany pomyślnie!');
  }
}