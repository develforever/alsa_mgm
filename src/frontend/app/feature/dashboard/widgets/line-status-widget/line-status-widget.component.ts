import { Component, OnInit, inject, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { DashboardMetricsService, AssemblyLineStatusDistribution } from '../../services/dashboard-metrics.service';
import { IDashboardWidget, WidgetMetadata } from '../../services/dashboard.service';

@Component({
  selector: 'app-line-status-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="line-status-widget" *ngIf="statusData.length > 0">
      <h3 class="widget-title">
        <mat-icon>donut_large</mat-icon>
        Status linii montażowych
      </h3>
      
      <div class="status-list">
        <div 
          class="status-item" 
          *ngFor="let status of statusData"
          [class.active]="status.status === 'Active'"
          [class.locked]="status.status === 'Locked'"
          [class.closed]="status.status === 'Closed'">
          
          <div class="status-header">
            <span class="status-name">{{ status.status }}</span>
            <span class="status-count">{{ status.count }}</span>
          </div>
          
          <div class="status-bar-container">
            <div 
              class="status-bar" 
              [style.width.%]="status.percentage">
            </div>
          </div>
          
          <div class="status-footer">
            <mat-chip [ngSwitch]="status.status">
              <span *ngSwitchCase="'Active'" class="chip-content">
                <mat-icon>check_circle</mat-icon> Aktywne
              </span>
              <span *ngSwitchCase="'Locked'" class="chip-content">
                <mat-icon>lock</mat-icon> Zablokowane
              </span>
              <span *ngSwitchCase="'Closed'" class="chip-content">
                <mat-icon>cancel</mat-icon> Zamknięte
              </span>
            </mat-chip>
            <span class="percentage">{{ status.percentage }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div class="empty-state" *ngIf="statusData.length === 0">
      <mat-icon>info</mat-icon>
      <p>Brak danych o liniach montażowych</p>
    </div>
  `,
  styles: [`
    .line-status-widget {
      padding: 1rem;
      height: 100%;
      overflow-y: auto;
    }

    .widget-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0 0 1rem 0;
      font-size: 1.125rem;
      font-weight: 500;
      color: #333;
    }

    .widget-title mat-icon {
      color: #1976d2;
    }

    .status-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .status-item {
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 8px;
      border-left: 4px solid #ccc;
    }

    .status-item.active {
      border-left-color: #4caf50;
      background: #e8f5e9;
    }

    .status-item.locked {
      border-left-color: #ff9800;
      background: #fff3e0;
    }

    .status-item.closed {
      border-left-color: #f44336;
      background: #ffebee;
    }

    .status-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .status-name {
      font-weight: 600;
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-count {
      font-size: 1.25rem;
      font-weight: 700;
      color: #333;
    }

    .status-bar-container {
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 0.75rem;
    }

    .status-bar {
      height: 100%;
      background: #1976d2;
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .active .status-bar {
      background: #4caf50;
    }

    .locked .status-bar {
      background: #ff9800;
    }

    .closed .status-bar {
      background: #f44336;
    }

    .status-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chip-content {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
    }

    .chip-content mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .percentage {
      font-weight: 600;
      color: #666;
      font-size: 0.875rem;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #888;
      text-align: center;
    }

    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 0.5rem;
    }
  `]
})
export class LineStatusWidgetComponent implements OnInit, IDashboardWidget {
  private metricsService = inject(DashboardMetricsService);
  private cdr = inject(ChangeDetectorRef);
  
  statusData: AssemblyLineStatusDistribution[] = [];
  
  @Input() widgetConfig: Record<string, unknown> = {};

  static metadata: WidgetMetadata = {
    label: 'Status linii montażowych',
    icon: 'donut_large',
    description: 'Wyświetla rozkład statusów linii montażowych (aktywne, zablokowane, zamknięte)'
  };

  ngOnInit(): void {
    this.loadStatusData();
  }

  private loadStatusData(): void {
    this.metricsService.getAssemblyLineStatusDistribution().subscribe(data => {
      this.statusData = data;
      this.cdr.detectChanges();
    });
  }

  // Dashboard widget interface
  getConfig(): Record<string, unknown> {
    return {};
  }

  setConfig(): void {
    // No config needed for this widget
  }

  static getDefaultConfig(): Record<string, unknown> {
    return {};
  }
}
