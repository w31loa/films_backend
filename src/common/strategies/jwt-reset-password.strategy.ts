import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwtPayload.interface";
import { ValidatedUser } from "../interfaces/validatedUser.interface";

@Injectable()
export class JwtResetPasswordStrategy extends PassportStrategy(Strategy, 'jwt-reset-password') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('token'),
      ignoreExpiration: false,
      secretOrKey: configService.get('RESET_PASSWORD_JWT_SECRET'),
    });
  }

  validate = (payload: JwtPayload): ValidatedUser => ({
    id: payload.id,
    email: payload.email, 
  });
}
