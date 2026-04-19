import { Controller, Get, Route, Tags } from "tsoa";
import { AppDataSource } from "../../../../config/data-source";
import { Product } from "../../../../entity/Product";
import { ALAssLine, ALAssLineStatus } from "../../../../entity/ALAssLine";
import { ALWStation } from "../../../../entity/ALWStation";
import { ALAssLineWStationAllocation } from "../../../../entity/ALAssLineWStationAllocation";
import { AuditLog } from "../../../../entity/AuditLog";
import { Between } from "typeorm";

interface DashboardMetrics {
  products: {
    total: number;
    active: number;
    inactive: number;
  };
  assemblyLines: {
    total: number;
    active: number;
    locked: number;
    closed: number;
  };
  workstations: {
    total: number;
    autoStartEnabled: number;
  };
  allocations: {
    total: number;
  };
  recentActivity: {
    last24h: number;
    last7d: number;
    last30d: number;
  };
}

interface AssemblyLineStatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

interface ProductAllocationSummary {
  productName: string;
  productId: number;
  lineCount: number;
  workstationCount: number;
}

const productRepo = AppDataSource.getRepository(Product);
const lineRepo = AppDataSource.getRepository(ALAssLine);
const workstationRepo = AppDataSource.getRepository(ALWStation);
const allocationRepo = AppDataSource.getRepository(ALAssLineWStationAllocation);
const auditRepo = AppDataSource.getRepository(AuditLog);

@Route("api/dashboard")
@Tags("Dashboard")
export class DashboardController extends Controller {

  @Get("metrics")
  public async getMetrics(): Promise<DashboardMetrics> {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      products,
      assemblyLines,
      workstations,
      allocations,
      activity24h,
      activity7d,
      activity30d
    ] = await Promise.all([
      productRepo.find(),
      lineRepo.find(),
      workstationRepo.find(),
      allocationRepo.count(),
      auditRepo.count({ where: { timestamp: Between(last24h, now) } }),
      auditRepo.count({ where: { timestamp: Between(last7d, now) } }),
      auditRepo.count({ where: { timestamp: Between(last30d, now) } })
    ]);

    const activeProducts = products.filter((p: Product) => p.Active === true).length;
    
    const activeLines = assemblyLines.filter((l: ALAssLine) => l.Status === ALAssLineStatus.Active).length;
    const lockedLines = assemblyLines.filter((l: ALAssLine) => l.Status === ALAssLineStatus.Locked).length;
    const closedLines = assemblyLines.filter((l: ALAssLine) => l.Status === ALAssLineStatus.Closed).length;
    
    const autoStartWorkstations = workstations.filter((w: ALWStation) => w.AutoStart === true).length;

    return {
      products: {
        total: products.length,
        active: activeProducts,
        inactive: products.length - activeProducts
      },
      assemblyLines: {
        total: assemblyLines.length,
        active: activeLines,
        locked: lockedLines,
        closed: closedLines
      },
      workstations: {
        total: workstations.length,
        autoStartEnabled: autoStartWorkstations
      },
      allocations: {
        total: allocations
      },
      recentActivity: {
        last24h: activity24h,
        last7d: activity7d,
        last30d: activity30d
      }
    };
  }

  @Get("lines/status-distribution")
  public async getLineStatusDistribution(): Promise<AssemblyLineStatusDistribution[]> {
    const lines = await lineRepo.find();
    const total = lines.length;

    if (total === 0) return [];

    const statusCounts = {
      [ALAssLineStatus.Active]: 0,
      [ALAssLineStatus.Locked]: 0,
      [ALAssLineStatus.Closed]: 0
    };

    lines.forEach(line => {
      if (statusCounts[line.Status] !== undefined) {
        statusCounts[line.Status]++;
      }
    });

    const statusNames: Record<number, string> = {
      [ALAssLineStatus.Active]: 'Active',
      [ALAssLineStatus.Locked]: 'Locked',
      [ALAssLineStatus.Closed]: 'Closed'
    };

    return Object.entries(statusCounts).map(([status, count]) => ({
      status: statusNames[Number(status) as ALAssLineStatus],
      count,
      percentage: Math.round((count / total) * 100)
    }));
  }

  @Get("products/allocations")
  public async getProductAllocationSummary(): Promise<ProductAllocationSummary[]> {
    const products = await productRepo.find({
      relations: {
        assemblyLines: {
          allocations: {
            workstation: true
          }
        }
      }
    });

    return products.map((product: Product) => {
      const lines = product.assemblyLines || [];
      let workstationCount = 0;

      lines.forEach((line: ALAssLine) => {
        workstationCount += (line.allocations || []).length;
      });

      return {
        productName: product.Name,
        productId: product.ProductID,
        lineCount: lines.length,
        workstationCount
      };
    }).sort((a: ProductAllocationSummary, b: ProductAllocationSummary) => b.workstationCount - a.workstationCount);
  }
}
