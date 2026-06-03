import { GravedadAlerta } from "../enums/gravedad-alerta";

export interface SocketEvent<T = unknown> {
  type: string;
  payload: T;
}

export interface AlertaPayload {
  id: number;
  mensaje: string;
  gravedad: GravedadAlerta;
  createdAt: Date;
}
