import { Component, inject, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContextMenuServiceImpl } from './context-menu.service';
import { ContextMenuAction } from './models/action.model';

interface TreeNode {
    name: string;
    type: 'category' | 'action';
    action?: ContextMenuAction;
    children?: TreeNode[];
}

import { TranslocoModule } from '@jsverse/transloco';

@Component({
    selector: 'app-context-menu-dev-tool',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatExpansionModule,
        TranslocoModule
    ],
    template: `
        <div class="dev-tool-container">
            <div class="header">
                <h2>{{ 'DEV_TOOL.TITLE' | transloco }}</h2>
                <button mat-button (click)="refresh()">
                    <mat-icon>refresh</mat-icon>
                    {{ 'DEV_TOOL.REFRESH' | transloco }}
                </button>
            </div>

            <div class="stats">
                <div class="stat-card">
                    <mat-icon class="stat-icon">extension</mat-icon>
                    <div class="stat-content">
                        <div class="stat-value">{{ categoryCount() }}</div>
                        <div class="stat-label">{{ 'DEV_TOOL.CATEGORIES' | transloco }}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <mat-icon class="stat-icon">list</mat-icon>
                    <div class="stat-content">
                        <div class="stat-value">{{ totalActionCount() }}</div>
                        <div class="stat-label">{{ 'DEV_TOOL.TOTAL_ACTIONS' | transloco }}</div>
                    </div>
                </div>
            </div>

            <div class="filter-section">
                <mat-form-field appearance="outline" class="full-width">
                    <mat-label>{{ 'DEV_TOOL.FILTER_LABEL' | transloco }}</mat-label>
                    <input matInput [(ngModel)]="filterText" [placeholder]="'DEV_TOOL.FILTER_PLACEHOLDER' | transloco">
                    <mat-icon matSuffix>search</mat-icon>
                </mat-form-field>
            </div>

            <div class="tree-container">
                @for (node of treeData(); track node.name) {
                    <mat-accordion>
                        <mat-expansion-panel>
                            <mat-expansion-panel-header>
                                <mat-panel-title>
                                    <div class="node-content category-node">
                                        <mat-icon>extension</mat-icon>
                                        <span class="node-name">{{ node.name }}</span>
                                        <span class="action-count">{{ 'DEV_TOOL.ACTIONS_COUNT' | transloco: { count: node.children?.length } }}</span>
                                    </div>
                                </mat-panel-title>
                            </mat-expansion-panel-header>
                            @for (action of node.children; track action.name) {
                                <div class="node-content action-node">
                                    <mat-icon>description</mat-icon>
                                    <span class="node-name">{{ action.name }}</span>
                                    @if (action.action?.contextType) {
                                        <span class="node-type">{{ action.action?.contextType }}</span>
                                    }
                                    @if (action.action?.category) {
                                        <span class="node-category">
                                            {{ action.action?.category }}
                                        </span>
                                    }
                                </div>
                            }
                        </mat-expansion-panel>
                    </mat-accordion>
                }
            </div>
        </div>
    `,
    styles: [`
        .dev-tool-container {
            padding: 24px;
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }

        .header h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 500;
        }

        .stats {
            display: flex;
            gap: 16px;
            margin-bottom: 24px;
        }

        .stat-card {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            flex: 1;
        }

        .stat-icon {
            font-size: 32px;
            color: #1976d2;
        }

        .stat-content {
            display: flex;
            flex-direction: column;
        }

        .stat-value {
            font-size: 24px;
            font-weight: 500;
            color: #1976d2;
        }

        .stat-label {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.6);
        }

        .filter-section {
            margin-bottom: 24px;
        }

        .full-width {
            width: 100%;
        }

        .tree-container {
            background: white;
            border-radius: 8px;
            padding: 16px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            max-height: 600px;
            overflow-y: auto;
        }

        .node-content {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px;
            border-radius: 4px;
        }

        .node-content:hover {
            background: rgba(0, 0, 0, 0.04);
        }

        .category-node {
            font-weight: 500;
        }

        .action-node {
            margin-left: 24px;
        }

        .node-name {
            flex: 1;
        }

        .node-type {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.6);
            background: rgba(0, 0, 0, 0.08);
            padding: 2px 8px;
            border-radius: 12px;
        }

        .node-category {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.6);
            background: rgba(25, 118, 210, 0.1);
            color: #1976d2;
            padding: 2px 8px;
            border-radius: 12px;
        }

        .action-count {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.6);
        }
    `]
})
export class ContextMenuDevToolComponent {
    private contextMenuService = inject(ContextMenuServiceImpl);

    filterText = '';

    treeData = computed(() => {
        const allActions = this.contextMenuService.getActionsSignal()();

        const filteredActions = this.filterText
            ? allActions.filter(a => a.contextType.includes(this.filterText) || (a.category && a.category.includes(this.filterText)))
            : allActions;

        // Group by category
        const categoryMap = new Map<string, ContextMenuAction[]>();
        filteredActions.forEach(action => {
            const category = action.category || action.contextType;
            if (!categoryMap.has(category)) {
                categoryMap.set(category, []);
            }
            categoryMap.get(category)!.push(action);
        });

        const nodes: TreeNode[] = [];
        categoryMap.forEach((actions, category) => {
            const actionNodes: TreeNode[] = actions.map(action => ({
                name: `${action.label} (${action.id})`,
                type: 'action' as const,
                action
            }));

            nodes.push({
                name: category,
                type: 'category' as const,
                children: actionNodes
            });
        });

        return nodes;
    });

    categoryCount = computed(() => this.treeData().length);
    totalActionCount = computed(() => this.contextMenuService.getActionsSignal()().length);

    refresh(): void {
        // Signals are reactive, no manual refresh needed
    }
}
