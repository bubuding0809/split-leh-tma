import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "#/server/api/trpc";

export const userRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getUsers: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findMany();
  }),
});
