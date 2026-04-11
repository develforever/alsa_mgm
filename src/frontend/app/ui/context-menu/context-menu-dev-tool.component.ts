import { Component, inject, computed } from '@angular/core';
import { MatTreeModule, MatTreeNode, MatTreeNestedDataSource } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContextMenuServiceImpl } from './context-menu.service';
import { ContextMenuActionMetadata } from './models/action.model';

interface TreeNode {
    name: string;
    type: 'provider' | 'action';
    metadata?: ContextMenuActionMetadata;
    children?: TreeNode[];
}

@Component({
    selector: 'app-context-menu-dev-tool',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatTreeModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule
    ],
    template: `
        <div class="dev-tool-container">
            <div class="header">
                <h2>ContextMenu Registry - Narzędzie Deweloperskie</h2>
                <button mat-button (click)="refresh()">
                    <mat-icon>refresh</mat-icon>
                    Odśwież
                </button>
            </div>
            
            <div class="stats">
                <div class="stat-card">
                    <mat-icon class="stat-icon">extension</mat-icon>
                    <div class="stat-content">
                        <div class="stat-value">{{ providerCount() }}</div>
                        <div class="stat-label">Zarejestrowanych Providerów</div>
                    </div>
                </div>
                <div class="stat-card">
                    <mat-icon class="stat-icon">list</mat-icon>
                    <div class="stat-content">
                        <div class="stat-value">{{ totalActionCount() }}</div>
                        <div class="stat-label">Całkowita liczba akcji</div>
                    </div>
                </div>
            </div>
            
            <div class="filter-section">
                <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Filtruj po typie kontekstu</mat-label>
                    <input matInput [(ngModel)]="filterText" placeholder="np. table-row, list-item...">
                    <mat-icon matSuffix>search</mat-icon>
                </mat-form-field>
            </div>
            
            <div class="tree-container">
                <mat-tree [dataSource]="dataSource">
                    <mat-tree-node *matTreeNodeDef="let node" matTreeNodeToggle>
                        <div class="node-content" [class.provider-node]="node.type === 'provider'" [class.action-node]="node.type === 'action'">
                            <mat-icon *ngIf="node.type === 'provider' && hasChild(node.type, node)">
                                folder
                            </mat-icon>
                            <mat-icon *ngIf="node.type === 'action'">
                                description
                            </mat-icon>
                            <span class="node-name">{{ node.name }}</span>
                            <span class="node-type" *ngIf="node.type === 'action'">{{ node.metadata?.action.contextType }}</span>
                        </div>
                    </mat-tree-node>
                    
                    <mat-tree-node *matTreeNodeDef="let node; when: hasChild" matTreeNodeToggle>
                        <div class="node-content provider-node">
                            <mat-icon>folder_open</mat-icon>
                            <span class="node-name">{{ node.name }}</span>
                            <span class="action-count">{{ node.children?.length }} akcji</span>
                        </div>
                        
                        <mat-tree-node *matTreeNodeDef="let child; when: hasChild" matTreeNodeToggle>
                            <div class="node-content provider-node">
                                <mat-icon>folder_open</mat-icon>
                                <span class="node-name">{{ child.name }}</span>
                                <span class="action-count">{{ child.children?.length }} akcji</span>
                            </div>
                        </mat-tree-node>
                        
                        <mat-tree-node *matTreeNodeDef="let action; when: isAction">
                            <div class="node-content action-node">
                                <mat-icon>description</mat-icon>
                                <span class="node-name">{{ action.name }}</span>
                                <span class="node-type">{{ action.metadata?.action.contextType }}</span>
                                <span class="node-category" *ngIf="action.metadata?.action.category">
                                    {{ action.metadata?.action.category }}
                                </span>
                            </div>
                        </mat-tree-node>
                    </mat-tree-node>
                </mat-tree>
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
        
        .provider-node {
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
    dataSource = new MatTreeNestedDataSource<TreeNode>();
    nestedNodeControl = new MatTreeNode();
    
    treeData = computed(() => {
        const actionsByProvider = this.contextMenuService.getActionsByProvider();
        const providers = this.contextMenuService.getRegisteredProviders();
        
        const nodes: TreeNode[] = providers.map(provider => {
            const providerId = provider.getProviderId();
            const providerName = provider.getProviderName();
            const actions = actionsByProvider.get(providerId) || [];
            
            const filteredActions = this.filterText 
                ? actions.filter(a => a.contextType.includes(this.filterText))
                : actions;
            
            const actionNodes: TreeNode[] = filteredActions.map(action => ({
                name: action.label,
                type: 'action' as const,
                metadata: {
                    action,
                    providerId,
                    providerName,
                    registeredAt: new Date()
                }
            }));
            
            return {
                name: `${providerName} (${providerId})`,
                type: 'provider' as const,
                children: actionNodes.length > 0 ? actionNodes : undefined
            };
        }).filter(node => node.children && node.children.length > 0);
        
        return nodes;
    });
    
    providerCount = computed(() => this.contextMenuService.getRegisteredProviders().length);
    totalActionCount = computed(() => {
        const actionsByProvider = this.contextMenuService.getActionsByProvider();
        let total = 0;
        actionsByProvider.forEach(actions => {
            total += actions.length;
        });
        return total;
    });
    
    constructor() {
        this.dataSource.data = this.treeData();
    }
    
    refresh(): void {
        this.dataSource.data = this.treeData();
    }
    
    hasChild(_: number, node: TreeNode): boolean {
        return !!node.children && node.children.length > 0;
    }
    
    isAction(_: number, node: TreeNode): boolean {
        return node.type === 'action';
    }
}
