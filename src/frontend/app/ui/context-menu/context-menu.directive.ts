import { Directive, Input, Output, EventEmitter, HostListener, inject, ElementRef } from '@angular/core';
import { ContextMenuContext } from './models/context.model';
import { ContextMenuServiceImpl } from './context-menu.service';

@Directive({
    selector: '[appContextMenu]',
    standalone: true
})
export class ContextMenuDirective {
    @Input() contextMenuType = 'default';
    @Input() contextMenuData: unknown;
    @Input() contextMenuMetadata!: Record<string, unknown>;
    @Output() contextMenuTrigger = new EventEmitter<ContextMenuContext>();
    
    private contextMenuService = inject(ContextMenuServiceImpl);
    private elementRef = inject(ElementRef);

    @HostListener('contextmenu', ['$event'])
    onContextMenu(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();

        const context: ContextMenuContext = {
            element: this.elementRef.nativeElement,
            data: this.contextMenuData,
            type: this.contextMenuType,
            metadata: this.contextMenuMetadata
        };

        this.contextMenuTrigger.emit(context);

        // Get actions for this context
        const actions = this.contextMenuService.getActionsForContext(context);
        
        // Dispatch custom event for the component to handle
        const customEvent = new CustomEvent('contextMenuOpen', {
            detail: {
                context,
                actions,
                position: { x: event.clientX, y: event.clientY }
            },
            bubbles: true
        });
        
        this.elementRef.nativeElement.dispatchEvent(customEvent);
    }
}
