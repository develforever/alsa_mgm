import { Component, OnInit, inject, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslocoModule } from '@jsverse/transloco';
import { DashboardMetricsService, DashboardMetrics } from '../../services/dashboard-metrics.service';
import { IDashboardWidget, WidgetMetadata } from '../../services/dashboard.service';

@Component({
  selector: 'app-stats-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    TranslocoModule
  ],
  template: `
  @if(metrics){
    <div class="stats-widget">
      <div class="stats-grid">
        <!-- Products Stats -->
        <div class="stat-item">
          <div class="stat-header">
            <mat-icon>inventory_2</mat-icon>
            <span class="stat-label">{{ 'WIDGETS.STATS.PRODUCTS' | transloco }}</span>
          </div>
          <div class="stat-value">{{ metrics.products.total }}</div>
          <div class="stat-subtext">
            {{ metrics.products.active }} {{ 'WIDGETS.STATS.ACTIVE' | transloco }}
          </div>
          <mat-progress-bar 
            mode="determinate" 
            [value]="(metrics.products.active / metrics.products.total) * 100">
          </mat-progress-bar>
        </div>

        <!-- Assembly Lines Stats -->
        <div class="stat-item">
          <div class="stat-header">
            <mat-icon>precision_manufacturing</mat-icon>
            <span class="stat-label">{{ 'WIDGETS.STATS.ASSEMBLY_LINES' | transloco }}</span>
          </div>
          <div class="stat-value">{{ metrics.assemblyLines.total }}</div>
          <div class="stat-subtext">
            {{ metrics.assemblyLines.active }} {{ 'WIDGETS.STATS.ACTIVE' | transloco }} / 
            {{ metrics.assemblyLines.locked }} {{ 'WIDGETS.STATS.LOCKED' | transloco }}
          </div>
          <mat-progress-bar 
            mode="determinate" 
            [value]="(metrics.assemblyLines.active / metrics.assemblyLines.total) * 100"
            color="primary">
          </mat-progress-bar>
        </div>

        <!-- Workstations Stats -->
        <div class="stat-item">
          <div class="stat-header">
            <mat-icon>computer</mat-icon>
            <span class="stat-label">{{ 'WIDGETS.STATS.WORKSTATIONS' | transloco }}</span>
          </div>
          <div class="stat-value">{{ metrics.workstations.total }}</div>
          <div class="stat-subtext">
            {{ metrics.workstations.autoStartEnabled }} {{ 'WIDGETS.STATS.AUTO_START' | transloco }}
          </div>
          <mat-progress-bar 
            mode="determinate" 
            [value]="(metrics.workstations.autoStartEnabled / metrics.workstations.total) * 100"
            color="accent">
          </mat-progress-bar>
        </div>

        <!-- Allocations Stats -->
        <div class="stat-item">
          <div class="stat-header">
            <mat-icon>swap_horiz</mat-icon>
            <span class="stat-label">{{ 'WIDGETS.STATS.ALLOCATIONS' | transloco }}</span>
          </div>
          <div class="stat-value">{{ metrics.allocations.total }}</div>
          <div class="stat-subtext">
            {{ 'WIDGETS.STATS.ALLOCATIONS_DESC' | transloco }}
          </div>
        </div>
      </div>

      @if(metrics.recentActivity) {
      <!-- Recent Activity -->
      <div class="activity-section">
        <h4>{{ 'WIDGETS.STATS.RECENT_ACTIVITY' | transloco }}</h4>
        <div class="activity-stats">
          <div class="activity-item">
            <span class="activity-value">{{ metrics.recentActivity.last24h }}</span>
            <span class="activity-label">{{ 'WIDGETS.STATS.H24' | transloco }}</span>
          </div>
          <div class="activity-item">
            <span class="activity-value">{{ metrics.recentActivity.last7d }}</span>
            <span class="activity-label">{{ 'WIDGETS.STATS.D7' | transloco }}</span>
          </div>
          <div class="activity-item">
            <span class="activity-value">{{ metrics.recentActivity.last30d }}</span>
            <span class="activity-label">{{ 'WIDGETS.STATS.D30' | transloco }}</span>
          </div>
        </div>
      </div>
      }
    </div>
  }
  `,
  styles: [`
    .stats-widget {
      padding: 1rem;
      height: 100%;
      overflow-y: auto;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat-item {
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 8px;
      transition: transform 0.2s;
    }

    .stat-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .stat-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      color: #666;
    }

    .stat-header mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .stat-label {
      font-size: 0.875rem;
      font-weight: 500;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #333;
      margin-bottom: 0.25rem;
    }

    .stat-subtext {
      font-size: 0.75rem;
      color: #888;
      margin-bottom: 0.5rem;
    }

    .activity-section {
      border-top: 1px solid #e0e0e0;
      padding-top: 1rem;
    }

    .activity-section h4 {
      margin: 0 0 0.75rem 0;
      color: #666;
      font-size: 0.875rem;
    }

    .activity-stats {
      display: flex;
      gap: 2rem;
    }

    .activity-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .activity-value {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1976d2;
    }

    .activity-label {
      font-size: 0.75rem;
      color: #888;
    }
  `]
})
export class StatsWidgetComponent implements OnInit, IDashboardWidget {
  private metricsService = inject(DashboardMetricsService);
  private cdr = inject(ChangeDetectorRef);

  metrics: DashboardMetrics | null = null;

  @Input() widgetConfig: Record<string, unknown> = {};

  static metadata: WidgetMetadata = {
    label: 'WIDGETS.STATS.TITLE',
    icon: 'dashboard',
    description: 'WIDGETS.STATS.DESC'
  };

  ngOnInit(): void {
    this.loadMetrics();
  }

  private loadMetrics(): void {
    this.metricsService.getMetrics().subscribe(metrics => {
      this.metrics = metrics;
      this.cdr.detectChanges();
    });
  }

  // Dashboard widget interface
  getConfig(): Record<string, unknown> {
    return {};
  }

  setConfig(_config: Record<string, unknown>): void {
    // No config needed for this widget
  }

  static getDefaultConfig(): Record<string, unknown> {
    return {};
  }
}
