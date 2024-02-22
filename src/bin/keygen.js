import * as fs from 'fs';
import * as crypto from 'crypto';

// Chemin du dossier où les clés seront enregistrées
const keysDirectory = '../keys/';

// Vérifier si le dossier existe, sinon le créer
if (!fs.existsSync(keysDirectory)) {
    fs.mkdirSync(keysDirectory);
}

// Générer une nouvelle paire de clés
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096, // Longueur de la clé RSA
    publicKeyEncoding: {
        type: 'spki', // Format de la clé publique
        format: 'pem' // Encodage de la clé publique
    },
    privateKeyEncoding: {
        type: 'pkcs8', // Format de la clé privée
        format: 'pem' // Encodage de la clé privée
    }
});

// Enregistrer la clé privée dans un fichier
fs.writeFileSync(`${keysDirectory}private_key.pem`, privateKey);

// Enregistrer la clé publique dans un fichier
fs.writeFileSync(`${keysDirectory}public_key.pem`, publicKey);

console.log('Paire de clés générée avec succès.');
