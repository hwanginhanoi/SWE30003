import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import JSONResponse from '../models/JSONResponse';

interface AuthenticatedRequest extends Request {
    user?: any;
}

export default function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        JSONResponse.serverError(req, res, 'No token provided', null);
        return;
    }

    jwt.verify(token, 'secretKey123cutephomaique', (err, decoded) => {
        if (err) {
            JSONResponse.serverError(req, res, 'Failed to authenticate token', null);
            return;
        }

        req.user = decoded;
        next();
    });
}