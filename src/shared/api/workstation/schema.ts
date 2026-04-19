export interface GetWorkstationSchema {
    ALWStationID: number;
    Name: string;
    ShortName: string;
    PCName?: string;
    AutoStart: boolean;
    CreatedAt: Date;
    UpdatedAt: Date;
}

export interface GetWorkstationsSchema {
    ALWStationID: number;
    Name: string;
    ShortName: string;
    PCName?: string;
    AutoStart: boolean;
    CreatedAt: Date;
    UpdatedAt: Date;
}

export interface PostWorkstationsSchema {
    Name: string;
    ShortName: string;
    PCName?: string;
    AutoStart?: boolean;
}

export interface PatchWorkstationsSchema {
    Name?: string;
    ShortName?: string;
    PCName?: string;
    AutoStart?: boolean;
}
