import type { Db } from '#/server/db';
import { z } from 'zod';
import { publicProcedure } from '../../trpc';

const inputSchema = z.object({
  chatId: z.bigint(),
});

export const getChatHandler = async (input: z.infer<typeof inputSchema>, db: Db) => {
  return await db.chat.findUnique({
    where: {
      id: input.chatId,
    },
  });
};

export default publicProcedure.input(inputSchema).mutation(async ({ input, ctx }) => {
  return await getChatHandler(input, ctx.db);
});
