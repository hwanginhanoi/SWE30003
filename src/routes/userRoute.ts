import * as express from 'express';
import User from "../models/User";
import Customer from "../models/Customer";
import Admin from '../models/Admin';
import JSONResponse from '../models/JSONResponse';
import jwt from "jsonwebtoken";

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, password, email, role } = req.body;

        if (!name || !password || !email || !role) {
            JSONResponse.serverError(req, res, 'Missing required fields', null);
            return;
        }

        let user: User;
        if (role === 'customer') {
            user = new Customer(name, email, password);
        } else if (role === 'admin') {
            user = new Admin(name, email, password);
        } else {
            JSONResponse.serverError(req, res, 'Invalid role specified', null);
            return;
        }

        let result = await user.register();

        if (result === false) {
            JSONResponse.serverError(req, res, 'Error registering account', null);
            return;
        }
        else {
            const token = jwt.sign({ email: user.email }, 'secretKey123cutephomaique', {
                expiresIn: '1h',
            });
            const credentials = user.getJsonObject()
            JSONResponse.success(req, res, 'Account registered', { user: credentials, token});
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message, error.stack);
            JSONResponse.serverError(req, res, error.message, null);
        } else {
            console.log('An unknown error occurred', error);
            JSONResponse.serverError(req, res, 'An unknown error occurred', null);
        }
    }
});

router.post('/login', async (req, res) => {
    try {
        const {email, password, role} = req.body;

        if (!email || !password) {
            JSONResponse.serverError(req, res, 'Missing required fields', null);
            return;
        }

        let user: User;

        if (role === 'customer') {
            user = new Customer('', email, password);
        } else if (role === 'admin') {
            user = new Admin('', email, password);
        } else {
            JSONResponse.serverError(req, res, 'Invalid role specified', null);
            return;
        }

        let result = await user.login(email, password);

        if (result === false) {
            JSONResponse.serverError(req, res, 'Error login account', null);
            return;
        } else {
            const credentials = user.getJsonObject() as { name: string; email: string; role: string; id: number };
            user.name = credentials.name;
            const token = jwt.sign({email: user.email}, 'secretKey123cutephomaique', {
                expiresIn: '1h',
            });
            JSONResponse.success(req, res, 'Login successful', {user: credentials, token});
        }

    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message, error.stack);
            JSONResponse.serverError(req, res, error.message, null);
        } else {
            console.log('An unknown error occurred', error);
            JSONResponse.serverError(req, res, 'An unknown error occurred', null);
        }
    }
});

export default router;