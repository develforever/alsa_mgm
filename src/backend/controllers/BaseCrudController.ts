import { Controller, Get, Query, Post, Body, Patch, Delete, Request, Path } from "tsoa";
import { Repository, ObjectLiteral, FindOptionsWhere, Like, FindManyOptions } from "typeorm";
import { ApiError, ApiResponse, ApiResponseInfo, ApiResponseSingle } from "../../shared/api/ApiResponse";
import { ApiRequest } from "@shared/api/ApiRequest";
import { sanitizeLikeFilter } from "../utils/filter.utils";

export interface CrudOptions<T extends ObjectLiteral> {
    filterableColumns?: (keyof T)[];
    defaultSort?: { column: keyof T; order: "ASC" | "DESC" };
    primaryKey: keyof T;
    entityName: string;
}

export abstract class BaseCrudController<T extends ObjectLiteral, CreateDTO, UpdateDTO, ResponseDTO> extends Controller {
    protected abstract getRepository(): Repository<T>;
    protected abstract getOptions(): CrudOptions<T>;
    protected abstract toResponseDto(entity: T): ResponseDTO;
    protected abstract toSingleResponseDto(entity: T): ResponseDTO;
    protected abstract createEntity(dto: CreateDTO, user?: ApiRequest["user"]): T | Promise<T>;
    protected abstract validateCreate?(dto: CreateDTO): string | null;
    protected abstract validateUpdate?(dto: UpdateDTO): string | null;

    @Get("")
    public async getAll(
        @Query() page = 0,
        @Query() size = 10,
        @Query() filter?: string
    ): Promise<ApiResponse<ResponseDTO[]>> {
        const repo = this.getRepository();
        const options = this.getOptions();

        const where: FindOptionsWhere<T> = {};

        if (filter && options.filterableColumns && options.filterableColumns.length > 0) {
            const sanitizedFilter = sanitizeLikeFilter(filter);
            if (sanitizedFilter) {
                // Apply filter to first filterable column
                const filterColumn = options.filterableColumns[0];
                (where as Record<string, unknown>)[String(filterColumn)] = Like(`%${sanitizedFilter}%`);
            }
        }

        const findOptions: FindManyOptions<T> = {
            skip: (page > 0 ? page - 1 : 0) * size,
            take: size,
            order: options.defaultSort ? {
                [options.defaultSort.column as string]: options.defaultSort.order
            } as unknown as FindManyOptions<T>['order'] : undefined,
            where,
        };

        const [items, total] = await repo.findAndCount(findOptions);

        return {
            data: items.map(item => this.toResponseDto(item)),
            meta: {
                page,
                limit: size,
                total
            }
        };
    }

    @Get("{id}")
    public async getOne(
        @Path() id: number
    ): Promise<ApiResponseSingle<ResponseDTO> | ApiError> {
        const repo = this.getRepository();
        const options = this.getOptions();

        const primaryKey = options.primaryKey;
        const where: FindOptionsWhere<T> = { [primaryKey]: id } as FindOptionsWhere<T>;

        const item = await repo.findOneBy(where);

        if (!item) {
            return {
                message: `${options.entityName} not found`,
                code: 404
            };
        }

        return {
            data: this.toSingleResponseDto(item),
            meta: {
                entity: {
                    primaryKey: String(primaryKey)
                }
            }
        };
    }

    @Post("")
    public async create(
        @Body() body: CreateDTO,
        @Request() req: ApiRequest
    ): Promise<ApiResponse<ResponseDTO> | ApiError> {
        const repo = this.getRepository();
        const user = req.user;

        if (this.validateCreate) {
            const error = this.validateCreate(body);
            if (error) {
                return {
                    message: error,
                    code: 400
                };
            }
        }

        const newEntity = await this.createEntity(body, user);

        const saved = await repo.save(newEntity, {
            data: { userEmail: user?.userEmail }
        });

        return {
            data: this.toResponseDto(saved)
        };
    }

    @Patch("{id}")
    public async update(
        @Path() id: number,
        @Body() body: UpdateDTO,
    ): Promise<ApiResponseSingle<ResponseDTO> | ApiError> {
        const repo = this.getRepository();
        const options = this.getOptions();

        if (this.validateUpdate) {
            const error = this.validateUpdate(body);
            if (error) {
                return {
                    message: error,
                    code: 400
                };
            }
        }

        const primaryKey = options.primaryKey;
        const where: FindOptionsWhere<T> = { [primaryKey]: id } as FindOptionsWhere<T>;

        await repo.update(where, body as unknown as Partial<T>);

        const updated = await repo.findOneBy(where);

        if (!updated) {
            return {
                message: `${options.entityName} not found`,
                code: 404
            };
        }

        return {
            data: this.toSingleResponseDto(updated)
        };
    }

    @Delete("{id}")
    public async delete(
        @Path() id: number
    ): Promise<ApiResponseInfo> {
        const repo = this.getRepository();
        const options = this.getOptions();

        const primaryKey = options.primaryKey;
        const where: FindOptionsWhere<T> = { [primaryKey]: id } as FindOptionsWhere<T>;

        await repo.softDelete(where);

        return {
            message: `${options.entityName} removed`
        };
    }
}
