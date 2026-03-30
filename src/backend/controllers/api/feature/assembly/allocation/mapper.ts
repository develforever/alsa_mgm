import { ApiResponseList, ApiResponseSingle } from "@shared/api/ApiResponse";
import { GetAllocationSchema, GetAllocationsSchema } from "@shared/api/allocation/schema";
import { AppDataSource } from "config/data-source";
import { ALAssLineWStationAllocation } from "entity/ALAssLineWStationAllocation";

export class AllocationMapper {

    public static toGetAllocationsSchema(allocations: { items: ALAssLineWStationAllocation[], total: number, page: number, size: number }): ApiResponseList<GetAllocationsSchema> {

        const items = allocations.items.map(allocation => ({
            ALAssLineWStationAllocationID: allocation.ALAssLineWStationAllocationID,
            ALAssLineID: allocation.ALAssLineID,
            ALWStationID: allocation.ALWStationID,
            Sort: allocation.Sort,
            CreatedAt: allocation.createdAt,
            UpdatedAt: allocation.updatedAt,
            assemblyLine: allocation.assemblyLine ? {
                ALAssLineID: allocation.assemblyLine.ALAssLineID,
                Name: allocation.assemblyLine.Name,
                ProductID: allocation.assemblyLine.ProductID,
                Status: allocation.assemblyLine.Status,
                product: allocation.assemblyLine.product ? {
                    ProductID: allocation.assemblyLine.product.ProductID,
                    Name: allocation.assemblyLine.product.Name,
                    Active: allocation.assemblyLine.product.Active,
                } : undefined,
            } : undefined,
            workstation: allocation.workstation ? {
                ALWStationID: allocation.workstation.ALWStationID,
                Name: allocation.workstation.Name,
                ShortName: allocation.workstation.ShortName,
                PCName: allocation.workstation.PCName,
                AutoStart: allocation.workstation.AutoStart,
            } : undefined,
        }));

        const entityMetadata = AppDataSource.getMetadata(ALAssLineWStationAllocation);

        return {
            data: items,
            meta: {
                page: allocations.page,
                limit: allocations.size,
                total: allocations.total,
                links: {
                    details: `/api/allocations/{id}`
                },
                entity: {
                    primaryKey: entityMetadata.primaryColumns.map(column => column.propertyName).join(','),
                }
            }
        };
    }

    public static toGetAllocationSchema(allocation: ALAssLineWStationAllocation): ApiResponseSingle<GetAllocationSchema> {

        const entityMetadata = AppDataSource.getMetadata(ALAssLineWStationAllocation);

        return {
            data: {
                ALAssLineWStationAllocationID: allocation.ALAssLineWStationAllocationID,
                ALAssLineID: allocation.ALAssLineID,
                ALWStationID: allocation.ALWStationID,
                Sort: allocation.Sort,
                CreatedAt: allocation.createdAt,
                UpdatedAt: allocation.updatedAt,
                assemblyLine: allocation.assemblyLine ? {
                    ALAssLineID: allocation.assemblyLine.ALAssLineID,
                    Name: allocation.assemblyLine.Name,
                    ProductID: allocation.assemblyLine.ProductID,
                    Status: allocation.assemblyLine.Status,
                    product: allocation.assemblyLine.product ? {
                        ProductID: allocation.assemblyLine.product.ProductID,
                        Name: allocation.assemblyLine.product.Name,
                        Active: allocation.assemblyLine.product.Active,
                    } : undefined,
                } : undefined,
                workstation: allocation.workstation ? {
                    ALWStationID: allocation.workstation.ALWStationID,
                    Name: allocation.workstation.Name,
                    ShortName: allocation.workstation.ShortName,
                    PCName: allocation.workstation.PCName,
                    AutoStart: allocation.workstation.AutoStart,
                } : undefined,
            },
            meta: {
                entity: {
                    primaryKey: entityMetadata.primaryColumns.map(column => column.propertyName).join(','),
                }
            }
        };
    }

}
