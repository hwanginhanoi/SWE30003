import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from "../models/User";
import JSONResponse from '../models/JSONResponse';

interface AuthenticatedRequest extends Request {
    user?: User
}

export default async function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token) {
        JSONResponse.serverError(req, res, 'No token provided', null);
        return
    }

    jwt.verify(token, 'secretKey123cutephomaique', async (err: any, decoded: { id: number; email: string; }) => {
        if (err) {
            JSONResponse.serverError(req, res, 'Failed to authenticate token', null)
        }

        const { id, email } = decoded as { id: number; email: string };

        try {
            const user = await User.findById(id)
            if (!user) {
                JSONResponse.serverError(req, res, 'User not found', null);
                return
            }

            req.user = user;
            next()
        } catch (error) {
            console.log('Error handling user',error);
            JSONResponse.serverError(req, res, 'Error finding user', null);
        }
    });
}