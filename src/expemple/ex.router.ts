import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import { ExempleController } from './ex.controller';








export class ExRoute implements Routes {

    public path = '/ex';
    public router = Router();
    public ex = new ExempleController();


    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.ex.createExemple);
    }


}
