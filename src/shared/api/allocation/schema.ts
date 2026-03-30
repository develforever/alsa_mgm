export interface GetAllocationSchema {
    ALAssLineWStationAllocationID: number;
    ALAssLineID: number;
    ALWStationID: number;
    Sort: number;
    CreatedAt: Date;
    UpdatedAt: Date;
    assemblyLine?: {
        ALAssLineID: number;
        Name: string;
        ProductID: number;
        Status: number;
        product?: {
            ProductID: number;
            Name: string;
            Active: number;
        };
    };
    workstation?: {
        ALWStationID: number;
        Name: string;
        ShortName: string;
        PCName?: string;
        AutoStart: number;
    };
}

export interface GetAllocationsSchema {
    ALAssLineWStationAllocationID: number;
    ALAssLineID: number;
    ALWStationID: number;
    Sort: number;
    CreatedAt: Date;
    UpdatedAt: Date;
    assemblyLine?: {
        ALAssLineID: number;
        Name: string;
        ProductID: number;
        Status: number;
        product?: {
            ProductID: number;
            Name: string;
            Active: number;
        };
    };
    workstation?: {
        ALWStationID: number;
        Name: string;
        ShortName: string;
        PCName?: string;
        AutoStart: number;
    };
}

export interface PostAllocationsSchema {
    ALAssLineID: number;
    ALWStationID: number;
}

export interface PatchAllocationsSchema {
    ALAssLineID?: number;
    ALWStationID?: number;
    Sort?: number;
}
