import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
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

  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {

  private version = 1


  // Default configuration
  private defaultLayout: DashboardConfig = {
    rows: [
      {
        height: '400px',
        columns: 2,
        cells: [
          { id: 'cell-1-1', widgetType: 'recent-products', flex: 2, widgetConfig: { limit: 2 } },
          { id: 'cell-1-2', widgetType: null, flex: 1 }
        ]
      },
      {
        height: '350px',
        columns: 4,
        cells: [
          { id: 'cell-2-1', widgetType: null },
          { id: 'cell-2-2', widgetType: null },
          { id: 'cell-2-3', widgetType: null },
          { id: 'cell-2-4', widgetType: 'recent-products', flex: 2, widgetConfig: { limit: 6 } },
        ]
      }
    ]
  };

  layout = signal<DashboardConfig>(this.defaultLayout);

  ngOnInit() {
    this.loadLayout();
    const saved = localStorage.getItem('dashboard_layout');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as DashboardConfig;

        // Merge missing properties (like 'flex') from default layout if they are missing in saved data
        const flatDefaults = this.defaultLayout.rows.reduce<DashboardCell[]>((acc, row) => [...acc, ...row.cells], []);
        parsed.rows.forEach(row => {
          row.cells.forEach(cell => {
            if (cell.flex === undefined) {
              const def = flatDefaults.find(dc => dc.id === cell.id);
              if (def) cell.flex = def.flex;
            }
          });
        });

        this.layout.set(parsed);
      } catch {
        // Fallback to default
      }
    }
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

  drop(event: CdkDragDrop<string[]>, rIndex: number, cIndex: number) {
    if (event.previousContainer === event.container) {
      return; // Dragged inside the exact same cell
    }

    const currentLayout = this.layout();

    // Find the source cell indices
    let sourceRIndex = -1;
    let sourceCIndex = -1;

    for (let ri = 0; ri < currentLayout.rows.length; ri++) {
      for (let ci = 0; ci < currentLayout.rows[ri].cells.length; ci++) {
        if (currentLayout.rows[ri].cells[ci].id === event.previousContainer.id) {
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
    const sourceCell = currentLayout.rows[sourceRIndex].cells[sourceCIndex];
    const targetCell = currentLayout.rows[rIndex].cells[cIndex];

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
    this.layout.set({ ...currentLayout }); // Trigger change detection
    this.saveLayout();
  }

  resetLayout() {
    localStorage.removeItem('dashboard_layout');
    this.layout.set(JSON.parse(JSON.stringify(this.defaultLayout)));
  }

  private saveLayout() {

    const data = {
      version: this.version,
      layout: this.layout()
    }
    localStorage.setItem('dashboard_layout', JSON.stringify(data));
  }

  private loadLayout() {
    return
    // const saved = localStorage.getItem('dashboard_layout');
    // if (!saved) return;
    // const data = JSON.parse(saved);
    // if (data.version !== this.version) {
    //   this.resetLayout();
    //   return;
    // }
    // this.layout.set(data.layout);
  }
}
