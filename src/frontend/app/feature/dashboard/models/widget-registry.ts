import { Type } from "@angular/core";
import { RecentProductsWidgetComponent } from "../widgets/recent-products-widget/recent-products-widget.component";


export const WIDGET_REGISTRY: Record<string, Type<unknown>> = {
    'recent-products': RecentProductsWidgetComponent,
};