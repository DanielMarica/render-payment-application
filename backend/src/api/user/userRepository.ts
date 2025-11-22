// Remplace la ligne import ... from '../../../generated/prisma' par :
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllUsers() {
  return prisma.user.findMany(); // L'erreur devrait disparaître
}