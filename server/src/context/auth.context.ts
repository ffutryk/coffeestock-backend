import { AsyncLocalStorage } from "node:async_hooks";

export class AuthContext {
  private static readonly storage = new AsyncLocalStorage<number>();

  static run(userId: number, next: () => void): void {
    this.storage.run(userId, next);
  }

  static getUserId(): number | null {
    return this.storage.getStore() ?? null;
  }
}
