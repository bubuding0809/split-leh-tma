import { createCaller } from '#/server/api/root';
import { db } from '#/server/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Handle GET request
    res.status(200).json({ message: 'Hello from the API!' });
  } else if (req.method === 'POST') {
    // Handle POST request
    const {
      chat_id: chatId,
      chat_title: chatTitle,
      chat_type: chatType,
      chat_photo_url: chatPhoto,
    } = JSON.parse(req.body);

    const trpc = createCaller({
      db,
    });

    try {
      await trpc.chat.createChat({
        chatId,
        chatTitle,
        chatType,
        chatPhoto,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create chat' });
      return;
    }

    res.status(200).json({ message: 'Created chat' });
  } else {
    // Handle other HTTP methods
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
