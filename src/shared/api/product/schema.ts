

export interface GetProductSchema {
    ProductID: number;
    Name: string;
    Active: boolean;
    CreatedAt: Date;
    UpdatedAt: Date;
}

export interface GetProductsSchema {
    ProductID: number;
    Name: string;
    Active: boolean;
    CreatedAt: Date;
    UpdatedAt: Date;
}

export interface PostProductsSchema {
    Name: string;
    Active: boolean;
}

export interface PatchProductsSchema {
    Name: string;
    Active: boolean;
}