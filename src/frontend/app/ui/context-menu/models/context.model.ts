import { MenuPositionX, MenuPositionY } from '@angular/material/menu';

export interface ContextMenuContext {
    element: HTMLElement;
    data?: unknown;
    type: string;
    metadata?: Record<string, unknown>;
}

export interface ContextMenuPosition {
    x: MenuPositionX;
    y: MenuPositionY;
}
