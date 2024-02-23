const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const keysDirectory = path.resolve(__dirname, '../keys/');

// Vérifier si le dossier existe déjà
if (!fs.existsSync(keysDirectory)) {
    try {
        // S'il n'existe pas, le créer
        fs.mkdirSync(keysDirectory);
        console.log('Répertoire des clés créé avec succès :', keysDirectory);
    } catch (err) {
        console.error('Erreur lors de la création du répertoire des clés :', err);
        process.exit(1);
    }
} else {
    console.log('Répertoire des clés déjà présent :', keysDirectory);
}

// Générer une nouvelle paire de clés
try {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });

    // Enregistrer la clé privée dans un fichier
    fs.writeFileSync(path.join(keysDirectory, 'private_key.pem'), privateKey);

    // Enregistrer la clé publique dans un fichier
    fs.writeFileSync(path.join(keysDirectory, 'public_key.pem'), publicKey);

    console.log('Paire de clés générée avec succès.');
} catch (err) {
    console.error('Erreur lors de la génération des clés :', err);
    process.exit(1);
}
