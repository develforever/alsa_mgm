export interface GetWorkstationSchema {
    ALWStationID: number;
    Name: string;
    ShortName: string;
    PCName?: string;
    AutoStart: number;
    CreatedAt: Date;
    UpdatedAt: Date;
}

export interface GetWorkstationsSchema {
    ALWStationID: number;
    Name: string;
    ShortName: string;
    PCName?: string;
    AutoStart: number;
    CreatedAt: Date;
    UpdatedAt: Date;
}

export interface PostWorkstationsSchema {
    Name: string;
    ShortName: string;
    PCName?: string;
    AutoStart?: number;
}

export interface PatchWorkstationsSchema {
    Name?: string;
    ShortName?: string;
    PCName?: string;
    AutoStart?: number;
}
