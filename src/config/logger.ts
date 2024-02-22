import winston from 'winston';
import path from 'path';

const logsDirectory = path.join(__dirname, '..', 'logs'); // Chemin complet du répertoire de logs

// Configuration du transport pour les logs normaux
export const normalLogger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logsDirectory, 'normal.log') }) // Enregistre les logs normaux dans le fichier normal.log
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  )
});

// Configuration du transport pour les erreurs
export const errorLogger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logsDirectory, 'error.log'), level: 'error' }) // Enregistre les erreurs dans le fichier error.log
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  )
});


// Fonction pour récupérer l'adresse IP de l'origine
export const getOriginIpAddress = (origin: string | undefined): string => {
  // Si l'origine n'est pas définie, retourner une valeur par défaut
  if (!origin) {
    return 'Unknown IP';
  }

  // Utiliser le module request-ip pour obtenir l'adresse IP de l'origine
  try {
    const requestIp = require('request-ip');
    const clientIp = requestIp.getClientIp({ headers: { 'x-forwarded-for': origin } });
    return clientIp || 'Unknown IP'; // Si l'adresse IP n'est pas disponible, retourner "Unknown IP"
  } catch (error) {
    // En cas d'erreur, enregistrez-la dans les logs d'erreurs
    errorLogger.error(`Error getting origin IP: ${error.message}`);
    return 'Unknown IP'; // Retourner "Unknown IP" en cas d'erreur
  }
};