import { options } from './seed';

type ArgTypeMap = {
  string: string;
  boolean: boolean;
};

type ArgOptions = typeof options;

export type SeedArguments = {
  [K in keyof ArgOptions]?: ArgTypeMap[ArgOptions[K]['type']];
};

export type OptionDefinition = {
  type: keyof ArgTypeMap;
  description: string;
  short?: string;
};

export function defineOptions<T extends Record<string, OptionDefinition>>(
  options: T
): T {
  return options;
}
