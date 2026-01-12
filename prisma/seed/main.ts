import { prisma } from '../client';
import { options, seed } from './seed';
import { parseArgs } from 'node:util';
import { OptionDefinition } from './types';

async function main() {
  const helpOptions = {
    ...options,
    help: { type: 'boolean' as const, short: 'h' },
  };
  const { values } = parseArgs({ options: helpOptions });

  if (values.help) {
    const entries = Object.entries(options) as [string, OptionDefinition][];

    const rows = entries.map(([key, value]) => {
      const shortPart = value.short ? `-${value.short}, ` : '';

      return {
        short: shortPart,
        long: `--${key}`,
        type: `(${value.type})`,
        description: value.description,
      };
    });

    const widths = {
      short: Math.max(...rows.map(r => r.short.length), 0),
      long: Math.max(...rows.map(r => r.long.length)),
      type: Math.max(...rows.map(r => r.type.length)),
    };

    let optionString = rows
      .map(
        r =>
          '  ' +
          `${r.short.padEnd(widths.short)}` +
          `${r.long.padEnd(widths.long + 2)}` +
          `${r.type.padEnd(widths.type + 2)}` +
          `${r.description}`
      )
      .join('\n');

    console.log(`\nOptions:\n${optionString}`);
  } else {
    if (Object.keys(values).length > 0) {
      const entries = Object.entries(values);
      const maxKey = Math.max(...entries.map(([k]) => k.length));
      const args = entries
        .map(([key, value]) => `  ${key.padEnd(maxKey)} : ${value}`)
        .join('\n');
      console.log(`\nArguments:\n${args}`);
    }

    await seed(values);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
