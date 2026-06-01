import { AsyncLocalStorage } from "node:async_hooks";
import { EntityManager } from "typeorm";

export class TypeOrmTransactionContext {
  private static readonly storage = new AsyncLocalStorage<EntityManager>();

  static run<R>(manager: EntityManager, next: () => Promise<R>): Promise<R> {
    return this.storage.run(manager, next);
  }

  static getManager(): EntityManager | null {
    return this.storage.getStore() ?? null;
  }
}
