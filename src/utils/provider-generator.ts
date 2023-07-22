import { ClassProvider, Type, ValueProvider } from '@nestjs/common';

export const useClass = (provide: string | symbol, useClass: Type<any>): ClassProvider => ({
  provide,
  useClass,
});

export const useValue = (provide: string | symbol, useValue: any): ValueProvider => ({
  provide,
  useValue,
});
