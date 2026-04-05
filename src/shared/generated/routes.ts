/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './../../backend/controllers/api/authController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './../../backend/controllers/api/feature/users/userController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ProductionPlanController } from './../../backend/controllers/api/feature/production/productionPlanController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuditLogController } from './../../backend/controllers/api/feature/home/auditLogController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { DashboardController } from './../../backend/controllers/api/feature/dashboard/dashboardController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { WorkstationController } from './../../backend/controllers/api/feature/assembly/workstationController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ProductController } from './../../backend/controllers/api/feature/assembly/productController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LineController } from './../../backend/controllers/api/feature/assembly/lineController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AllocationController } from './../../backend/controllers/api/feature/assembly/allocationController';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "UserRole": {
        "dataType": "refEnum",
        "enums": ["admin","operator","viewer"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "User": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "githubId": {"dataType":"string","required":true},
            "username": {"dataType":"string","required":true},
            "displayName": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "avatarUrl": {"dataType":"string","required":true},
            "role": {"ref":"UserRole","required":true},
            "isActive": {"dataType":"boolean","required":true},
            "lastLoginAt": {"dataType":"datetime","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiError": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "code": {"dataType":"double","required":true},
            "stack": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiMeta": {
        "dataType": "refObject",
        "properties": {
            "page": {"dataType":"double"},
            "limit": {"dataType":"double"},
            "total": {"dataType":"double"},
            "links": {"dataType":"nestedObjectLiteral","nestedProperties":{"details":{"dataType":"string"}}},
            "entity": {"dataType":"nestedObjectLiteral","nestedProperties":{"primaryKey":{"dataType":"string","required":true}}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseList_User_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"User"},"required":true},
            "error": {"ref":"ApiError"},
            "meta": {"ref":"ApiMeta"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseSingle_User_": {
        "dataType": "refObject",
        "properties": {
            "data": {"ref":"User"},
            "error": {"ref":"ApiError"},
            "meta": {"ref":"ApiMeta"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateUserDTO": {
        "dataType": "refObject",
        "properties": {
            "role": {"ref":"UserRole"},
            "isActive": {"dataType":"boolean"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Product": {
        "dataType": "refObject",
        "properties": {
            "_executorEmail": {"dataType":"string"},
            "ProductID": {"dataType":"double","required":true},
            "Name": {"dataType":"string","required":true},
            "Active": {"dataType":"double","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
            "deletedAt": {"dataType":"datetime"},
            "assemblyLines": {"dataType":"array","array":{"dataType":"refObject","ref":"ALAssLine"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ALAssLineStatus": {
        "dataType": "refEnum",
        "enums": [1,2,3],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ALAssLine": {
        "dataType": "refObject",
        "properties": {
            "ALAssLineID": {"dataType":"double","required":true},
            "ProductID": {"dataType":"double","required":true},
            "product": {"ref":"Product","required":true},
            "Name": {"dataType":"string","required":true},
            "Status": {"ref":"ALAssLineStatus","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
            "deletedAt": {"dataType":"datetime"},
            "allocations": {"dataType":"array","array":{"dataType":"refObject","ref":"ALAssLineWStationAllocation"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ALAssLineWStationAllocation": {
        "dataType": "refObject",
        "properties": {
            "_executorEmail": {"dataType":"string"},
            "ALAssLineWStationAllocationID": {"dataType":"double","required":true},
            "ALAssLineID": {"dataType":"double","required":true},
            "ALWStationID": {"dataType":"double","required":true},
            "Sort": {"dataType":"double","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
            "deletedAt": {"dataType":"datetime"},
            "assemblyLine": {"ref":"ALAssLine","required":true},
            "workstation": {"ref":"ALWStation","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ALWStation": {
        "dataType": "refObject",
        "properties": {
            "_executorEmail": {"dataType":"string"},
            "ALWStationID": {"dataType":"double","required":true},
            "Name": {"dataType":"string","required":true},
            "ShortName": {"dataType":"string","required":true},
            "PCName": {"dataType":"string","required":true},
            "AutoStart": {"dataType":"double","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
            "deletedAt": {"dataType":"datetime"},
            "allocations": {"dataType":"array","array":{"dataType":"refObject","ref":"ALAssLineWStationAllocation"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProductionPlanStatus": {
        "dataType": "refEnum",
        "enums": ["draft","scheduled","in_progress","completed","cancelled"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProductionPriority": {
        "dataType": "refEnum",
        "enums": [1,2,3,4],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProductionPlan": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "productId": {"dataType":"double","required":true},
            "product": {"ref":"Product","required":true},
            "assemblyLineId": {"dataType":"double","required":true},
            "assemblyLine": {"ref":"ALAssLine","required":true},
            "workstations": {"dataType":"array","array":{"dataType":"refObject","ref":"ALWStation"},"required":true},
            "plannedStartDate": {"dataType":"datetime","required":true},
            "plannedEndDate": {"dataType":"datetime","required":true},
            "plannedQuantity": {"dataType":"double","required":true},
            "actualStartDate": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"enum","enums":[null]}],"required":true},
            "actualEndDate": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"enum","enums":[null]}],"required":true},
            "actualQuantity": {"dataType":"double","required":true},
            "status": {"ref":"ProductionPlanStatus","required":true},
            "priority": {"ref":"ProductionPriority","required":true},
            "notes": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "createdBy": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "creator": {"ref":"User","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseSingle_ProductionPlan-Array_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"ProductionPlan"}},
            "error": {"ref":"ApiError"},
            "meta": {"ref":"ApiMeta"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseList_ProductionPlan-Array_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"array","array":{"dataType":"refObject","ref":"ProductionPlan"}},"required":true},
            "error": {"ref":"ApiError"},
            "meta": {"ref":"ApiMeta"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseInfo": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_ProductionPlan-Array_": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"ref":"ApiResponseSingle_ProductionPlan-Array_"},{"ref":"ApiResponseList_ProductionPlan-Array_"},{"ref":"ApiResponseInfo"},{"ref":"ApiError"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseSingle_ProductionPlan_": {
        "dataType": "refObject",
        "properties": {
            "data": {"ref":"ProductionPlan"},
            "error": {"ref":"ApiError"},
            "meta": {"ref":"ApiMeta"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateProductionPlanRequest": {
        "dataType": "refObject",
        "properties": {
            "productId": {"dataType":"double","required":true},
            "assemblyLineId": {"dataType":"double","required":true},
            "workstationIds": {"dataType":"array","array":{"dataType":"double"}},
            "plannedStartDate": {"dataType":"string","required":true},
            "plannedEndDate": {"dataType":"string","required":true},
            "plannedQuantity": {"dataType":"double","required":true},
            "priority": {"ref":"ProductionPriority"},
            "notes": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateProductionPlanRequest": {
        "dataType": "refObject",
        "properties": {
            "productId": {"dataType":"double"},
            "assemblyLineId": {"dataType":"double"},
            "workstationIds": {"dataType":"array","array":{"dataType":"double"}},
            "plannedStartDate": {"dataType":"string"},
            "plannedEndDate": {"dataType":"string"},
            "plannedQuantity": {"dataType":"double"},
            "status": {"ref":"ProductionPlanStatus"},
            "priority": {"ref":"ProductionPriority"},
            "notes": {"dataType":"string"},
            "actualStartDate": {"dataType":"string"},
            "actualEndDate": {"dataType":"string"},
            "actualQuantity": {"dataType":"double"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.number_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"double"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseSingle__total-number--byStatus-Record_string.number_--upcoming-number__": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"upcoming":{"dataType":"double","required":true},"byStatus":{"ref":"Record_string.number_","required":true},"total":{"dataType":"double","required":true}}},
            "error": {"ref":"ApiError"},
            "meta": {"ref":"ApiMeta"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseList__total-number--byStatus-Record_string.number_--upcoming-number__": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"upcoming":{"dataType":"double","required":true},"byStatus":{"ref":"Record_string.number_","required":true},"total":{"dataType":"double","required":true}}},"required":true},
            "error": {"ref":"ApiError"},
            "meta": {"ref":"ApiMeta"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse__total-number--byStatus-Record_string.number_--upcoming-number__": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"ref":"ApiResponseSingle__total-number--byStatus-Record_string.number_--upcoming-number__"},{"ref":"ApiResponseList__total-number--byStatus-Record_string.number_--upcoming-number__"},{"ref":"ApiResponseInfo"},{"ref":"ApiError"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AuditLog": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "action": {"dataType":"string","required":true},
            "entityName": {"dataType":"string","required":true},
            "entityId": {"dataType":"string","required":true},
            "details": {"dataType":"any","required":true},
            "userEmail": {"dataType":"string","required":true},
            "timestamp": {"dataType":"datetime","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseList_AuditLog_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"AuditLog"},"required":true},
            "error": {"ref":"ApiError"},
            "meta": {"ref":"ApiMeta"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DashboardMetrics": {
        "dataType": "refObject",
        "properties": {
            "products": {"dataType":"nestedObjectLiteral","nestedProperties":{"inactive":{"dataType":"double","required":true},"active":{"dataType":"double","required":true},"total":{"dataType":"double","required":true}},"required":true},
            "assemblyLines": {"dataType":"nestedObjectLiteral","nestedProperties":{"closed":{"dataType":"double","required":true},"locked":{"dataType":"double","required":true},"active":{"dataType":"double","required":true},"total":{"dataType":"double","required":true}},"required":true},
            "workstations": {"dataType":"nestedObjectLiteral","nestedProperties":{"autoStartEnabled":{"dataType":"double","required":true},"total":{"dataType":"double","required":true}},"required":true},
            "allocations": {"dataType":"nestedObjectLiteral","nestedProperties":{"total":{"dataType":"double","required":true}},"required":true},
            "recentActivity": {"dataType":"nestedObjectLiteral","nestedProperties":{"last30d":{"dataType":"double","required":true},"last7d":{"dataType":"double","required":true},"last24h":{"dataType":"double","required":true}},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AssemblyLineStatusDistribution": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "count": {"dataType":"double","required":true},
            "percentage": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProductAllocationSummary": {
        "dataType": "refObject",
        "properties": {
            "productName": {"dataType":"string","required":true},
            "productId": {"dataType":"double","required":true},
            "lineCount": {"dataType":"double","required":true},
            "workstationCount": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetWorkstationsSchema": {
        "dataType": "refObject",
        "properties": {
            "ALWStationID": {"dataType":"double","required":true},
            "Name": {"dataType":"string","required":true},
            "ShortName": {"dataType":"string","required":true},
            "PCName": {"dataType":"string"},
            "AutoStart": {"dataType":"double","required":true},
            "CreatedAt": {"dataType":"datetime","required":true},
            "UpdatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseSingle_GetWorkstationsSchema_": {
        "dataType": "refObject",
        "properties": {
            "data": {"ref":"GetWorkstationsSchema"},
            "error": {"ref":"ApiError"},
            "meta": {"ref":"ApiMeta"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseList_GetWorkstationsSchema_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"GetWorkstationsSchema"},"required":true},
            "error": {"ref":"ApiError"},
            "meta": {"ref":"ApiMeta"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_GetWorkstationsSchema_": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"ref":"ApiResponseSingle_GetWorkstationsSchema_"},{"ref":"ApiResponseList_GetWorkstationsSchema_"},{"ref":"ApiResponseInfo"},{"ref":"ApiError"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetWorkstationSchema": {
        "dataType": "refObject",
        "properties": {
            "ALWStationID": {"dataType":"double","required":true},
            "Name": {"dataType":"string","required":true},
            "ShortName": {"dataType":"string","required":true},
            "PCName": {"dataType":"string"},
            "AutoStart": {"dataType":"double","required":true},
            "CreatedAt": {"dataType":"datetime","required":true},
            "UpdatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseSingle_GetWorkstationSchema_": {
        "dataType": "refObject",
        "properties": {
            "data": {"ref":"GetWorkstationSchema"},
            "error": {"ref":"ApiError"},
            "meta": {"ref":"ApiMeta"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseSingle_ALWStation_": {
        "dataType": "refObject",
        "properties": {
            "data": {"ref":"ALWStation"},
            "error": {"ref":"ApiError"},
            "meta": {"ref":"ApiMeta"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseList_ALWStation_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"ALWStation"},"required":true},
            "error": {"ref":"ApiError"},
            "meta": {"ref":"ApiMeta"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_ALWStation_": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"ref":"ApiResponseSingle_ALWStation_"},{"ref":"ApiResponseList_ALWStation_"},{"ref":"ApiResponseInfo"},{"ref":"ApiError"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PostWorkstationsSchema": {
        "dataType": "refObject",
        "properties": {
            "Name": {"dataType":"string","required":true},
            "ShortName": {"dataType":"string","required":true},
            "PCName": {"dataType":"string"},
            "AutoStart": {"dataType":"double"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PatchWorkstationsSchema": {
        "dataType": "refObject",
        "properties": {
            "Name": {"dataType":"string"},
            "ShortName": {"dataType":"string"},
            "PCName": {"dataType":"string"},
            "AutoStart": {"dataType":"double"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetProductsSchema": {
        "dataType": "refObject",
        "properties": {
            "ProductID": {"dataType":"double","required":true},
            "Name": {"dataType":"string","required":true},
            "Active": {"dataType":"double","required":true},
            "CreatedAt": {"dataType":"datetime","required":true},
            "UpdatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseSingle_GetProductsSchema_": {
        "dataType": "refObject",
        "properties": {
            "data": {"ref":"GetProductsSchema"},
            "error": {"ref":"ApiError"},
            "meta": {"ref":"ApiMeta"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseList_GetProductsSchema_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"GetProductsSchema"},"required":true},
            "error": {"ref":"ApiError"},
            "meta": {"ref":"ApiMeta"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_GetProductsSchema_": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"ref":"ApiResponseSingle_GetProductsSchema_"},{"ref":"ApiResponseList_GetProductsSchema_"},{"ref":"ApiResponseInfo"},{"ref":"ApiError"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetProductSchema": {
        "dataType": "refObject",
        "properties": {
            "ProductID": {"dataType":"double","required":true},
            "Name": {"dataType":"string","required":true},
            "Active": {"dataType":"double","required":true},
            "CreatedAt": {"dataType":"datetime","required":true},
            "UpdatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseSingle_GetProductSchema_": {
        "dataType": "refObject",
        "properties": {
            "data": {"ref":"GetProductSchema"},
            "error": {"ref":"ApiError"},
            "meta": {"ref":"ApiMeta"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseSingle_Product_": {
        "dataType": "refObject",
        "properties": {
            "data": {"ref":"Product"},
            "error": {"ref":"ApiError"},
            "meta": {"ref":"ApiMeta"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseList_Product_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"Product"},"required":true},
            "error": {"ref":"ApiError"},
            "meta": {"ref":"ApiMeta"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_Product_": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"ref":"ApiResponseSingle_Product_"},{"ref":"ApiResponseList_Product_"},{"ref":"ApiResponseInfo"},{"ref":"ApiError"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PostProductsSchema": {
        "dataType": "refObject",
        "properties": {
            "Name": {"dataType":"string","required":true},
            "Active": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PatchProductsSchema": {
        "dataType": "refObject",
        "properties": {
            "Name": {"dataType":"string","required":true},
            "Active": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetLinesSchema": {
        "dataType": "refObject",
        "properties": {
            "ALAssLineID": {"dataType":"double","required":true},
            "ProductID": {"dataType":"double","required":true},
            "Name": {"dataType":"string","required":true},
            "Status": {"dataType":"double","required":true},
            "CreatedAt": {"dataType":"datetime","required":true},
            "UpdatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseSingle_GetLinesSchema_": {
        "dataType": "refObject",
        "properties": {
            "data": {"ref":"GetLinesSchema"},
            "error": {"ref":"ApiError"},
            "meta": {"ref":"ApiMeta"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseList_GetLinesSchema_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"GetLinesSchema"},"required":true},
            "error": {"ref":"ApiError"},
            "meta": {"ref":"ApiMeta"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_GetLinesSchema_": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"ref":"ApiResponseSingle_GetLinesSchema_"},{"ref":"ApiResponseList_GetLinesSchema_"},{"ref":"ApiResponseInfo"},{"ref":"ApiError"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetLineSchema": {
        "dataType": "refObject",
        "properties": {
            "ALAssLineID": {"dataType":"double","required":true},
            "ProductID": {"dataType":"double","required":true},
            "Name": {"dataType":"string","required":true},
            "Status": {"dataType":"double","required":true},
            "CreatedAt": {"dataType":"datetime","required":true},
            "UpdatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseSingle_GetLineSchema_": {
        "dataType": "refObject",
        "properties": {
            "data": {"ref":"GetLineSchema"},
            "error": {"ref":"ApiError"},
            "meta": {"ref":"ApiMeta"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseSingle_ALAssLine_": {
        "dataType": "refObject",
        "properties": {
            "data": {"ref":"ALAssLine"},
            "error": {"ref":"ApiError"},
            "meta": {"ref":"ApiMeta"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseList_ALAssLine_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"ALAssLine"},"required":true},
            "error": {"ref":"ApiError"},
            "meta": {"ref":"ApiMeta"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_ALAssLine_": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"ref":"ApiResponseSingle_ALAssLine_"},{"ref":"ApiResponseList_ALAssLine_"},{"ref":"ApiResponseInfo"},{"ref":"ApiError"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PostLinesSchema": {
        "dataType": "refObject",
        "properties": {
            "ProductID": {"dataType":"double","required":true},
            "Name": {"dataType":"string","required":true},
            "Status": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PatchLinesSchema": {
        "dataType": "refObject",
        "properties": {
            "ProductID": {"dataType":"double"},
            "Name": {"dataType":"string"},
            "Status": {"dataType":"double"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetAllocationsSchema": {
        "dataType": "refObject",
        "properties": {
            "ALAssLineWStationAllocationID": {"dataType":"double","required":true},
            "ALAssLineID": {"dataType":"double","required":true},
            "ALWStationID": {"dataType":"double","required":true},
            "Sort": {"dataType":"double","required":true},
            "CreatedAt": {"dataType":"datetime","required":true},
            "UpdatedAt": {"dataType":"datetime","required":true},
            "assemblyLine": {"dataType":"nestedObjectLiteral","nestedProperties":{"product":{"dataType":"nestedObjectLiteral","nestedProperties":{"Active":{"dataType":"double","required":true},"Name":{"dataType":"string","required":true},"ProductID":{"dataType":"double","required":true}}},"Status":{"dataType":"double","required":true},"ProductID":{"dataType":"double","required":true},"Name":{"dataType":"string","required":true},"ALAssLineID":{"dataType":"double","required":true}}},
            "workstation": {"dataType":"nestedObjectLiteral","nestedProperties":{"AutoStart":{"dataType":"double","required":true},"PCName":{"dataType":"string"},"ShortName":{"dataType":"string","required":true},"Name":{"dataType":"string","required":true},"ALWStationID":{"dataType":"double","required":true}}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseSingle_GetAllocationsSchema_": {
        "dataType": "refObject",
        "properties": {
            "data": {"ref":"GetAllocationsSchema"},
            "error": {"ref":"ApiError"},
            "meta": {"ref":"ApiMeta"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseList_GetAllocationsSchema_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"GetAllocationsSchema"},"required":true},
            "error": {"ref":"ApiError"},
            "meta": {"ref":"ApiMeta"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_GetAllocationsSchema_": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"ref":"ApiResponseSingle_GetAllocationsSchema_"},{"ref":"ApiResponseList_GetAllocationsSchema_"},{"ref":"ApiResponseInfo"},{"ref":"ApiError"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetAllocationSchema": {
        "dataType": "refObject",
        "properties": {
            "ALAssLineWStationAllocationID": {"dataType":"double","required":true},
            "ALAssLineID": {"dataType":"double","required":true},
            "ALWStationID": {"dataType":"double","required":true},
            "Sort": {"dataType":"double","required":true},
            "CreatedAt": {"dataType":"datetime","required":true},
            "UpdatedAt": {"dataType":"datetime","required":true},
            "assemblyLine": {"dataType":"nestedObjectLiteral","nestedProperties":{"product":{"dataType":"nestedObjectLiteral","nestedProperties":{"Active":{"dataType":"double","required":true},"Name":{"dataType":"string","required":true},"ProductID":{"dataType":"double","required":true}}},"Status":{"dataType":"double","required":true},"ProductID":{"dataType":"double","required":true},"Name":{"dataType":"string","required":true},"ALAssLineID":{"dataType":"double","required":true}}},
            "workstation": {"dataType":"nestedObjectLiteral","nestedProperties":{"AutoStart":{"dataType":"double","required":true},"PCName":{"dataType":"string"},"ShortName":{"dataType":"string","required":true},"Name":{"dataType":"string","required":true},"ALWStationID":{"dataType":"double","required":true}}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseSingle_GetAllocationSchema_": {
        "dataType": "refObject",
        "properties": {
            "data": {"ref":"GetAllocationSchema"},
            "error": {"ref":"ApiError"},
            "meta": {"ref":"ApiMeta"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseSingle_ALAssLineWStationAllocation_": {
        "dataType": "refObject",
        "properties": {
            "data": {"ref":"ALAssLineWStationAllocation"},
            "error": {"ref":"ApiError"},
            "meta": {"ref":"ApiMeta"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseList_ALAssLineWStationAllocation_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"ALAssLineWStationAllocation"},"required":true},
            "error": {"ref":"ApiError"},
            "meta": {"ref":"ApiMeta"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_ALAssLineWStationAllocation_": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"ref":"ApiResponseSingle_ALAssLineWStationAllocation_"},{"ref":"ApiResponseList_ALAssLineWStationAllocation_"},{"ref":"ApiResponseInfo"},{"ref":"ApiError"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PostAllocationsSchema": {
        "dataType": "refObject",
        "properties": {
            "ALAssLineID": {"dataType":"double","required":true},
            "ALWStationID": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PatchAllocationsSchema": {
        "dataType": "refObject",
        "properties": {
            "ALAssLineID": {"dataType":"double"},
            "ALWStationID": {"dataType":"double"},
            "Sort": {"dataType":"double"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"ignore","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsAuthController_authGithub: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.get('/api/auth/github',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.authGithub)),

            async function AuthController_authGithub(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_authGithub, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'authGithub',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_devLogin: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.get('/api/auth/dev-login',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.devLogin)),

            async function AuthController_devLogin(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_devLogin, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'devLogin',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_authGithubCallback: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.get('/api/auth/github/callback',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.authGithubCallback)),

            async function AuthController_authGithubCallback(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_authGithubCallback, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'authGithubCallback',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_authStatus: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.get('/api/auth/status',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.authStatus)),

            async function AuthController_authStatus(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_authStatus, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'authStatus',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_authLogout: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.get('/api/auth/logout',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.authLogout)),

            async function AuthController_authLogout(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_authLogout, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'authLogout',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_getAll: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"default":0,"in":"query","name":"page","dataType":"double"},
                size: {"default":10,"in":"query","name":"size","dataType":"double"},
                filter: {"in":"query","name":"filter","dataType":"string"},
                role: {"in":"query","name":"role","ref":"UserRole"},
                isActive: {"in":"query","name":"isActive","dataType":"boolean"},
        };
        app.get('/api/users',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getAll)),

            async function UserController_getAll(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getAll, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'getAll',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_getOne: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/api/users/:id',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getOne)),

            async function UserController_getOne(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getOne, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'getOne',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_update: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                body: {"in":"body","name":"body","required":true,"ref":"UpdateUserDTO"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.patch('/api/users/:id',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.update)),

            async function UserController_update(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_update, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'update',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_delete: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.delete('/api/users/:id',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.delete)),

            async function UserController_delete(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_delete, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'delete',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_getRoles: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/api/users/roles/list',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getRoles)),

            async function UserController_getRoles(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getRoles, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'getRoles',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsProductionPlanController_getAll: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"default":0,"in":"query","name":"page","dataType":"double"},
                size: {"default":10,"in":"query","name":"size","dataType":"double"},
                productId: {"in":"query","name":"productId","dataType":"double"},
                assemblyLineId: {"in":"query","name":"assemblyLineId","dataType":"double"},
                status: {"in":"query","name":"status","ref":"ProductionPlanStatus"},
                startDateFrom: {"in":"query","name":"startDateFrom","dataType":"string"},
                startDateTo: {"in":"query","name":"startDateTo","dataType":"string"},
        };
        app.get('/api/production-plans',
            ...(fetchMiddlewares<RequestHandler>(ProductionPlanController)),
            ...(fetchMiddlewares<RequestHandler>(ProductionPlanController.prototype.getAll)),

            async function ProductionPlanController_getAll(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsProductionPlanController_getAll, request, response });

                const controller = new ProductionPlanController();

              await templateService.apiHandler({
                methodName: 'getAll',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsProductionPlanController_getOne: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/api/production-plans/:id',
            ...(fetchMiddlewares<RequestHandler>(ProductionPlanController)),
            ...(fetchMiddlewares<RequestHandler>(ProductionPlanController.prototype.getOne)),

            async function ProductionPlanController_getOne(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsProductionPlanController_getOne, request, response });

                const controller = new ProductionPlanController();

              await templateService.apiHandler({
                methodName: 'getOne',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsProductionPlanController_create: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"body","name":"request","required":true,"ref":"CreateProductionPlanRequest"},
        };
        app.post('/api/production-plans',
            ...(fetchMiddlewares<RequestHandler>(ProductionPlanController)),
            ...(fetchMiddlewares<RequestHandler>(ProductionPlanController.prototype.create)),

            async function ProductionPlanController_create(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsProductionPlanController_create, request, response });

                const controller = new ProductionPlanController();

              await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsProductionPlanController_update: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                request: {"in":"body","name":"request","required":true,"ref":"UpdateProductionPlanRequest"},
        };
        app.put('/api/production-plans/:id',
            ...(fetchMiddlewares<RequestHandler>(ProductionPlanController)),
            ...(fetchMiddlewares<RequestHandler>(ProductionPlanController.prototype.update)),

            async function ProductionPlanController_update(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsProductionPlanController_update, request, response });

                const controller = new ProductionPlanController();

              await templateService.apiHandler({
                methodName: 'update',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsProductionPlanController_delete: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.delete('/api/production-plans/:id',
            ...(fetchMiddlewares<RequestHandler>(ProductionPlanController)),
            ...(fetchMiddlewares<RequestHandler>(ProductionPlanController.prototype.delete)),

            async function ProductionPlanController_delete(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsProductionPlanController_delete, request, response });

                const controller = new ProductionPlanController();

              await templateService.apiHandler({
                methodName: 'delete',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsProductionPlanController_getByDateRange: Record<string, TsoaRoute.ParameterSchema> = {
                startDate: {"in":"query","name":"startDate","required":true,"dataType":"string"},
                endDate: {"in":"query","name":"endDate","required":true,"dataType":"string"},
        };
        app.get('/api/production-plans/calendar/range',
            ...(fetchMiddlewares<RequestHandler>(ProductionPlanController)),
            ...(fetchMiddlewares<RequestHandler>(ProductionPlanController.prototype.getByDateRange)),

            async function ProductionPlanController_getByDateRange(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsProductionPlanController_getByDateRange, request, response });

                const controller = new ProductionPlanController();

              await templateService.apiHandler({
                methodName: 'getByDateRange',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsProductionPlanController_getUpcoming: Record<string, TsoaRoute.ParameterSchema> = {
                limit: {"default":10,"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/api/production-plans/upcoming/list',
            ...(fetchMiddlewares<RequestHandler>(ProductionPlanController)),
            ...(fetchMiddlewares<RequestHandler>(ProductionPlanController.prototype.getUpcoming)),

            async function ProductionPlanController_getUpcoming(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsProductionPlanController_getUpcoming, request, response });

                const controller = new ProductionPlanController();

              await templateService.apiHandler({
                methodName: 'getUpcoming',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsProductionPlanController_getStats: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/api/production-plans/stats/overview',
            ...(fetchMiddlewares<RequestHandler>(ProductionPlanController)),
            ...(fetchMiddlewares<RequestHandler>(ProductionPlanController.prototype.getStats)),

            async function ProductionPlanController_getStats(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsProductionPlanController_getStats, request, response });

                const controller = new ProductionPlanController();

              await templateService.apiHandler({
                methodName: 'getStats',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuditLogController_getAuditLogs: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"default":0,"in":"query","name":"page","dataType":"double"},
                size: {"default":10,"in":"query","name":"size","dataType":"double"},
                entityName: {"in":"query","name":"entityName","dataType":"string"},
                action: {"in":"query","name":"action","dataType":"string"},
                userEmail: {"in":"query","name":"userEmail","dataType":"string"},
                dateFrom: {"in":"query","name":"dateFrom","dataType":"string"},
                dateTo: {"in":"query","name":"dateTo","dataType":"string"},
        };
        app.get('/api/audit/logs',
            ...(fetchMiddlewares<RequestHandler>(AuditLogController)),
            ...(fetchMiddlewares<RequestHandler>(AuditLogController.prototype.getAuditLogs)),

            async function AuditLogController_getAuditLogs(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuditLogController_getAuditLogs, request, response });

                const controller = new AuditLogController();

              await templateService.apiHandler({
                methodName: 'getAuditLogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuditLogController_getEntityNames: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/api/audit/entities',
            ...(fetchMiddlewares<RequestHandler>(AuditLogController)),
            ...(fetchMiddlewares<RequestHandler>(AuditLogController.prototype.getEntityNames)),

            async function AuditLogController_getEntityNames(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuditLogController_getEntityNames, request, response });

                const controller = new AuditLogController();

              await templateService.apiHandler({
                methodName: 'getEntityNames',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuditLogController_getActions: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/api/audit/actions',
            ...(fetchMiddlewares<RequestHandler>(AuditLogController)),
            ...(fetchMiddlewares<RequestHandler>(AuditLogController.prototype.getActions)),

            async function AuditLogController_getActions(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuditLogController_getActions, request, response });

                const controller = new AuditLogController();

              await templateService.apiHandler({
                methodName: 'getActions',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDashboardController_getMetrics: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/api/dashboard/metrics',
            ...(fetchMiddlewares<RequestHandler>(DashboardController)),
            ...(fetchMiddlewares<RequestHandler>(DashboardController.prototype.getMetrics)),

            async function DashboardController_getMetrics(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDashboardController_getMetrics, request, response });

                const controller = new DashboardController();

              await templateService.apiHandler({
                methodName: 'getMetrics',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDashboardController_getLineStatusDistribution: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/api/dashboard/lines/status-distribution',
            ...(fetchMiddlewares<RequestHandler>(DashboardController)),
            ...(fetchMiddlewares<RequestHandler>(DashboardController.prototype.getLineStatusDistribution)),

            async function DashboardController_getLineStatusDistribution(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDashboardController_getLineStatusDistribution, request, response });

                const controller = new DashboardController();

              await templateService.apiHandler({
                methodName: 'getLineStatusDistribution',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDashboardController_getProductAllocationSummary: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/api/dashboard/products/allocations',
            ...(fetchMiddlewares<RequestHandler>(DashboardController)),
            ...(fetchMiddlewares<RequestHandler>(DashboardController.prototype.getProductAllocationSummary)),

            async function DashboardController_getProductAllocationSummary(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDashboardController_getProductAllocationSummary, request, response });

                const controller = new DashboardController();

              await templateService.apiHandler({
                methodName: 'getProductAllocationSummary',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWorkstationController_getAll: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"default":0,"in":"query","name":"page","dataType":"double"},
                size: {"default":10,"in":"query","name":"size","dataType":"double"},
                filter: {"in":"query","name":"filter","dataType":"string"},
        };
        app.get('/api/workstations',
            ...(fetchMiddlewares<RequestHandler>(WorkstationController)),
            ...(fetchMiddlewares<RequestHandler>(WorkstationController.prototype.getAll)),

            async function WorkstationController_getAll(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWorkstationController_getAll, request, response });

                const controller = new WorkstationController();

              await templateService.apiHandler({
                methodName: 'getAll',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWorkstationController_getOne: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/api/workstations/:id',
            ...(fetchMiddlewares<RequestHandler>(WorkstationController)),
            ...(fetchMiddlewares<RequestHandler>(WorkstationController.prototype.getOne)),

            async function WorkstationController_getOne(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWorkstationController_getOne, request, response });

                const controller = new WorkstationController();

              await templateService.apiHandler({
                methodName: 'getOne',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWorkstationController_create: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"PostWorkstationsSchema"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/api/workstations',
            ...(fetchMiddlewares<RequestHandler>(WorkstationController)),
            ...(fetchMiddlewares<RequestHandler>(WorkstationController.prototype.create)),

            async function WorkstationController_create(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWorkstationController_create, request, response });

                const controller = new WorkstationController();

              await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWorkstationController_update: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                body: {"in":"body","name":"body","required":true,"ref":"PatchWorkstationsSchema"},
        };
        app.patch('/api/workstations/:id',
            ...(fetchMiddlewares<RequestHandler>(WorkstationController)),
            ...(fetchMiddlewares<RequestHandler>(WorkstationController.prototype.update)),

            async function WorkstationController_update(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWorkstationController_update, request, response });

                const controller = new WorkstationController();

              await templateService.apiHandler({
                methodName: 'update',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWorkstationController_delete: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.delete('/api/workstations/:id',
            ...(fetchMiddlewares<RequestHandler>(WorkstationController)),
            ...(fetchMiddlewares<RequestHandler>(WorkstationController.prototype.delete)),

            async function WorkstationController_delete(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWorkstationController_delete, request, response });

                const controller = new WorkstationController();

              await templateService.apiHandler({
                methodName: 'delete',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsProductController_getAll: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"default":0,"in":"query","name":"page","dataType":"double"},
                size: {"default":10,"in":"query","name":"size","dataType":"double"},
                filter: {"in":"query","name":"filter","dataType":"string"},
        };
        app.get('/api/products',
            ...(fetchMiddlewares<RequestHandler>(ProductController)),
            ...(fetchMiddlewares<RequestHandler>(ProductController.prototype.getAll)),

            async function ProductController_getAll(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsProductController_getAll, request, response });

                const controller = new ProductController();

              await templateService.apiHandler({
                methodName: 'getAll',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsProductController_getOne: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/api/products/:id',
            ...(fetchMiddlewares<RequestHandler>(ProductController)),
            ...(fetchMiddlewares<RequestHandler>(ProductController.prototype.getOne)),

            async function ProductController_getOne(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsProductController_getOne, request, response });

                const controller = new ProductController();

              await templateService.apiHandler({
                methodName: 'getOne',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsProductController_create: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"PostProductsSchema"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/api/products',
            ...(fetchMiddlewares<RequestHandler>(ProductController)),
            ...(fetchMiddlewares<RequestHandler>(ProductController.prototype.create)),

            async function ProductController_create(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsProductController_create, request, response });

                const controller = new ProductController();

              await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsProductController_update: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                body: {"in":"body","name":"body","required":true,"ref":"PatchProductsSchema"},
        };
        app.patch('/api/products/:id',
            ...(fetchMiddlewares<RequestHandler>(ProductController)),
            ...(fetchMiddlewares<RequestHandler>(ProductController.prototype.update)),

            async function ProductController_update(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsProductController_update, request, response });

                const controller = new ProductController();

              await templateService.apiHandler({
                methodName: 'update',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsProductController_delete: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.delete('/api/products/:id',
            ...(fetchMiddlewares<RequestHandler>(ProductController)),
            ...(fetchMiddlewares<RequestHandler>(ProductController.prototype.delete)),

            async function ProductController_delete(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsProductController_delete, request, response });

                const controller = new ProductController();

              await templateService.apiHandler({
                methodName: 'delete',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLineController_getAll: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"default":0,"in":"query","name":"page","dataType":"double"},
                size: {"default":10,"in":"query","name":"size","dataType":"double"},
                filter: {"in":"query","name":"filter","dataType":"string"},
        };
        app.get('/api/lines',
            ...(fetchMiddlewares<RequestHandler>(LineController)),
            ...(fetchMiddlewares<RequestHandler>(LineController.prototype.getAll)),

            async function LineController_getAll(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLineController_getAll, request, response });

                const controller = new LineController();

              await templateService.apiHandler({
                methodName: 'getAll',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLineController_getOne: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/api/lines/:id',
            ...(fetchMiddlewares<RequestHandler>(LineController)),
            ...(fetchMiddlewares<RequestHandler>(LineController.prototype.getOne)),

            async function LineController_getOne(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLineController_getOne, request, response });

                const controller = new LineController();

              await templateService.apiHandler({
                methodName: 'getOne',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLineController_create: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"PostLinesSchema"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/api/lines',
            ...(fetchMiddlewares<RequestHandler>(LineController)),
            ...(fetchMiddlewares<RequestHandler>(LineController.prototype.create)),

            async function LineController_create(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLineController_create, request, response });

                const controller = new LineController();

              await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLineController_update: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                body: {"in":"body","name":"body","required":true,"ref":"PatchLinesSchema"},
        };
        app.patch('/api/lines/:id',
            ...(fetchMiddlewares<RequestHandler>(LineController)),
            ...(fetchMiddlewares<RequestHandler>(LineController.prototype.update)),

            async function LineController_update(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLineController_update, request, response });

                const controller = new LineController();

              await templateService.apiHandler({
                methodName: 'update',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLineController_delete: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.delete('/api/lines/:id',
            ...(fetchMiddlewares<RequestHandler>(LineController)),
            ...(fetchMiddlewares<RequestHandler>(LineController.prototype.delete)),

            async function LineController_delete(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLineController_delete, request, response });

                const controller = new LineController();

              await templateService.apiHandler({
                methodName: 'delete',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAllocationController_getAll: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"default":0,"in":"query","name":"page","dataType":"double"},
                size: {"default":10,"in":"query","name":"size","dataType":"double"},
                filter: {"in":"query","name":"filter","dataType":"string"},
        };
        app.get('/api/allocations',
            ...(fetchMiddlewares<RequestHandler>(AllocationController)),
            ...(fetchMiddlewares<RequestHandler>(AllocationController.prototype.getAll)),

            async function AllocationController_getAll(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAllocationController_getAll, request, response });

                const controller = new AllocationController();

              await templateService.apiHandler({
                methodName: 'getAll',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAllocationController_getOne: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/api/allocations/:id',
            ...(fetchMiddlewares<RequestHandler>(AllocationController)),
            ...(fetchMiddlewares<RequestHandler>(AllocationController.prototype.getOne)),

            async function AllocationController_getOne(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAllocationController_getOne, request, response });

                const controller = new AllocationController();

              await templateService.apiHandler({
                methodName: 'getOne',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAllocationController_create: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"PostAllocationsSchema"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/api/allocations',
            ...(fetchMiddlewares<RequestHandler>(AllocationController)),
            ...(fetchMiddlewares<RequestHandler>(AllocationController.prototype.create)),

            async function AllocationController_create(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAllocationController_create, request, response });

                const controller = new AllocationController();

              await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAllocationController_update: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                body: {"in":"body","name":"body","required":true,"ref":"PatchAllocationsSchema"},
        };
        app.patch('/api/allocations/:id',
            ...(fetchMiddlewares<RequestHandler>(AllocationController)),
            ...(fetchMiddlewares<RequestHandler>(AllocationController.prototype.update)),

            async function AllocationController_update(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAllocationController_update, request, response });

                const controller = new AllocationController();

              await templateService.apiHandler({
                methodName: 'update',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAllocationController_delete: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.delete('/api/allocations/:id',
            ...(fetchMiddlewares<RequestHandler>(AllocationController)),
            ...(fetchMiddlewares<RequestHandler>(AllocationController.prototype.delete)),

            async function AllocationController_delete(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAllocationController_delete, request, response });

                const controller = new AllocationController();

              await templateService.apiHandler({
                methodName: 'delete',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAllocationController_deleteAll: Record<string, TsoaRoute.ParameterSchema> = {
                ids: {"in":"query","name":"ids","required":true,"dataType":"array","array":{"dataType":"double"}},
        };
        app.delete('/api/allocations',
            ...(fetchMiddlewares<RequestHandler>(AllocationController)),
            ...(fetchMiddlewares<RequestHandler>(AllocationController.prototype.deleteAll)),

            async function AllocationController_deleteAll(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAllocationController_deleteAll, request, response });

                const controller = new AllocationController();

              await templateService.apiHandler({
                methodName: 'deleteAll',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
