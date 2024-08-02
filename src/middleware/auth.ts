import jwt from "jsonwebtoken";
import JSONResponse from "../models/JSONResponse";
import User from "../models/User";
import {Request, Response, NextFunction} from 'express'
import {syncBuiltinESMExports} from "node:module";

interface AuthenticatedRequest extends Request {
    user?: User
}

export default async function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token) {
        JSONResponse.serverError(req, res, 'No token provided', null);
        return
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            JSONResponse.serverError(req, res, 'Failed to authenticate token', null)
        }

        const { id, email } = decoded as { id : number, email : string }
    });
}