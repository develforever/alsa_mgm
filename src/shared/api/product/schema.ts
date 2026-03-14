

export interface GetProductsSchema {
    ProductID: number;
    Name: string;
    Active: number;
    CreatedAt: Date;
    UpdatedAt: Date;
}

export interface PatchProductsSchema {
    Name: string;
    Active: number;
}