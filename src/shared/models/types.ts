export interface Product {
  ProductID: number;
  Name: string;
  Active: number;
}

export interface ALAssLine {
  ALAssLineID: number;
  ProductID: number;
  Name: string;
  Status: LineStatus;
  product?: Product;
}

export enum LineStatus {
  Active = 1,
  Locked = 2,
  Closed = 3
}

export interface ALWStation {
  ALWStationID: number;
  Name: string;
  ShortName: string;
  PCName: string;
  AutoStart: number;
}

export interface Allocation {
  ALAssLineWStationAllocationID: number;
  ALAssLineID: number;
  ALWStationID: number;
  Sort: number;
  assemblyLine?: ALAssLine;
  workstation?: ALWStation;
}

export interface AuditLog {
  id: number;
  action: string;
  entityName: string;
  entityId: number;
  details: string;
  userEmail: string;
  timestamp: string;
}

export interface User {
  id: number;
  email: string;
  nodeId: string;
  displayName: string;
  username: string;
  profileUrl: string;
  photos: [
    {
      value: string;
    }
  ];
  provider: string;
  userEmail: string;
  userAvatar: string;
  accessToken: string;
  role: string;
  // Extended fields from DB
  avatarUrl?: string;
  isActive?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
}

export enum ProductionPlanStatus {
  Draft = 'draft',
  Scheduled = 'scheduled',
  InProgress = 'in_progress',
  Completed = 'completed',
  Cancelled = 'cancelled'
}

export enum ProductionPriority {
  Low = 1,
  Normal = 2,
  High = 3,
  Critical = 4
}

export interface ProductionPlan {
  id: number;
  productId: number;
  product?: Product;
  assemblyLineId: number;
  assemblyLine?: ALAssLine;
  workstations?: ALWStation[];
  plannedStartDate: string;
  plannedEndDate: string;
  plannedQuantity: number;
  actualStartDate?: string | null;
  actualEndDate?: string | null;
  actualQuantity: number;
  status: ProductionPlanStatus;
  priority: ProductionPriority;
  notes?: string | null;
  createdBy: number;
  creator?: User;
  createdAt: string;
  updatedAt: string;
}
