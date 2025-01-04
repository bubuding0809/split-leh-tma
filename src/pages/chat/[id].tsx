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
} from '@telegram-apps/telegram-ui';
import useStartParams from '#/lib/hooks/tma/useStartParams';
import { ChatType } from '@prisma/client';
import { api } from '#/utils/api';
import { initDataUser, useSignal, mainButton } from '@telegram-apps/sdk-react';
import { env } from '#/env';

const Chat: NextPageWithLayout = () => {
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
    const enableRegisterButton = () => {
      mainButton.setParams({
        isVisible: true,
        isEnabled: true,
        text: 'Register',
      });
      return mainButton.onClick(() => {
        window.location.href = env.NEXT_PUBLIC_TELEGRAM_BOT_BASE_LINK + '?start=register';
      });
    };

    const disableRegisterButton = () => {
      mainButton.setParams({
        isVisible: false,
      });
    };

    let offMainButton: VoidFunction | undefined;

    if (!userData && !userDataLoading) {
      offMainButton = enableRegisterButton();
    }

    if (userData) {
      disableRegisterButton();
    }

    return () => {
      offMainButton?.();
    };
  }, [userData, userDataLoading]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <div className="flex items-center border rounded-full pe-2">
        <Avatar size={40} src={chatData?.photo} />
        <Text weight={'2'} className="ml-2">
          {chatData?.title}
        </Text>
      </div>

      {!userData && (
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

Chat.getLayout = page => {
  return <TmaSdkProvider>{page}</TmaSdkProvider>;
};

export default Chat;
