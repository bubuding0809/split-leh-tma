import type { Db } from '#/server/db';
import { z } from 'zod';
import { publicProcedure } from '../../trpc';

const inputSchema = z.object({
  chatId: z.number(),
  userId: z.number(),
});

export const addMemberHandler = async (input: z.infer<typeof inputSchema>, db: Db) => {
  await db.chat.update({
    where: {
      id: input.chatId,
    },
    data: {
      members: {
        connect: {
          id: input.userId,
        },
      },
    },
  });
};

export default publicProcedure.input(inputSchema).mutation(async ({ input, ctx }) => {
  return addMemberHandler(input, ctx.db);
});
