import type { Db } from '#/server/db';
import { z } from 'zod';
import { publicProcedure } from '../../trpc';

const inputSchema = z.object({
  userId: z.number(),
  firstName: z.string(),
  lastName: z.string().optional(),
  userName: z.string().optional(),
});

export const createUserHandler = async (input: z.infer<typeof inputSchema>, db: Db) => {
  return await db.user.create({
    data: {
      id: input.userId,
      firstName: input.firstName,
      lastName: input.lastName,
      username: input.userName,
    },
  });
};

export default publicProcedure.input(inputSchema).mutation(async ({ input, ctx }) => {
  return await createUserHandler(input, ctx.db);
});
