import { ConflictException } from '@nestjs/common';

import { BaseModel, BaseModelClass } from './';

export const transaction = (
  {
    model = BaseModel,
    onRollback,
    onConflict,
    onError,
  }: {
    model?: BaseModelClass;
    onRollback?: (err: any) => void;
    onConflict?: (err: any) => void;
    onError?: (err: any) => void;
  } = {
    model: BaseModel,
  },
) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const original = descriptor.value;

    descriptor.value = async function (...args) {
      const trx = await model.startTransaction();

      try {
        const res = await original.call(this, ...args, trx);

        await trx.commit();

        return res;
      } catch (err) {
        await trx.rollback();
        onRollback && onRollback(err);

        if (
          model.isUniqueViolationError(err) ||
          model.isSerializationError(err)
        ) {
          onConflict && onConflict(err);
          throw new ConflictException();
        } else {
          onError && onError(err);
        }

        throw err;
      }
    };
  };
};
