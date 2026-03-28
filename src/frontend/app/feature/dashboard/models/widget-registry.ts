import { Type } from "@angular/core";
import { RecentProductsWidgetComponent } from "../widgets/recent-products-widget/recent-products-widget.component";
import { IDashboardWidget } from "../services/dashboard.service";


export const WIDGET_REGISTRY: Record<string, Type<IDashboardWidget>> = {
    'recent-products': RecentProductsWidgetComponent,
};