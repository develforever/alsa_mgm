import { Request, Response, NextFunction } from 'express';
import { ValidateError } from 'tsoa';

export interface AppError extends Error {
  status?: number;
  code?: string;
  meta?: any;
}

export const errorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: AppError | ValidateError | any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    const errors = Object.keys(err.fields).map((key) => ({
      status: "422",
      code: "VALIDATION_ERROR",
      title: "Validation Failed",
      detail: err.fields[key].message,
      meta: { field: key, value: err.fields[key].value }
    }));
    return res.status(422).json({ errors });
  }

  const appErr = err as AppError;
  const status = appErr.status || 500;
  
  res.status(status).json({
    errors: [
      {
        status: status.toString(),
        code: appErr.code || (status === 500 ? 'INTERNAL_SERVER_ERROR' : 'BAD_REQUEST'),
        title: appErr.name || 'Error',
        detail: appErr.message || 'Internal Server Error',
        ...(appErr.meta ? { meta: appErr.meta } : {})
      }
    ]
  });
};