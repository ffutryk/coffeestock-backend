import { Event } from "../../models/events/event";

export interface Handler {
  handle(event: Event<unknown>): Promise<void>;
}
