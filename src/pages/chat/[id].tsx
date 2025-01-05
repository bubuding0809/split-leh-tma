import React, { useEffect } from 'react';
import TmaSdkProvider from '#/components/layouts/TmaSdkProvider';
import { NextPageWithLayout } from '#/pages/_app';
import {
  Avatar,
  Button,
  Cell,
  Placeholder,
  Skeleton,
  Title,
  Text,
  Spinner,
} from '@telegram-apps/telegram-ui';
import useStartParams from '#/lib/hooks/tma/useStartParams';
import { Chat, ChatType, User } from '@prisma/client';
import { api } from '#/utils/api';
import {
  initDataUser,
  useSignal,
  mainButton,
  retrieveLaunchParams,
  openTelegramLink,
} from '@telegram-apps/sdk-react';
import { env } from '#/env';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { createCaller } from '#/server/api/root';
import { db } from '#/server/db';

export const getServerSideProps = (async ctx => {
  const trpc = createCaller({
    db,
  });

  const { userId } = ctx.query;

  const user = await trpc.user.getUser({
    userId: Number(userId),
  });

  return {
    props: {
      chat: null,
      user: JSON.parse(JSON.stringify(user)) as User | null,
    },
  };
}) satisfies GetServerSideProps;

const ChatPage: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  user,
}) => {
  const tmaUser = useSignal(initDataUser);
  const startParams = useStartParams();
  const chatType = (startParams?.chat_type ?? 'private') as ChatType;
  const isGroup = chatType === 'group' || chatType === 'supergroup';

  const userId = tmaUser?.id ?? 0;
  const chatId = startParams?.chat_id ?? 0;

  // * ============== Queries ==========================
  const { data: userData, isLoading: userDataLoading } = api.user.getUser.useQuery(
    {
      userId,
    },
    {
      enabled: !!userId,
      initialData: user,
    }
  );
  const { data: chatData, isLoading: chatDataLoading } = api.chat.getChat.useQuery(
    {
      chatId,
    },
    {
      enabled: !!chatId,
    }
  );

  // * ============== Mutations ========================
  const { mutateAsync: addMember } = api.chat.addMember.useMutation();

  // Can either user doesn't exist or user is not a member of the group and the chat is a group
  const isMember = chatData?.members?.some(member => Number(member.id) === userId);
  const canJoinGroup = (!userData || !isMember) && isGroup && !userDataLoading && !chatDataLoading;

  useEffect(() => {
    const handleJoinGroup = async () => {
      if (!tmaUser || !userData) return;

      const { id } = userData;
      const userId = Number(id);

      await addMember({
        chatId,
        userId,
      });
    };

    if (canJoinGroup) handleJoinGroup();
  }, [canJoinGroup, tmaUser, userData]);

  useEffect(() => {
    if (userData === null) {
      mainButton.setParams({
        isEnabled: false,
        isLoaderVisible: true,
        hasShineEffect: true,
        isVisible: true,
      });
      setTimeout(
        () => openTelegramLink(env.NEXT_PUBLIC_TELEGRAM_BOT_BASE_LINK + '?start=register'),
        500
      );
    }

    return () => {
      mainButton.setParams({
        isVisible: false,
      });
    };
  }, [userData]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      {userData ? (
        <>
          {chatDataLoading && <Spinner size="m" />}
          {chatData && (
            <div className="flex items-center border rounded-full pe-2">
              <Avatar size={40} src={chatData.photo} />
              <Text weight={'2'} className="ml-2">
                {chatData.title}
              </Text>
            </div>
          )}
        </>
      ) : (
        <Placeholder
          description="Register below to get started!"
          header={`🥵 ${tmaUser?.firstName}, you didn't sign up yet!`}>
          <img
            alt="Telegram sticker"
            className="blt0jZBzpxuR4oDhJc8s"
            src="https://xelene.me/telegram.gif"
          />
        </Placeholder>
      )}
    </div>
  );
};

ChatPage.getLayout = page => {
  return <TmaSdkProvider>{page}</TmaSdkProvider>;
};

export default ChatPage;
