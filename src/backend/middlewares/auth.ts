
import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    
    const isAuth = req.headers['authorization']; 

    if(req.path === '/login' || req.path === '/') {
        next();
        return;
    }

    if (isAuth) {
        next();
    } else {
        res.status(401).json({ message: "Brak dostępu. Zaloguj się." });
    }
};