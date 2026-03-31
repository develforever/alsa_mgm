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
