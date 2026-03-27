import { Component, Input, Type, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { WIDGET_REGISTRY } from '../../models/widget-registry';


@Component({
  selector: 'app-widget-host',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    @if (componentType) {
      <ng-container *ngComponentOutlet="componentType; inputs: {widgetConfig}"></ng-container>
    } @else {
      <div class="widget-empty-slot cursor-pointer">
        <mat-icon class="widget-empty-icon">dashboard_customize</mat-icon>
        <div class="widget-empty-title">Puste miejsce</div>
        <div class="widget-empty-subtitle">Upuść tutaj widżet</div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
      width: 100%;
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
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetHostComponent {
  componentType: Type<unknown> | null = null;

  widgetConfig = input<Record<string, unknown> | null>(null);


  @Input() set widgetType(type: string | null) {
    if (type && WIDGET_REGISTRY[type]) {
      this.componentType = WIDGET_REGISTRY[type];
    } else {
      this.componentType = null;
    }
  }
}
