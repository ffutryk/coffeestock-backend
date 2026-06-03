import { Event } from "./event";

export interface EventBus {
  publish(event: Event<unknown>): void;
}
