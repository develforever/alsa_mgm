// backend/src/controllers/allocationController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { ALAssLineWStationAllocation } from "../entity/ALAssLineWStationAllocation";


const allocationRepo = AppDataSource.getRepository(ALAssLineWStationAllocation);

export const allocationController = {
    getAll: async (req:any, res:any) => {
        const lines = await allocationRepo.find({
            relations: { assemblyLine: true, workstation: true } // TypeORM automatycznie zrobi JOIN z tabelą Product
        });
        res.json(lines);
    },

    
    create: async (req:any, res:any) => {
        const { ALAssLineID, ALWStationID, Sort } = req.body;
        const newLine = allocationRepo.create({
            ALAssLineID,
            ALWStationID,
            Sort: Sort || 1 
        });
        await allocationRepo.save(newLine);
        res.status(201).json(newLine);
    },

    
    update: async (req:any, res:any) => {
        const { id } = req.params;
        await allocationRepo.update(id, req.body);
        res.json({ message: "Allocation updated" });
    },

    delete: async (req:any, res:any) => {
        const { id } = req.params;
        await allocationRepo.softDelete(id);
        res.json({ message: "Allocation deleted" });
    },

    deleteMultiple: async (req:any, res:any) => {
        const { ids } = req.body; 
        await allocationRepo.softDelete(ids);
        res.json({ message: "Allocations deleted" });
    }
};


export const allocateWorkstation = async (req: Request, res: Response) => {
    const { ALAssLineID, ALWStationID } = req.body;
    const repo = AppDataSource.getRepository(ALAssLineWStationAllocation);

    try {
        // 1. Sprawdzamy najwyższy aktualny numer Sort dla danej linii
        const maxSortResult = await repo
            .createQueryBuilder("alloc")
            .select("MAX(alloc.Sort)", "max")
            .where("alloc.ALAssLineID = :lineId", { lineId: ALAssLineID })
            .getRawOne();

        const nextSort = (maxSortResult.max || 0) + 1;

        // 2. Tworzymy nową alokację
        const newAlloc = repo.create({
            ALAssLineID,
            ALWStationID,
            Sort: nextSort
        });

        await repo.save(newAlloc);
        res.status(201).json(newAlloc);
    } catch (error) {
        res.status(500).json({ message: "Błąd alokacji", error });
    }
};