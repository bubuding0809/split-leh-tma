import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '#/server/api/trpc';

export const userRouter = createTRPCRouter({
  getUser: publicProcedure.input(z.object({ userId: z.number() })).query(async ({ input, ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: {
        id: input.userId,
      },
    });
    return user;
  }),

  createUser: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        firstName: z.string(),
        lastName: z.string().optional(),
        userName: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.user.create({
        data: {
          id: input.userId,
          firstName: input.firstName,
          lastName: input.lastName,
          username: input.userName,
        },
      });
    }),
});
