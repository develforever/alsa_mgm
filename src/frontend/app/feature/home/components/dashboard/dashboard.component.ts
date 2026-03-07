
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Injectable } from "@angular/core";
import { signal } from "@angular/core";

@Injectable()
export class HomeDashboardStoreService {


}

@Component({
  selector: 'home-dashboard-component',
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