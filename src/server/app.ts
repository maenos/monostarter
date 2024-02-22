import express, { Request, Response, NextFunction, Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import path from 'path';
import { corsOptions, generateCorsOptions } from '../config/corsOptions';
import { normalLogger, errorLogger } from '../config/logger';
import { Routes } from '../interfaces/routes.interface';
import { Server, Socket } from 'socket.io';
import { setupSwagger } from '../config/swagger';
import reqip from 'request-ip';
import cookieParser from 'cookie-parser';

// Fonction pour obtenir l'adresse IP de l'origine à partir de la requête
const getOriginIpAddress = (req: Request): string | undefined => {
    // Utiliser reqip pour obtenir l'adresse IP de l'origine
    return reqip.getClientIp(req);
};
export class App {
    public app: express.Application;
    public env: string;
    public port: string | number;
    public http: any;
    public io: any;

    constructor(routes: Routes[]) {
        this.app = express();
        this.env = process.env.NODE_ENV || 'development'; // Correction de la variable d'environnement
        this.port = process.env.PORT || 3000; // Correction du port
        this.http = require('http').createServer(this.app);
        this.io = require('socket.io')(this.http, {
            cors: {
                origin: '*',
            },
        });
        this.setupMiddlewares();
        this.initializeRoutes(routes);
        this.initializeSocket();
        this.setupSwagger(); // Appel de la fonction setupSwagger pour configurer Swagger
    }

    private setupMiddlewares(): void {
        this.app.use(reqip.mw());
        // Middleware CORS
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            if (res.headersSent) {
                return next();
            }
           
            // Obtenir l'adresse IP de l'origine
            const origin = getOriginIpAddress(req) || '';
            const corsOptions = generateCorsOptions(origin);

            // Vérifier si l'origine est autorisée en fonction des options CORS
            const isCorsAllowed = corsOptions && corsOptions.origin && (
                Array.isArray(corsOptions.origin)
                    ? corsOptions.origin.includes(origin)
                    : corsOptions.origin === origin
            );

            // Enregistrer dans les logs si la demande est autorisée ou non, y compris l'adresse IP
            const logMessage = `[${isCorsAllowed ? 'ALLOWED' : 'DENIED'}] ${req.method} ${req.url} - IP: ${origin}`;
            normalLogger.info(logMessage);
            next();
        });

        // Middleware pour les erreurs
        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            // Enregistrer l'erreur dans les logs avec l'adresse IP
            const origin = getOriginIpAddress(req) || '';
            const errorMessage = `Error: ${err.stack} - IP: ${origin}`;
            errorLogger.error(errorMessage);
            res.status(500).send('Une erreur est survenue');
        });


        this.app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
        this.app.use(cors(corsOptions));
        this.app.use(helmet());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(express.json());
        
        this.app.use(fileUpload({ limits: { fileSize: 10 * 1024 * 1024 } }));
        this.app.use('/public', express.static(path.join(__dirname, '..', 'public')));
        this.app.use(cookieParser());

    }

    private initializeRoutes(routes: Routes[]) {


        routes.forEach(route => {
            this.app.use('/api', route.router); // Utiliser le basePath pour monter les routes
        });
    }


    public listen(): void {
        this.http.listen(this.port, () => {
            normalLogger.info(`=================================`);
            normalLogger.info(`🚀 App listening on the port ${this.port}`);
            normalLogger.info(`=================================`);
        });
    }

    public initializeSocket() {
        this.io.on('connection', (socket: Socket) => {
            console.log('a user connected');

            // Envoyer un message de bienvenue à l'utilisateur connecté
            socket.emit('welcome', 'Welcome to the Socket.io server!');

            // Gérer les messages envoyés par l'utilisateur
            socket.on('message', (data: string) => {
                console.log('message received:', data);

                // Diffuser le message à tous les autres utilisateurs connectés
                socket.broadcast.emit('message', data);
            });

            // Gérer la déconnexion de l'utilisateur
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });
    }


    public getSocketInstance() {
        return this.io;
    }

    public getServer() {
        return this.app;
    }

    private setupSwagger() {
        setupSwagger(this.app); // Utilisation de la fonction setupSwagger pour configurer Swagger dans l'application
    }
}
