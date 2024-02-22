import bcrypt from 'bcryptjs';

// Fonction pour hacher un mot de passe
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Nombre de "tour" du chiffrement

    // Utiliser bcrypt pour hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

// Fonction pour vérifier un mot de passe haché
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    // Utiliser bcrypt pour comparer le mot de passe fourni avec le mot de passe haché
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}

