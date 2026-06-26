import { JwtPayload } from "jsonwebtoken";

export interface ITokenService {
  generarToken(payload: JwtPayload): string;
  validarToken(token: string): string | JwtPayload;
}
