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