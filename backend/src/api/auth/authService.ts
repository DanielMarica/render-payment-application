import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import type { RegisterInput, LoginInput, AuthResponse } from '../../types/AuthTypes';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-do-not-use';
const SALT_ROUNDS = 10;

export async function register(input: RegisterInput): Promise<AuthResponse> {
  // 1. Vérifier si l'email existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email }
  });
  
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // 2. Hasher le mot de passe (Indispensable !)
  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  // 3. Créer l'utilisateur
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
    },
  });

  // 4. Générer le jeton (Token)
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' } // Expire dans 7 jours
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  // 1. Trouver l'utilisateur
  const user = await prisma.user.findUnique({
    where: { email: input.email }
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // 2. Vérifier le mot de passe hashé
  const validPassword = await bcrypt.compare(input.password, user.password);

  if (!validPassword) {
    throw new Error('Invalid email or password');
  }

  // 3. Générer le token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

// Fonction utilitaire pour vérifier un token plus tard
export function verifyToken(token: string): { userId: number; email: string } {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}