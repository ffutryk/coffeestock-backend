import { AppDataSource } from "../config/data-source";
import { TypeOrmTransactionContext } from "../context/typeorm-transaction.context";

const wrapMethod = (descriptor: PropertyDescriptor) => {
  const fn = descriptor.value;
  descriptor.value = async function (...args: unknown[]) {
    if (TypeOrmTransactionContext.getManager()) return fn.apply(this, args);
    return AppDataSource.transaction((manager) =>
      TypeOrmTransactionContext.run(manager, () => fn.apply(this, args)),
    );
  };
};

export const Transactional = (): ClassDecorator => (target) => {
  const prototype = (target as Function).prototype;
  Object.getOwnPropertyNames(prototype)
    .filter((key) => key !== "constructor")
    .forEach((key) => {
      const desc = Object.getOwnPropertyDescriptor(prototype, key);
      if (desc && typeof desc.value === "function") {
        wrapMethod(desc);
        Object.defineProperty(prototype, key, desc);
      }
    });
};

export const TransactionalMethod =
  (): MethodDecorator => (_, __, descriptor: PropertyDescriptor) => {
    wrapMethod(descriptor);
    return descriptor;
  };
