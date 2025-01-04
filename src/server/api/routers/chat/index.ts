import { createTRPCRouter } from '../../trpc';
import addMember from './addMember';
import createChat from './createChat';
import getChat from './getChat';
import getMembers from './getMembers';
import hasMember from './hasMember';

export const chatRouter = createTRPCRouter({
  createChat,
  getChat,
  addMember,
  getMembers,
  hasMember,
});
