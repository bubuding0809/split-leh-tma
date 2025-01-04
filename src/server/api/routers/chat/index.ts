import { createTRPCRouter } from '../../trpc';
import createChat from './createChat';
import getChat from './getChat';
import getMembers from './getMembers';
import hasMember from './hasMember';

export const chatRouter = createTRPCRouter({
  createChat,
  getChat,
  getMembers,
  hasMember,
});
