import * as express from 'express';
import User from "../models/User";
import Customer from "../models/Customer";
import Admin from '../models/Admin';
import JSONResponse from '../models/JSONResponse';

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
        if (result === 'error') {
            JSONResponse.serverError(req, res, 'Error registering account', null);
            return;
        }

        JSONResponse.success(req, res, 'Account registered', user.getJsonObject());
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
        const { email, password, role } = req.body;

        if (role === "customer"){
            const customer = new Customer("", email, password);
        }

        if (!email || !password) {
            JSONResponse.serverError(req, res, 'Missing required fields', null);
            return;
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