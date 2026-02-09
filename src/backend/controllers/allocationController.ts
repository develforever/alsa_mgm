
import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { ALAssLineWStationAllocation } from "../entity/ALAssLineWStationAllocation";


const allocationRepo = AppDataSource.getRepository(ALAssLineWStationAllocation);

export const allocationController = {
    getAll: async (req: any, res: any) => {
        const lines = await allocationRepo.find({
            relations: { assemblyLine: true, workstation: true }
        });
        res.json(lines);
    },


    create: async (req: any, res: any) => {
        const { ALAssLineID, ALWStationID } = req.body;
        const repo = AppDataSource.getRepository(ALAssLineWStationAllocation);

        try {

            const maxSortResult = await repo
                .createQueryBuilder("alloc")
                .select("MAX(alloc.Sort)", "max")
                .where("alloc.ALAssLineID = :lineId", { lineId: ALAssLineID })
                .getRawOne();

            const nextSort = (maxSortResult.max || 0) + 1;

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
    },


    update: async (req: any, res: any) => {
        const { id } = req.params;
        await allocationRepo.update(id, req.body);
        res.json({ message: "Allocation updated" });
    },

    delete: async (req: any, res: any) => {
        const { id } = req.params;
        await allocationRepo.softDelete(id);
        res.json({ message: "Allocation deleted" });
    },

    deleteMultiple: async (req: any, res: any) => {
        const { ids } = req.body;
        await allocationRepo.softDelete(ids);
        res.json({ message: "Allocations deleted" });
    }
};


export const allocateWorkstation = async (req: Request, res: Response) => {

};