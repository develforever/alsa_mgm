export interface GetLineSchema {
    ALAssLineID: number;
    ProductID: number;
    Name: string;
    Status: number;
    CreatedAt: Date;
    UpdatedAt: Date;
}

export interface GetLinesSchema {
    ALAssLineID: number;
    ProductID: number;
    Name: string;
    Status: number;
    CreatedAt: Date;
    UpdatedAt: Date;
}

export interface PostLinesSchema {
    ProductID: number;
    Name: string;
    Status: number;
}

export interface PatchLinesSchema {
    ProductID?: number;
    Name?: string;
    Status?: number;
}
