import { Request, Response, NextFunction } from 'express';


export const appHome = (req: Request, res: Response, next: NextFunction) => {
  
  res.json({ message: 'Welcome to the App API!' });
};