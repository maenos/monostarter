import 'reflect-metadata';

import { App } from './app';

// index.ts
import dotenv from 'dotenv';
import path from 'path';
import { ExRoute } from '../expemple/ex.router';

// Déterminez le chemin du fichier .env en fonction de l'environnement
const envFile = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';

// Chargez les variables d'environnement à partir du fichier .env approprié
dotenv.config({ path: path.resolve(__dirname, '../..', envFile) });

const app = new App([
    new ExRoute
])


app.listen();
export const socketInstance = app.getSocketInstance();
