import { LineStatus } from "../../shared/models/types";
import { AppDataSource } from "../config/data-source";
import { ALAssLine } from "../entity/ALAssLine";

const lineRepo = AppDataSource.getRepository(ALAssLine);

export const lineController = {
    getAll: async (req: any, res: any) => {
        const lines = await lineRepo.find({
            relations: { product: true }
        });
        res.json(lines);
    },

    create: async (req: any, res: any) => {
        const { ProductID, Name, Status } = req.body;
        const newLine = lineRepo.create({
            ProductID,
            Name,
            Status: Status || LineStatus.Active
        });
        await lineRepo.save(newLine);
        res.status(201).json(newLine);
    },

    update: async (req: any, res: any) => {
        const { id } = req.params;
        await lineRepo.update(id, req.body);
        res.json({ message: "Line updated" });
    },

    delete: async (req: any, res: any) => {
        const { id } = req.params;
        await lineRepo.softDelete(id);
        res.json({ message: "Line deleted" });
    }
};