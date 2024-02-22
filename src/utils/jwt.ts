import fs from 'fs';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Function to read the content of a file
function readFile(filePath: string): string {
    return fs.readFileSync(filePath, 'utf8');
}

// Paths to the private and public keys
const privateKeyPath = './keys/private.pem';
const publicKeyPath = './keys/public.pem';

// Read the content of the private and public keys
const privateKey = readFile(privateKeyPath);
const publicKey = readFile(publicKeyPath);

// Function to generate a JWT token
export function generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
}

// Function to verify a JWT token
export function verifyToken(token: string): JwtPayload | string {
    try {
        const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
        return decoded as JwtPayload;
    } catch (error) {
        return error.message;
    }
}

// Function to decode a JWT token
export function decodeToken(token: string): JwtPayload | null {
    const decoded = jwt.decode(token);
    return decoded as JwtPayload | null;
}

export default { generateToken, verifyToken, decodeToken };
