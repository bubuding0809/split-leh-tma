import React from "react";
import TmaSdkProvider from "#/components/layouts/TmaSdkProvider";
import { NextPageWithLayout } from "#/pages/_app";
import { Button, Title } from "@telegram-apps/telegram-ui";
import useStartParams from "#/lib/hooks/tma/useStartParams";
import { ChatType } from "@prisma/client";
import { api } from "#/utils/api";
import { initDataUser, useSignal } from "@telegram-apps/sdk-react";

const Chat: NextPageWithLayout = () => {
  const tmaUser = useSignal(initDataUser);
  const startParams = useStartParams();
  const chatType = (startParams?.chat_type ?? "private") as ChatType;
  const isGroup = chatType === "group" || chatType === "supergroup";

  const userId = BigInt(tmaUser?.id ?? 0);
  const chatId = BigInt(startParams?.chat_id ?? 0);

  // * ============== Queries ==========================
  const { data: userData } = api.user.getUser.useQuery(
    {
      userId,
    },
    {
      enabled: !!userId,
    },
  );
  const { data: hasMember } = api.chat.hasMember.useQuery(
    {
      chatId,
      userId,
    },
    {
      enabled: !!userId && !!chatId,
    },
  );
  const { data: chatData } = api.chat.getChat.useQuery(
    {
      chatId,
    },
    {
      enabled: !!chatId,
    },
  );
  const { data: chatMembers } = api.chat.getMembers.useQuery(
    {
      chatId,
    },
    {
      enabled: !!chatId,
    },
  );

  // * ============== Mutations ========================
  const { mutateAsync: createUser } = api.user.createUser.useMutation();
  const { mutateAsync: addMember } = api.chat.addMember.useMutation();
  const { mutateAsync: createChat } = api.chat.createChat.useMutation();

  // Can either user doesn't exist or user is not a member of the group and the chat is a group
  const canJoinGroup = (!userData || !hasMember) && isGroup;

  const handleJoinGroup = async () => {
    if (!tmaUser) {
      return;
    }

    const { firstName, lastName, username: userName } = tmaUser;

    if (!userData) {
      await createUser({
        userId,
        firstName,
        lastName,
        userName,
      });
    }

    if (!chatData) {
      await createChat({
        chatId,
        chatType,
        chatTitle: "Group",
      });
    }

    await addMember({
      chatId,
      userId,
    });
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <Title>chat: {startParams?.chat_id ?? "No chat"}</Title>
      <pre>{JSON.stringify(startParams, null, 2)}</pre>
      <div>
        {canJoinGroup && <Button onClick={handleJoinGroup}>Join</Button>}
      </div>
      <ol>
        <Title>Members</Title>
        {chatMembers?.map((member, index) => (
          <li key={member.id}>
            {index + 1}: {member.firstName}
          </li>
        ))}
      </ol>
    </div>
  );
};

Chat.getLayout = (page) => {
  return <TmaSdkProvider>{page}</TmaSdkProvider>;
};

export default Chat;
