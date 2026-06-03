export abstract class Event<T> {
  type: string;
  payload: T;
  createdAt: Date;

  constructor(payload: T) {
    this.type = this.constructor.name;
    this.payload = payload;
    this.createdAt = new Date();
  }
}
