import { AppDataSource } from "../config/data-source";
import { Product } from "../entity/Product";

const productRepo = AppDataSource.getRepository(Product);

export const productController = {

    getAll: async (req: any, res: any) => {
        const products = await productRepo.find();
        res.json(products);
    },

    create: async (req: any, res: any) => {
        const { Name, Active } = req.body;
        if (!Name) return res.status(400).json({ message: "Name is required" });

        const newProduct = productRepo.create({ Name, Active: Active ?? 1 });
        
        
        await productRepo.save(newProduct, {
            data: { userEmail: req.user?.userEmail}
        });
        res.status(201).json(newProduct);
    },

    update: async (req: any, res: any) => {
        const { id } = req.params;
        await productRepo.update(id, req.body);
        res.json({ message: "Product updated" });
    },


    delete: async (req: any, res: any) => {
        const { id } = req.params;
        await productRepo.softDelete(id);
        res.json({ message: "Product removed" });
    },

};