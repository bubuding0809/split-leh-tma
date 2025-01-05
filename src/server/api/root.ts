import { userRouter } from '#/server/api/routers/user';
import { createCallerFactory, createTRPCRouter } from '#/server/api/trpc';
import { chatRouter } from './routers/chat';
import { telegramRouter } from './routers/telegram';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  chat: chatRouter,
  telegram: telegramRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
