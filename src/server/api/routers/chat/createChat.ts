import type { Db } from '#/server/db';
import { z } from 'zod';
import { publicProcedure } from '../../trpc';
import { ChatType } from '@prisma/client';
import { getChatHandler } from './getChat';

const inputSchema = z.object({
  chatId: z.number(),
  chatTitle: z.string(),
  chatType: z.string(),
  chatPhoto: z.string().nullish(),
});

export const createChatHandler = async (input: z.infer<typeof inputSchema>, db: Db) => {
  return await db.chat.create({
    data: {
      id: input.chatId,
      title: input.chatTitle,
      type: input.chatType as ChatType,
      ...(input.chatPhoto && {
        photo: input.chatPhoto,
      }),
    },
  });
};

export default publicProcedure.input(inputSchema).mutation(async ({ input, ctx }) => {
  return await createChatHandler(input, ctx.db);
});
