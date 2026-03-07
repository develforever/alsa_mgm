
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="text-align: center; margin-top: 50px;">
      <h2>Dashboard</h2>
      <p>Panel główny aplikacji</p>
    </div>
  `
})
export class DashboardComponent {
}