import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { SocketEvent } from "../models/types/websocket.types";
import { IWebSocketService } from "./interfaces/websocket.service";

export class WebsocketService implements IWebSocketService {
  private static instance: WebsocketService;
  private io: Server | null = null;

  private constructor() {}

  public static getInstance(): WebsocketService {
    if (!WebsocketService.instance) {
      WebsocketService.instance = new WebsocketService();
    }
    return WebsocketService.instance;
  }

  public init(server: HttpServer): void {
    if (this.io) return;
    this.io = new Server(server, { cors: { origin: "*" } });
    console.log("[WS] Ready");
  }

  public broadcast(notification: SocketEvent<unknown>): void {
    if (!this.io) {
      return;
    }
    this.io.emit(notification.type, notification.payload);
  }
}
