import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Error handling middleware
 * @param error The error
 * @param request The request
 * @param reply The reply
 */
export const errorHandler = (
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  // Log the error
  console.error(`Error processing request ${request.method} ${request.url}:`, error);

  // Check if the error is a validation error
  if (error.name === 'ValidationError') {
    return reply.status(400).send({
      error: 'Validation Error',
      message: error.message,
    });
  }

  // Check if the error is an authentication error
  if (error.message === 'Invalid token' || error.message === 'Token expired') {
    return reply.status(401).send({
      error: 'Authentication Error',
      message: error.message,
    });
  }

  // Check if the error is a not found error
  if (error.message.includes('not found')) {
    return reply.status(404).send({
      error: 'Not Found',
      message: error.message,
    });
  }

  // Default to 500 internal server error
  return reply.status(500).send({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : error.message,
  });
}; 