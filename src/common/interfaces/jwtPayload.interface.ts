import { Payload } from './payload.interface';

export interface JwtPayload extends Payload {
  iat: number;
  exp: number;
}
