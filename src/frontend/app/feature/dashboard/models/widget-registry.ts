import { Type } from "@angular/core";
import { RecentProductsWidgetComponent } from "../widgets/recent-products-widget/recent-products-widget.component";
import { StatsWidgetComponent } from "../widgets/stats-widget/stats-widget.component";
import { LineStatusWidgetComponent } from "../widgets/line-status-widget/line-status-widget.component";
import { IDashboardWidget } from "../services/dashboard.service";

export const WIDGET_REGISTRY: Record<string, Type<IDashboardWidget>> = {
    'recent-products': RecentProductsWidgetComponent,
    'stats': StatsWidgetComponent,
    'line-status': LineStatusWidgetComponent,
};