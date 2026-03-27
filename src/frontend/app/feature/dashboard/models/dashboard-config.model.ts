export interface DashboardConfig {
  rows: DashboardRow[];
}

export interface DashboardRow {
  height: string;
  columns: 1 | 2 | 3 | 4;
  cells: DashboardCell[];
}

export interface DashboardCell {
  id: string;
  widgetType: string | null;
  flex?: number;
  widgetConfig?: Record<string, unknown>;
}
