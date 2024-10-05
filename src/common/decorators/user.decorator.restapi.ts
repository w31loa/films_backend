import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ValidatedUser } from '../interfaces/validatedUser.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): ValidatedUser => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
