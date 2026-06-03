import { EventBus } from "./event-bus.interface";
import { Event } from "./event";
import { Handler } from "../../events/handlers/handler";

class EventBusImpl implements EventBus {
  private _listeners: Map<string, Handler[]> = new Map();

  async publish(event: Event<unknown>): Promise<void> {
    const listeners = this._listeners.get(event.type);

    if (listeners) {
      await Promise.all(listeners.map((listener) => listener.handle(event)));
    }
  }

  subscribe(eventType: string, listener: Handler): void {
    const listeners = this._listeners.get(eventType) ?? [];

    this._listeners.set(eventType, [...listeners, listener]);
  }
}

export const eventBus = new EventBusImpl();
