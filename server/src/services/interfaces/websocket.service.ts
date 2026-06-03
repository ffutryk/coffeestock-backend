import { SocketEvent } from "../../models/types/websocket.types";

export interface IWebSocketService {
  broadcast(event: SocketEvent<unknown>): void;
}
