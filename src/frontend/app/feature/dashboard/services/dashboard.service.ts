import { Injectable, signal, computed } from '@angular/core';
import { DashboardConfig } from '../models/dashboard-config.model';

const DEFAULT_LAYOUT: DashboardConfig = {
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

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly STORAGE_KEY = 'dashboard_layout';
  private readonly VERSION = 1;

  // Global State
  isEditMode = signal<boolean>(false);
  isDashboardActive = signal<boolean>(false);

  // Layout Streams
  private _layout = signal<DashboardConfig>(this.loadFromStorage() || DEFAULT_LAYOUT);
  layout = this._layout.asReadonly();

  // Temporary layout for Edit Mode
  private _tempLayout = signal<DashboardConfig | null>(null);
  tempLayout = this._tempLayout.asReadonly();

  // Active layout (temp if editing, else actual)
  activeLayout = computed(() => this.isEditMode() && this._tempLayout() ? this._tempLayout()! : this._layout());

  constructor() {
    // Auto-save is NOT wanted based on user requirement: "użytkownik klika zapisz i dashoard wychodzi z trybu edycji i od tej pory dasboard konfig jest zaspisany"
  }

  toggleEditMode() {
    if (!this.isEditMode()) {
      // Entering Edit Mode: Clone current layout to temp
      this._tempLayout.set(JSON.parse(JSON.stringify(this._layout())));
      this.isEditMode.set(true);
    } else {
      // Exiting Edit Mode without saving: Discard changes
      this.cancelChanges();
    }
  }

  saveChanges() {
    const changes = this._tempLayout();
    if (changes) {
      this._layout.set(changes);
      this.saveToStorage(changes);
    }
    this._tempLayout.set(null);
    this.isEditMode.set(false);
  }

  cancelChanges() {
    this._tempLayout.set(null);
    this.isEditMode.set(false);
  }

  updateWidgetConfig(cellId: string, config: Record<string, unknown>) {
    const current = this._tempLayout() || this._layout();
    const updated = JSON.parse(JSON.stringify(current)) as DashboardConfig;

    let found = false;
    for (const row of updated.rows) {
      const cell = row.cells.find(c => c.id === cellId);
      if (cell) {
        cell.widgetConfig = config;
        found = true;
        break;
      }
    }

    if (found) {
      if (this.isEditMode()) {
        this._tempLayout.set(updated);
      } else {
        this._layout.set(updated);
        this.saveToStorage(updated);
      }
    }
  }

  removeWidget(cellId: string) {
    const current = this._tempLayout() || this._layout();
    const updated = JSON.parse(JSON.stringify(current)) as DashboardConfig;

    for (const row of updated.rows) {
      const cell = row.cells.find(c => c.id === cellId);
      if (cell) {
        cell.widgetType = null;
        cell.widgetConfig = undefined;
        break;
      }
    }

    if (this.isEditMode()) {
      this._tempLayout.set(updated);
    } else {
      this._layout.set(updated);
      this.saveToStorage(updated);
    }
  }

  updateLayout(newLayout: DashboardConfig) {
    if (this.isEditMode()) {
      this._tempLayout.set(newLayout);
    } else {
      this._layout.set(newLayout);
      this.saveToStorage(newLayout);
    }
  }

  resetLayout() {
    localStorage.removeItem(this.STORAGE_KEY);
    this._layout.set(JSON.parse(JSON.stringify(DEFAULT_LAYOUT)));
    if (this.isEditMode()) {
      this._tempLayout.set(JSON.parse(JSON.stringify(DEFAULT_LAYOUT)));
    }
  }

  private saveToStorage(layout: DashboardConfig) {
    const data = {
      version: this.VERSION,
      layout: layout
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  private loadFromStorage(): DashboardConfig | null {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (!saved) return null;

    try {
      const data = JSON.parse(saved);
      if (data.version !== this.VERSION) return null;
      return data.layout;
    } catch {
      return null;
    }
  }
}
