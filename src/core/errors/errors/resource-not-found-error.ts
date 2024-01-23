import { IUseCaseError } from '@/core/errors/use-case-error';

class ResourceNotFoundError extends Error implements IUseCaseError {
  constructor() {
    super('Resource not found.');
  }
}

export { ResourceNotFoundError };
