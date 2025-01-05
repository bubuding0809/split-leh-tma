import { Telegraf } from 'telegraf';
import { env } from '#/env';

const createBot = () => {
  const bot = new Telegraf(env.TELEGRAM_BOT_TOKEN, {
    // Add any bot configurations here
    handlerTimeout: env.NODE_ENV === 'production' ? 30_000 : 90_000,
  });

  if (env.NODE_ENV === 'development') {
    bot.use(Telegraf.log());
  }

  return bot;
};

const globalForBot = globalThis as unknown as {
  bot: ReturnType<typeof createBot> | undefined;
};

export const bot = globalForBot.bot ?? createBot();
export type Bot = typeof bot;

if (env.NODE_ENV !== 'production') globalForBot.bot = bot;
