import { IsNotEmpty, IsString,Validate  } from 'class-validator';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Example } from './ex.interface';


export class CreateExampleDto {
   
    @IsNotEmpty()
    @IsString()
    public test!: string;

    @IsString()
    public name?: string | null ; // Autoriser name à être de type string ou undefined
}

export class UpdateExampleDto {
    @IsString()
    public name?: string;
}