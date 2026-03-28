import { Component, ChangeDetectionStrategy, inject, signal, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DataProductService } from '../../../assembly/components/product-list/service/product.service';

interface WidgetProduct {
  ProductID: string | number;
  Name: string;
  CreatedAt: string | Date;
}


@Component({
  selector: 'app-recent-products-widget',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <mat-card class="widget-card" style="padding-bottom: 14px;">
      <mat-card-header class="widget-header">
        <mat-icon mat-card-avatar color="primary">inventory_2</mat-icon>
        <mat-card-title>Recent Products</mat-card-title>
        <mat-card-subtitle>Ostatnio dodane produkty</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content class="widget-content">
        @if (loading()) {
          <div class="widget-loading">
            <mat-spinner diameter="40"></mat-spinner>
          </div>
        } @else if (error()) {
          <div class="widget-error">
            Błąd podczas pobierania produktów.
          </div>
        } @else {
          <mat-list>
            @for (product of products(); track product.ProductID) {
              <mat-list-item>
                <mat-icon matListItemIcon>view_in_ar</mat-icon>
                <div matListItemTitle>{{ product.Name }}</div>
                <div matListItemLine>Data: {{ product.CreatedAt | date:'short' }}</div>
              </mat-list-item>
            }
            @if (products().length === 0) {
               <div class="widget-empty">Brak produktów</div>
            }
          </mat-list>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    .widget-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }
    .widget-header {
      padding-bottom: 8px;
    }
    .widget-content {
      flex-grow: 1;
      overflow-y: auto;
    }
    .widget-loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
    .widget-error {
      color: #ef4444;
      padding: 16px;
      text-align: center;
    }
    .widget-empty {
      color: #6b7280;
      padding: 16px;
      text-align: center;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentProductsWidgetComponent {

  widgetConfig = input<Record<string, unknown> | null>(null);

  private productService = inject(DataProductService);

  products = signal<WidgetProduct[]>([]);
  loading = signal<boolean>(true);
  error = signal<boolean>(false);

  constructor() {
    effect(() => {
      const config = this.widgetConfig();
      const limit = Number(config?.['limit'] || 5);
      this.loadRecentProducts(limit);
    });
  }

  private loadRecentProducts(limit: number) {
    this.loading.set(true);
    this.error.set(false);

    this.productService.getList(1, limit).subscribe({
      next: (response: unknown) => {
        const res = response as { data?: WidgetProduct[] };
        if (res?.data && Array.isArray(res.data)) {
          this.products.set(res.data);
        } else {
          this.products.set([]);
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }
}
