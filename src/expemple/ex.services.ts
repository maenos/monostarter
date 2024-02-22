import { PrismaClient } from '@prisma/client';
import { Service } from 'typedi';
import { CreateExampleDto } from './ex.dto';
import { Example } from './ex.interface';



@Service()
export class ExService {
    public exemple = new PrismaClient().exemple;

    public async createExmple(exData: CreateExampleDto): Promise<Example> {

        const createExemple: Example = await this.exemple.create({ data: { ...exData } });
        return createExemple;

    }

}