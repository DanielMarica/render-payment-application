import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import type { RegisterInput, LoginInput, AuthResponse } from '../../types/AuthTypes';
// NOUVEL IMPORT
import { AuthenticationError, ConflictError } from '../../errors/AppErrors';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-do-not-use';
const SALT_ROUNDS = 10;

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email }
  });
  
  if (existingUser) {
    // ERREUR PRÉCISE ICI
    throw new ConflictError('User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
    },
  });

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const user = await prisma.user.findUnique({
    where: { email: input.email }
  });

  if (!user) {
    // ERREUR PRÉCISE ICI
    throw new AuthenticationError('Invalid email or password');
  }

  const validPassword = await bcrypt.compare(input.password, user.password);

  if (!validPassword) {
    // ERREUR PRÉCISE ICI
    throw new AuthenticationError('Invalid email or password');
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
}

export function verifyToken(token: string): { userId: number; email: string } {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
  } catch (error) {
    // ERREUR PRÉCISE ICI
    throw new AuthenticationError('Invalid or expired token');
  }
}