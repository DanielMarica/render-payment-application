// Imports mis à jour
import { AuthenticationError, AuthorizationError } from '../errors/AppErrors';
import type { GraphQLContext } from '../types/GraphQlContext';

export function requireAuth(context: GraphQLContext) {
  if (!context.user) {
    // Nouvelle erreur 401
    throw new AuthenticationError('You must be logged in to perform this action');
  }
  return context.user;
}

export function requireOwnership(
  userId: number,
  resourceOwnerId: number,
  resourceName: string = 'resource'
): void {
  if (userId !== resourceOwnerId) {
    // Nouvelle erreur 403
    throw new AuthorizationError(`You don't have permission to access this ${resourceName}`);
  }
}