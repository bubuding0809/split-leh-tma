import { createCaller } from '#/server/api/root';
import { db } from '#/server/db';
import { bot } from '#/server/tgbot';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    const { chat_id: chatId, user_id: userId } = JSON.parse(req.body);

    const trpc = createCaller({
      db,
      bot,
    });

    try {
      const existingChat = await trpc.chat.getChat({
        chatId,
      });

      if (!existingChat) {
        res.status(404).json({ message: `Chat not found: ${chatId}` });
        return;
      }

      await trpc.chat.addMember({
        chatId,
        userId,
      });

      res.status(200).json({ message: `Added member: ${userId} to chat: ${chatId}` });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `Failed to add member ${userId} to chat ${chatId}` });
      return;
    }
  }

  // Handle other HTTP methods
  res.setHeader('Allow', ['PATCH']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
