import { createTRPCRouter } from '../../trpc';
import createUser from './createUser';
import getUser from './getUser';

export const userRouter = createTRPCRouter({
  getUser,
  createUser,
});
