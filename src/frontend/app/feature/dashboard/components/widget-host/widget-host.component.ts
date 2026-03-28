import { Component, Input, Type, ChangeDetectionStrategy, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { WIDGET_REGISTRY } from '../../models/widget-registry';
import { DashboardService } from '../../services/dashboard.service';
import { WidgetSettingsDialogComponent } from '../widget-settings-dialog/widget-settings-dialog.component';

@Component({
  selector: 'app-widget-host',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatMenuModule, MatButtonModule, MatDialogModule],
  template: `
    <div class="widget-container" [class.editing]="dashboardService.isEditMode()">
      @if (componentType) {
        @if (dashboardService.isEditMode()) {
          <div class="widget-header-overlay">
            <button mat-icon-button [matMenuTriggerFor]="widgetMenu" class="widget-menu-btn">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #widgetMenu="matMenu">
              <button mat-menu-item (click)="openSettings()">
                <mat-icon>settings</mat-icon>
                <span>Ustawienia</span>
              </button>
              <button mat-menu-item (click)="removeWidget()" class="text-danger">
                <mat-icon color="warn">delete</mat-icon>
                <span>Usuń</span>
              </button>
            </mat-menu>
          </div>
        }
        <ng-container *ngComponentOutlet="componentType; inputs: {widgetConfig: widgetConfig()}"></ng-container>
      } @else {
        <div class="widget-empty-slot cursor-pointer">
          <mat-icon class="widget-empty-icon">dashboard_customize</mat-icon>
          <div class="widget-empty-title">Puste miejsce</div>
          <div class="widget-empty-subtitle">Upuść tutaj widżet</div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
      width: 100%;
    }
    .widget-container {
      height: 100%;
      width: 100%;
      position: relative;
    }
    .widget-container.editing {
      border: 1px dashed transparent;
      transition: border-color 0.3s;
    }
    .widget-container.editing:hover {
      border-color: #3b82f6;
    }
    .widget-header-overlay {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 20;
    }
    .widget-menu-btn {
      background-color: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(4px);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .widget-empty-slot {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
      opacity: 0.6;
    }
    .widget-empty-icon {
      margin-bottom: 12px;
      width: 48px;
      height: 48px;
      font-size: 48px;
    }
    .widget-empty-title {
      font-size: 0.875rem;
      font-weight: 600;
      letter-spacing: 0.025em;
      text-transform: uppercase;
      color: #6b7280;
    }
    .widget-empty-subtitle {
      font-size: 0.75rem;
      color: #9ca3af;
      margin-top: 4px;
    }
    .text-danger { color: #ef4444; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetHostComponent {
  dashboardService = inject(DashboardService);
  private dialog = inject(MatDialog);

  componentType: Type<unknown> | null = null;

  widgetConfig = input<Record<string, unknown> | null>(null);
  cellId = input<string | null>(null);

  @Input() set widgetType(type: string | null) {
    if (type && WIDGET_REGISTRY[type]) {
      this.componentType = WIDGET_REGISTRY[type];
    } else {
      this.componentType = null;
    }
  }

  openSettings() {
    const dialogRef = this.dialog.open(WidgetSettingsDialogComponent, {
      width: '500px',
      data: { config: this.widgetConfig() }
    });

    dialogRef.afterClosed().subscribe(result => {
      const id = this.cellId();
      if (result && id) {
        this.dashboardService.updateWidgetConfig(id, result);
      }
    });
  }

  removeWidget() {
    const id = this.cellId();
    if (id && confirm('Czy na pewno chcesz usunąć ten widżet?')) {
      this.dashboardService.removeWidget(id);
    }
  }
}
