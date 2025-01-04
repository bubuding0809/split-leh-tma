import type { Db } from '#/server/db';
import { z } from 'zod';
import { publicProcedure } from '../../trpc';

const inputSchema = z.object({
  chatId: z.number(),
});

export const getChatHandler = async (input: z.infer<typeof inputSchema>, db: Db) => {
  return await db.chat.findUnique({
    where: {
      id: BigInt(input.chatId),
    },
    include: {
      members: true,
    },
  });
};

export default publicProcedure.input(inputSchema).query(async ({ input, ctx }) => {
  return await getChatHandler(input, ctx.db);
});
