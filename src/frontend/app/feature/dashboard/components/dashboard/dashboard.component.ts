import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  CdkDrag,
  CdkDragHandle,
  CdkDragPreview
} from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardConfig, DashboardCell } from '../../models/dashboard-config.model';
import { WidgetHostComponent } from '../widget-host/widget-host.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../../../services/auth.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    CdkDragPreview,
    MatIconModule,
    MatButtonModule,
    WidgetHostComponent,
    MatSidenavModule,
    MatSlideToggleModule,
    TranslocoModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {
  protected dashboardService = inject(DashboardService);
  protected authService = inject(AuthService);
  protected availableWidgets = this.dashboardService.getAvailableWidgets();

  allCellIds = computed(() => {
    const layout = this.dashboardService.activeLayout();
    return layout.rows.flatMap(r => r.cells.map(c => c.id));
  });

  ngOnInit() {
    this.dashboardService.isDashboardActive.set(true);
  }

  ngOnDestroy() {
    this.dashboardService.isDashboardActive.set(false);
  }

  getCellClasses(cell: DashboardCell) {
    const classes: Record<string, boolean> = {
      'dashboard-cell-filled': !!cell.widgetType,
      'dashboard-cell-empty': !cell.widgetType
    };

    // Add the flex-grow-X class
    const flexVal = cell.flex || 1;
    classes[`flex-grow-${flexVal}`] = true;

    return classes;
  }

  drop(event: CdkDragDrop<string[], unknown, string>, rIndex: number, cIndex: number) {
    if (event.previousContainer === event.container) {
      return; // Dragged inside the exact same cell
    }

    const currentLayout = this.dashboardService.activeLayout();
    const updatedLayout = JSON.parse(JSON.stringify(currentLayout)) as DashboardConfig;
    const targetCell = updatedLayout.rows[rIndex].cells[cIndex];

    // Check if dragging from sidenav
    if (event.previousContainer.id === 'external-widget-list') {
      const widgetKey = event.item.data as string;
      const widgetDef = this.availableWidgets.find(w => w.key === widgetKey);

      if (widgetDef) {
        targetCell.widgetType = widgetKey;
        targetCell.widgetConfig = JSON.parse(JSON.stringify(widgetDef.defaultConfig));
        this.dashboardService.updateLayout(updatedLayout);
      }
      return;
    }

    // Find the source cell indices
    let sourceRIndex = -1;
    let sourceCIndex = -1;

    for (let ri = 0; ri < updatedLayout.rows.length; ri++) {
      for (let ci = 0; ci < updatedLayout.rows[ri].cells.length; ci++) {
        if (updatedLayout.rows[ri].cells[ci].id === event.previousContainer.id) {
          sourceRIndex = ri;
          sourceCIndex = ci;
          break;
        }
      }
      if (sourceRIndex !== -1) break;
    }

    if (sourceRIndex === -1 || sourceCIndex === -1) return;

    // Swap logic:
    // When dropping a widget into a new cell, we swap the widgetTypes
    const sourceCell = updatedLayout.rows[sourceRIndex].cells[sourceCIndex];

    const sourceWidgetType = sourceCell.widgetType;
    const targetWidgetType = targetCell.widgetType;

    const sourceConfig = sourceCell.widgetConfig;
    const targetConfig = targetCell.widgetConfig;

    // Update
    sourceCell.widgetType = targetWidgetType;
    targetCell.widgetType = sourceWidgetType;

    sourceCell.widgetConfig = targetConfig;
    targetCell.widgetConfig = sourceConfig;

    // Trigger update
    this.dashboardService.updateLayout(updatedLayout);
  }

  resetLayout() {
    this.dashboardService.resetLayout();
  }
}
