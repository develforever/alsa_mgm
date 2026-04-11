import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ContextMenuContext } from './models/context.model';
import { ContextMenuAction } from './models/action.model';

export interface ContextMenuTriggerData {
    context: ContextMenuContext;
    actions: ContextMenuAction[];
    position: { x: number; y: number };
}

@Injectable({
    providedIn: 'root'
})
export class ContextMenuTriggerService {
    private triggerData$ = new BehaviorSubject<ContextMenuTriggerData | null>(null);

    getTriggerData$() {
        return this.triggerData$.asObservable();
    }

    trigger(data: ContextMenuTriggerData): void {
        this.triggerData$.next(data);
    }

    close(): void {
        this.triggerData$.next(null);
    }
}
