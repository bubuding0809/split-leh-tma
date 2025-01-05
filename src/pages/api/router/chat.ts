import { createCaller } from '#/server/api/root';
import { db } from '#/server/db';
import { bot } from '#/server/tgbot';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'GET chat resource still under construction' });
    return;
  }

  if (req.method === 'POST') {
    const {
      chat_id: chatId,
      chat_title: chatTitle,
      chat_type: chatType,
      chat_photo_url: chatPhoto,
    } = JSON.parse(req.body);

    const trpc = createCaller({
      db,
      bot,
    });

    try {
      const existingChat = await trpc.chat.getChat({
        chatId,
      });

      if (existingChat) {
        res.status(200).json({ message: `Chat already exists: ${existingChat.id}` });
        return;
      }

      const chat = await trpc.chat.createChat({
        chatId,
        chatTitle,
        chatType,
        chatPhoto,
      });

      res.status(201).json({ message: `Created chat: ${chat.id}` });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create chat' });
      return;
    }
  }

  // Handle other HTTP methods
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
