import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const apiKey = request.headers['x-api-key'];

    if (apiKey !== this.configService.get('MELD_SERVICE_AUTH_API_TOKEN')) {
      throw new UnauthorizedException('Invalid API key.');
    }

    return true;
  }
}
