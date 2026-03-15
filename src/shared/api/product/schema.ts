

export interface GetProductSchema {
    ProductID: number;
    Name: string;
    Active: number;
    CreatedAt: Date;
    UpdatedAt: Date;
}

export interface GetProductsSchema {
    ProductID: number;
    Name: string;
    Active: number;
    CreatedAt: Date;
    UpdatedAt: Date;
}

export interface PostProductsSchema {
    Name: string;
    Active: number;
}

export interface PatchProductsSchema {
    Name: string;
    Active: number;
}