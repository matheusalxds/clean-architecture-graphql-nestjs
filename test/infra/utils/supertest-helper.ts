import { Response } from 'supertest';

export const getStatusCode = (res: Response) => res.body.errors[0].extensions.originalError.statusCode;
export const getErrorMsg = (res: Response) => res.body.errors[0].extensions.originalError.message;
export const getData = (res: Response) => res.body.data;
