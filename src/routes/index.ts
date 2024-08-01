import * as express from 'express';
import Account from "../models/Account";
import Customer from "../models/Customer";
import Admin from '../models/Admin';
import JSONResponse from '../models/JSONResponse';

const router = express.Router();

router.post('/register', (req, res) => {
    try {
        let account: Account;
        if (req.body.role === 'customer') {
            account = new Customer(req.body.name, req.body.email, req.body.pwd);
        } else {
            account = new Admin(req.body.name, req.body.email, req.body.pwd);
        }
        account.register();
        JSONResponse.success(req, res, 'Account registered', account.getJsonObject());
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message, error.stack);
        } else {
            console.log('An unknown error occurred', error);
        }
        JSONResponse.serverError(req, res, null, null);
    }
});

export default router;