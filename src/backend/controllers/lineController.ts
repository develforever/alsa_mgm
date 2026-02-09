import { AppDataSource } from "../config/data-source";
import { ALAssLine } from "../entity/ALAssLine";

const lineRepo = AppDataSource.getRepository(ALAssLine);

export const lineController = {
    // GET: Pobiera linie wraz z przypisanym produktem
    getAll: async (req:any, res:any) => {
        const lines = await lineRepo.find({
            relations: { product: true } // TypeORM automatycznie zrobi JOIN z tabelą Product
        });
        res.json(lines);
    },

    // POST: Tworzenie nowej linii
    create: async (req:any, res:any) => {
        const { ProductID, Name, Status } = req.body;
        const newLine = lineRepo.create({
            ProductID,
            Name,
            Status: Status || 1 // Domyślnie Active
        });
        await lineRepo.save(newLine);
        res.status(201).json(newLine);
    },

    // PUT: Aktualizacja (np. zmiana statusu z Active na Locked)
    update: async (req:any, res:any) => {
        const { id } = req.params;
        await lineRepo.update(id, req.body);
        res.json({ message: "Line updated" });
    },

    delete: async (req:any, res:any) => {
        const { id } = req.params;
        await lineRepo.softDelete(id);
        res.json({ message: "Line deleted" });
    }
};