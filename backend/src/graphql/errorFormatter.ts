import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { AppError } from '../errors/AppErrors';

// On change la signature pour correspondre à Apollo Server v4
export function formatError(formattedError: GraphQLFormattedError, error: unknown): GraphQLFormattedError {
  
  // Si l'erreur n'est pas une erreur GraphQL standard, on garde le formatage par défaut
  if (!(error instanceof GraphQLError)) {
    return formattedError;
  }

  // On récupère l'erreur originale (celle qu'on a throw dans le code)
  const originalError = error.originalError;

  // Log pour le développement
  console.error('GraphQL Error:', error);

  // 1. Gestion des erreurs personnalisées (AppError)
  if (originalError instanceof AppError) {
    return {
      message: originalError.message,
      extensions: {
        code: originalError.code,
        statusCode: originalError.statusCode,
      },
      // On garde les locations/path du formatage par défaut
      locations: formattedError.locations,
      path: formattedError.path,
    };
  }

  // 2. Gestion des erreurs Prisma
  if (originalError?.name === 'PrismaClientKnownRequestError') {
    const prismaError = originalError as any;
    if (prismaError.code === 'P2002') {
      return {
        message: 'A record with this unique field already exists',
        extensions: { code: 'CONFLICT', statusCode: 409 },
      };
    }
    if (prismaError.code === 'P2025') {
      return {
        message: 'Record not found',
        extensions: { code: 'NOT_FOUND', statusCode: 404 },
      };
    }
  }

  // 3. En Production : Masquer les erreurs internes
  if (process.env.NODE_ENV === 'production') {
    return {
      message: 'An unexpected error occurred',
      extensions: { code: 'INTERNAL_SERVER_ERROR' },
    };
  }

  // 4. En Développement : Renvoyer l'erreur complète
  return {
    message: formattedError.message,
    extensions: {
      code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
      stack: error.stack,
    },
    locations: formattedError.locations,
    path: formattedError.path,
  };
}