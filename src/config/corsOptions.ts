// config/corsOptions.ts

import { Request, Response } from 'express';
import allowedOrigins from './allowedOrigins';
import { CorsOptions } from 'cors';
import { errorLogger } from './logger';



// Générer les options CORS en fonction de l'origine demandée
export const generateCorsOptions = (origin: string | undefined): CorsOptions => {
  const allowedOriginsKeys = Object.keys(allowedOrigins);

  // Vérifie si l'origine demandée correspond à une origine autorisée
  const matchedOrigin = allowedOriginsKeys.find((key) => origin === key);

  // Si une correspondance est trouvée, retournez les options CORS correspondantes
  if (matchedOrigin) {
    return {
      origin: allowedOrigins[matchedOrigin],
      optionsSuccessStatus: 200 // Retourne le statut 200 pour les pré-vols OPTIONS
    };
  }

  // Si aucune correspondance n'est trouvée, retournez les options CORS par défaut
  return {
    origin: ['http://default.com'], // Origine autorisée par défaut
    optionsSuccessStatus: 200 // Retourne le statut 200 pour les pré-vols OPTIONS
  };
};


export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // En mode développement, autorisez toutes les origines
    if (process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      // Vérifiez si l'origine est dans la liste des origines autorisées
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Enregistrez l'erreur dans les logs
        errorLogger.error(`CORS Error: Origin ${origin} not allowed`);
        // Appelez le callback avec une erreur
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  optionsSuccessStatus: 200
};
