import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "#/server/api/trpc";
import { ChatType } from "@prisma/client";

export const chatRouter = createTRPCRouter({
  getChat: publicProcedure
    .input(z.object({ chatId: z.bigint() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.chat.findUnique({
        where: {
          id: input.chatId,
        },
      });
    }),

  createChat: publicProcedure
    .input(
      z.object({
        chatId: z.bigint(),
        chatType: z.string(),
        chatTitle: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.chat.create({
        data: {
          id: input.chatId,
          title: input.chatTitle,
          type: input.chatType as ChatType,
        },
      });
    }),

  getMembers: publicProcedure
    .input(z.object({ chatId: z.bigint() }))
    .query(async ({ input, ctx }) => {
      const chat = await ctx.db.chat.findUnique({
        where: {
          id: input.chatId,
        },
        select: {
          members: true,
        },
      });

      return chat?.members;
    }),

  addMember: publicProcedure
    .input(
      z.object({
        chatId: z.bigint(),
        userId: z.bigint(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.chat.update({
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
    }),

  hasMember: publicProcedure
    .input(z.object({ chatId: z.bigint(), userId: z.bigint() }))
    .query(async ({ ctx, input }) => {
      const chat = await ctx.db.chat.findUnique({
        where: {
          id: input.chatId,
        },
        select: {
          members: {
            where: {
              id: input.userId,
            },
          },
        },
      });

      return Boolean(chat?.members.length);
    }),
});
