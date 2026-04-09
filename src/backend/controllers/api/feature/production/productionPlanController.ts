import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Path,
    Body,
    Query,
    Route,
    Tags,
    Response,
    SuccessResponse,
    Request,
} from "tsoa";
import { productionPlanRepo, ProductionPlanFilter } from "../../../../repositories/ProductionPlanRepository";
import { ProductionPlan, ProductionPlanStatus, ProductionPriority } from "../../../../entity/ProductionPlan";
import { AuditLog } from "../../../../entity/AuditLog";
import { AppDataSource } from "../../../../config/data-source";
import { ApiResponse, ApiResponseSingle, ApiError } from "../../../../../shared/api/ApiResponse";

interface CreateProductionPlanRequest {
    productId: number;
    assemblyLineId: number;
    workstationIds?: number[];
    plannedStartDate: string;
    plannedEndDate: string;
    plannedQuantity: number;
    priority?: ProductionPriority;
    notes?: string;
}

interface UpdateProductionPlanRequest {
    productId?: number;
    assemblyLineId?: number;
    workstationIds?: number[];
    plannedStartDate?: string;
    plannedEndDate?: string;
    plannedQuantity?: number;
    status?: ProductionPlanStatus;
    priority?: ProductionPriority;
    notes?: string;
    actualStartDate?: string;
    actualEndDate?: string;
    actualQuantity?: number;
}

const auditRepo = AppDataSource.getRepository(AuditLog);

@Route("api/production-plans")
@Tags("Production Plans")
export class ProductionPlanController extends Controller {
    private async logAudit(
        action: string,
        entityName: string,
        entityId: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        details: any,
        userEmail?: string
    ): Promise<void> {
        const auditLog = new AuditLog();
        auditLog.action = action;
        auditLog.entityName = entityName;
        auditLog.entityId = entityId;
        auditLog.details = details;
        auditLog.userEmail = userEmail || 'unknown';
        await auditRepo.save(auditLog);
    }
    /**
     * Get all production plans with pagination and filtering
     */
    @Get()
    @Response<ApiError>(400, "Bad Request")
    @SuccessResponse(200, "OK")
    public async getAll(
        @Query() page = 0,
        @Query() size = 10,
        @Query() productId?: number,
        @Query() assemblyLineId?: number,
        @Query() status?: ProductionPlanStatus,
        @Query() startDateFrom?: string,
        @Query() startDateTo?: string
    ): Promise<ApiResponse<ProductionPlan[]>> {
        const filter: ProductionPlanFilter = {};
        
        if (productId) filter.productId = productId;
        if (assemblyLineId) filter.assemblyLineId = assemblyLineId;
        if (status) filter.status = status;
        if (startDateFrom) {
            const date = new Date(startDateFrom);
            if (isNaN(date.getTime())) {
                this.setStatus(400);
                return { message: "Invalid startDateFrom format", code: 400 };
            }
            filter.startDateFrom = date;
        }
        if (startDateTo) {
            const date = new Date(startDateTo);
            if (isNaN(date.getTime())) {
                this.setStatus(400);
                return { message: "Invalid startDateTo format", code: 400 };
            }
            filter.startDateTo = date;
        }

        const [plans, total] = await productionPlanRepo.findAll(page, size, filter);

        return {
            data: plans,
            meta: {
                page,
                limit: size,
                total
            }
        };
    }

    /**
     * Get a single production plan by ID
     */
    @Get("{id}")
    @Response<ApiError>(404, "Not Found")
    @SuccessResponse(200, "OK")
    public async getOne(@Path() id: number): Promise<ApiResponseSingle<ProductionPlan> | ApiError> {
        const plan = await productionPlanRepo.findById(id);
        
        if (!plan) {
            this.setStatus(404);
            return { message: "Production plan not found", code: 404 };
        }

        return { data: plan };
    }

    /**
     * Create a new production plan
     */
    @Post()
    @Response<ApiError>(400, "Bad Request")
    @Response<ApiError>(409, "Conflict - overlapping plan exists")
    @SuccessResponse(201, "Created")
    public async create(
        @Request() req: { user?: { dbUser?: { id: number } } },
        @Body() request: CreateProductionPlanRequest
    ): Promise<ApiResponseSingle<ProductionPlan> | ApiError> {
        // Validate dates
        const startDate = new Date(request.plannedStartDate);
        const endDate = new Date(request.plannedEndDate);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            this.setStatus(400);
            return { message: "Invalid date format", code: 400 };
        }

        if (startDate >= endDate) {
            this.setStatus(400);
            return { message: "Planned end date must be after start date", code: 400 };
        }

        // Check for overlapping plans
        const overlapping = await productionPlanRepo.findOverlappingPlans(
            request.assemblyLineId,
            startDate,
            endDate
        );

        if (overlapping.length > 0) {
            this.setStatus(409);
            return { 
                message: "Overlapping production plan exists for this assembly line",
                code: 409
            };
        }

        // Create plan
        const plan = new ProductionPlan();
        plan.productId = request.productId;
        plan.assemblyLineId = request.assemblyLineId;
        plan.plannedStartDate = startDate;
        plan.plannedEndDate = endDate;
        plan.plannedQuantity = request.plannedQuantity;
        plan.priority = request.priority ?? ProductionPriority.Normal;
        plan.notes = request.notes ?? null;
        plan.status = ProductionPlanStatus.Draft;
        plan.actualQuantity = 0;
        plan.createdBy = req.user?.dbUser?.id || null;

        // Workstations will be set via ManyToMany relation after save

        const saved = await productionPlanRepo.save(plan);
        
        await this.logAudit(
            'CREATE',
            'ProductionPlan',
            saved.id.toString(),
            { productId: saved.productId, assemblyLineId: saved.assemblyLineId, status: saved.status },
            req.user?.dbUser?.id.toString()
        );

        this.setStatus(201);
        return { data: saved };
    }

    /**
     * Update a production plan
     */
    @Put("{id}")
    @Response<ApiError>(400, "Bad Request")
    @Response<ApiError>(404, "Not Found")
    @Response<ApiError>(409, "Conflict - overlapping plan exists")
    @SuccessResponse(200, "OK")
    public async update(
        @Path() id: number,
        @Request() req: { user?: { dbUser?: { id: number } } },
        @Body() request: UpdateProductionPlanRequest
    ): Promise<ApiResponseSingle<ProductionPlan> | ApiError> {
        const existing = await productionPlanRepo.findById(id);
        
        if (!existing) {
            this.setStatus(404);
            return { message: "Production plan not found", code: 404 };
        }

        // Check if plan can be modified
        if (existing.status === ProductionPlanStatus.Completed || 
            existing.status === ProductionPlanStatus.Cancelled) {
            this.setStatus(400);
            return { message: "Cannot modify completed or cancelled plans", code: 400 };
        }

        // Build update data
        const updateData: Partial<ProductionPlan> = {};

        if (request.plannedStartDate) {
            const date = new Date(request.plannedStartDate);
            if (isNaN(date.getTime())) {
                this.setStatus(400);
                return { message: "Invalid plannedStartDate format", code: 400 };
            }
            updateData.plannedStartDate = date;
        }
        if (request.plannedEndDate) {
            const date = new Date(request.plannedEndDate);
            if (isNaN(date.getTime())) {
                this.setStatus(400);
                return { message: "Invalid plannedEndDate format", code: 400 };
            }
            updateData.plannedEndDate = date;
        }
        if (request.actualStartDate) {
            const date = new Date(request.actualStartDate);
            if (isNaN(date.getTime())) {
                this.setStatus(400);
                return { message: "Invalid actualStartDate format", code: 400 };
            }
            updateData.actualStartDate = date;
        }
        if (request.actualEndDate) {
            const date = new Date(request.actualEndDate);
            if (isNaN(date.getTime())) {
                this.setStatus(400);
                return { message: "Invalid actualEndDate format", code: 400 };
            }
            updateData.actualEndDate = date;
        }

        // Validate dates if both are set or one is being updated
        const newStartDate = updateData.plannedStartDate ?? existing.plannedStartDate;
        const newEndDate = updateData.plannedEndDate ?? existing.plannedEndDate;

        if (newStartDate >= newEndDate) {
            this.setStatus(400);
            return { message: "Planned end date must be after start date", code: 400 };
        }

        // Check for overlapping plans if dates or line changed
        const lineId = request.assemblyLineId ?? existing.assemblyLineId;
        if (request.plannedStartDate || request.plannedEndDate || request.assemblyLineId) {
            const overlapping = await productionPlanRepo.findOverlappingPlans(
                lineId,
                newStartDate,
                newEndDate,
                id
            );

            if (overlapping.length > 0) {
                this.setStatus(409);
                return { 
                    message: "Overlapping production plan exists for this assembly line",
                    code: 409
                };
            }
        }

        // Apply updates
        if (request.productId) updateData.productId = request.productId;
        if (request.assemblyLineId) updateData.assemblyLineId = request.assemblyLineId;
        if (request.plannedQuantity) updateData.plannedQuantity = request.plannedQuantity;
        if (request.status) updateData.status = request.status;
        if (request.priority) updateData.priority = request.priority;
        if (request.notes !== undefined) updateData.notes = request.notes;
        if (request.actualStartDate) updateData.actualStartDate = new Date(request.actualStartDate);
        if (request.actualEndDate) updateData.actualEndDate = new Date(request.actualEndDate);
        if (request.actualQuantity !== undefined) updateData.actualQuantity = request.actualQuantity;

        await productionPlanRepo.update(id, updateData);
        
        const updated = await productionPlanRepo.findById(id);
        
        await this.logAudit(
            'UPDATE',
            'ProductionPlan',
            id.toString(),
            updateData,
            req.user?.dbUser?.id.toString()
        );

        return { data: updated! };
    }

    /**
     * Delete a production plan
     */
    @Delete("{id}")
    @Response<ApiError>(404, "Not Found")
    @SuccessResponse(204, "No Content")
    public async delete(
        @Path() id: number,
        @Request() req: { user?: { dbUser?: { id: number } } }
    ): Promise<void | ApiError> {
        const existing = await productionPlanRepo.findById(id);
        
        if (!existing) {
            this.setStatus(404);
            return { message: "Production plan not found", code: 404 };
        }

        // Only allow deletion of draft or scheduled plans
        if (existing.status === ProductionPlanStatus.InProgress || 
            existing.status === ProductionPlanStatus.Completed) {
            this.setStatus(400);
            return { message: "Cannot delete in-progress or completed plans. Cancel them first.", code: 400 };
        }

        await productionPlanRepo.delete(id);
        
        await this.logAudit(
            'DELETE',
            'ProductionPlan',
            id.toString(),
            { status: existing.status },
            req.user?.dbUser?.id.toString()
        );
        
        this.setStatus(204);
    }

    /**
     * Get production plans within a date range (for calendar view)
     */
    @Get("calendar/range")
    @Response<ApiError>(400, "Bad Request")
    @SuccessResponse(200, "OK")
    public async getByDateRange(
        @Query() startDate: string,
        @Query() endDate: string
    ): Promise<ApiResponse<ProductionPlan[]> | ApiError> {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            this.setStatus(400);
            return { message: "Invalid date format", code: 400 };
        }

        const plans = await productionPlanRepo.findByDateRange(start, end);

        return { data: plans };
    }

    /**
     * Get upcoming production plans
     */
    @Get("upcoming/list")
    @SuccessResponse(200, "OK")
    public async getUpcoming(
        @Query() limit = 10
    ): Promise<ApiResponse<ProductionPlan[]>> {
        const plans = await productionPlanRepo.findUpcoming(limit);
        return { data: plans };
    }

    /**
     * Get production plan statistics
     */
    @Get("stats/overview")
    @SuccessResponse(200, "OK")
    public async getStats(): Promise<ApiResponse<{
        total: number;
        byStatus: Record<string, number>;
        upcoming: number;
    }>> {
        const total = await productionPlanRepo.countByStatus(ProductionPlanStatus.Draft) +
                      await productionPlanRepo.countByStatus(ProductionPlanStatus.Scheduled) +
                      await productionPlanRepo.countByStatus(ProductionPlanStatus.InProgress) +
                      await productionPlanRepo.countByStatus(ProductionPlanStatus.Completed) +
                      await productionPlanRepo.countByStatus(ProductionPlanStatus.Cancelled);

        const byStatus = {
            draft: await productionPlanRepo.countByStatus(ProductionPlanStatus.Draft),
            scheduled: await productionPlanRepo.countByStatus(ProductionPlanStatus.Scheduled),
            inProgress: await productionPlanRepo.countByStatus(ProductionPlanStatus.InProgress),
            completed: await productionPlanRepo.countByStatus(ProductionPlanStatus.Completed),
            cancelled: await productionPlanRepo.countByStatus(ProductionPlanStatus.Cancelled),
        };

        const upcoming = await productionPlanRepo.findUpcoming(100);

        return {
            data: {
                total,
                byStatus,
                upcoming: upcoming.length
            }
        };
    }
}
