import { IUseCaseError } from '@/core/errors/use-case-error';

class NotAllowedError extends Error implements IUseCaseError {
  constructor() {
    super('Not allowed.');
  }
}

export { NotAllowedError };
