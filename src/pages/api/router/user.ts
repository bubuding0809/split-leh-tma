import { createCaller } from '#/server/api/root';
import { db } from '#/server/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'GET user resource still under construction' });
    return;
  }

  if (req.method === 'POST') {
    const {
      user_id: userId,
      first_name: firstName,
      last_name: lastName,
      username: userName,
    } = JSON.parse(req.body);

    const trpc = createCaller({
      db,
    });

    try {
      const existingUser = await trpc.user.getUser({
        userId,
      });

      if (existingUser) {
        res.status(200).json({ message: `User already exist: ${existingUser.id}` });
        return;
      }

      const user = await trpc.user.createUser({
        userId,
        firstName,
        lastName,
        userName,
      });
      res.status(201).json({ message: `Created user: ${user.id}` });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create user' });
      return;
    }
  }

  // Handle other HTTP methods
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
