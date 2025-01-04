import type { Db } from '#/server/db';
import { z } from 'zod';
import { publicProcedure } from '../../trpc';

const inputSchema = z.object({ userId: z.number() });

export const getUserHandler = async (input: z.infer<typeof inputSchema>, db: Db) => {
  return await db.user.findUnique({
    where: {
      id: input.userId,
    },
  });
};

export default publicProcedure.input(inputSchema).mutation(async ({ input, ctx }) => {
  return await getUserHandler(input, ctx.db);
});
