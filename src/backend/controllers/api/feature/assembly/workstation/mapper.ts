import { ApiResponseList, ApiResponseSingle } from "@shared/api/ApiResponse";
import { GetWorkstationSchema, GetWorkstationsSchema } from "@shared/api/workstation/schema";
import { AppDataSource } from "config/data-source";
import { ALWStation } from "entity/ALWStation";

export class WorkstationMapper {

    public static toGetWorkstationsSchema(workstations: { items: ALWStation[], total: number, page: number, size: number }): ApiResponseList<GetWorkstationsSchema> {

        const items = workstations.items.map(workstation => ({
            ALWStationID: workstation.ALWStationID,
            Name: workstation.Name,
            ShortName: workstation.ShortName,
            PCName: workstation.PCName,
            AutoStart: workstation.AutoStart,
            CreatedAt: workstation.createdAt,
            UpdatedAt: workstation.updatedAt,
        }));

        const entityMetadata = AppDataSource.getMetadata(ALWStation);

        return {
            data: items,
            meta: {
                page: workstations.page,
                limit: workstations.size,
                total: workstations.total,
                links: {
                    details: `/api/workstations/{id}`
                },
                entity: {
                    primaryKey: entityMetadata.primaryColumns.map(column => column.propertyName).join(','),
                }
            }
        };
    }

    public static toGetWorkstationSchema(workstation: ALWStation): ApiResponseSingle<GetWorkstationSchema> {

        const entityMetadata = AppDataSource.getMetadata(ALWStation);

        return {
            data: {
                ALWStationID: workstation.ALWStationID,
                Name: workstation.Name,
                ShortName: workstation.ShortName,
                PCName: workstation.PCName,
                AutoStart: workstation.AutoStart,
                CreatedAt: workstation.createdAt,
                UpdatedAt: workstation.updatedAt,
            },
            meta: {
                entity: {
                    primaryKey: entityMetadata.primaryColumns.map(column => column.propertyName).join(','),
                }
            }
        };
    }

}
