import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { ALWStation } from "../entity/ALWStation";

const stationRepo = AppDataSource.getRepository(ALWStation);

export const workstationController = {
    getAll: async (req: Request, res: Response) => {
        const stations = await stationRepo.find(); // Automatycznie pominie soft-deleted
        res.json(stations);
    },

    create: async (req: Request, res: Response) => {
        const station = stationRepo.create(req.body);
        await stationRepo.save(station);
        res.status(201).json(station);
    },

    update: async (req: any, res: any) => {
        const { id } = req.params;
        await stationRepo.update(id, req.body);
        res.json({ message: "Workstation updated" });
    },

    delete: async (req: Request, res: Response) => {
        const { id } = req.params;
        await stationRepo.softDelete(id);
        res.json({ message: "Workstation soft-deleted" });
    }
};