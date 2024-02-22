import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { CreateExampleDto } from './ex.dto';
import { Example } from './ex.interface';
import { ExService } from './ex.services';


export class ExempleController {
    public exemples = Container.get(ExService);


    public createExemple = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const exData: Example = req.body;
            const createExempleData: CreateExampleDto = await this.exemples.createExmple( {  test: 'tesddct1', name: 'example1' });

            res.status(201).json({ data: createExempleData, message: 'created' });
        } catch (error) {
            next(error);
        }
    };

}