export interface Product {
  ProductID: number;
  Name: string;
  Active: number;
}

export interface ALAssLine {
  ALAssLineID: number;
  ProductID: number;
  Name: string;
  Status: number;
  product?: Product; // Relacja dociągnięta przez TypeORM
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