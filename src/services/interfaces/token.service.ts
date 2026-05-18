import { JwtPayload } from "jsonwebtoken";
import { TokenPayload } from "../../models/types/token-payload";

export interface ITokenService {
  generarToken(payload: JwtPayload): string;
  validarToken(token: string): string | JwtPayload;
}
