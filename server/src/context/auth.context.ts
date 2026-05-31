import { AsyncLocalStorage } from "node:async_hooks";

export class AuthContext {
  private static readonly storage = new AsyncLocalStorage<number>();

  static run<R>(userId: number, next: () => R): R {
    return this.storage.run(userId, next);
  }

  static getUserId(): number | null {
    return this.storage.getStore() ?? null;
  }
}
