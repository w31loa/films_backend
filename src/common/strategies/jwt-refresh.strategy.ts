import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwtPayload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.header('refresh-token') ?? null,
      ]),
    });
  }

  validate = (payload: JwtPayload): JwtPayload => {
    if (!payload) {
      throw new UnauthorizedException();
    }
    return payload;
  };
}
