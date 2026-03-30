import { ApiResponseList, ApiResponseSingle } from "@shared/api/ApiResponse";
import { GetLineSchema, GetLinesSchema } from "@shared/api/line/schema";
import { AppDataSource } from "config/data-source";
import { ALAssLine } from "entity/ALAssLine";

export class LineMapper {

    public static toGetLinesSchema(lines: { items: ALAssLine[], total: number, page: number, size: number }): ApiResponseList<GetLinesSchema> {

        const items = lines.items.map(line => ({
            ALAssLineID: line.ALAssLineID,
            ProductID: line.ProductID,
            Name: line.Name,
            Status: line.Status,
            CreatedAt: line.createdAt,
            UpdatedAt: line.updatedAt,
        }));

        const entityMetadata = AppDataSource.getMetadata(ALAssLine);

        return {
            data: items,
            meta: {
                page: lines.page,
                limit: lines.size,
                total: lines.total,
                links: {
                    details: `/api/lines/{id}`
                },
                entity: {
                    primaryKey: entityMetadata.primaryColumns.map(column => column.propertyName).join(','),
                }
            }
        };
    }

    public static toGetLineSchema(line: ALAssLine): ApiResponseSingle<GetLineSchema> {

        const entityMetadata = AppDataSource.getMetadata(ALAssLine);

        return {
            data: {
                ALAssLineID: line.ALAssLineID,
                ProductID: line.ProductID,
                Name: line.Name,
                Status: line.Status,
                CreatedAt: line.createdAt,
                UpdatedAt: line.updatedAt,
            },
            meta: {
                entity: {
                    primaryKey: entityMetadata.primaryColumns.map(column => column.propertyName).join(','),
                }
            }
        };
    }

}
