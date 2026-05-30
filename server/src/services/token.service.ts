import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config/envs";
import { ITokenService } from "./interfaces/token.service";

class TokenService implements ITokenService {
  generarToken(contenido: JwtPayload) {
    const token = jwt.sign(contenido, JWT_SECRET, { expiresIn: "24h" });
    console.log(token);
    return token;
  }
  validarToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
  }
}

export default TokenService;
