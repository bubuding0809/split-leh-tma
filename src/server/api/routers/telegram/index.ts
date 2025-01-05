import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';

export const telegramRouter = createTRPCRouter({
  getChat: publicProcedure
    .input(
      z.object({
        chatId: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const chat = await ctx.bot.telegram.getChat(input.chatId);

      const { big_file_id } = chat.photo ?? {};

      if (big_file_id) {
        const fileLink = await ctx.bot.telegram.getFileLink(big_file_id);

        return {
          ...chat,
          photoUrl: fileLink.href,
        };
      }

      return {
        ...chat,
        photoUrl: null,
      };
    }),
});
