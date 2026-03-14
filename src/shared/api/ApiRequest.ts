import { Request } from 'express';

export type ApiRequest = Request & {
    user?: {
        userEmail: string;
    }
};
