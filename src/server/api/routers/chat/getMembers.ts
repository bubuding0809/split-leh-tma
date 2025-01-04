import type { Db } from '#/server/db';
import { z } from 'zod';
import { publicProcedure } from '../../trpc';

const inputSchema = z.object({ chatId: z.number() });

export const getMembersHandler = async (input: z.infer<typeof inputSchema>, db: Db) => {
  const chat = await db.chat.findUnique({
    where: {
      id: input.chatId,
    },
    select: {
      members: true,
    },
  });

  return chat?.members;
};

export default publicProcedure.input(inputSchema).query(async ({ input, ctx }) => {
  return await getMembersHandler(input, ctx.db);
});
