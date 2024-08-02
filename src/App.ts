import express from 'express';
import * as bodyParser from 'body-parser';
import indexRouter from './routes/account'
import SlotManager from "./models/SlotManager";
import Admin from "./models/Admin";

class App {
    public express
    public admin1: Admin;
    private admin2: Admin;
    constructor() {
        this.express = express()
        this.express.use(bodyParser.json())
        this.loadRoutes()
        this.admin1 = new Admin('Alice', 'lol@gmail.com', 'admin');
        this.admin2 = new Admin('Admin2', 'lol@gmail.com', 'admin');
        this.admin1.setName('new name 9');
        console.log(this.admin2.getName());
    }

    private loadRoutes(): void {
        this.express.use('/', indexRouter);

    }

}

export default new App().express;