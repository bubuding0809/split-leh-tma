"use client";

import React from "react";
import TmaSdkProvider from "#/components/layouts/TmaSdkProvider";
import { NextPageWithLayout } from "#/pages/_app";
import { Button, Title } from "@telegram-apps/telegram-ui";
import useStartParams from "#/lib/hooks/tma/useStartParams";
import { ChatType } from "@prisma/client";

const Chat: NextPageWithLayout = () => {
  const startParams = useStartParams();
  const chatType = (startParams?.chat_type ?? "private") as ChatType;
  const isGroup = chatType === "group" || chatType === "supergroup";

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <Title>chat: {startParams?.chat_id ?? "No chat"}</Title>
      <pre>{JSON.stringify(startParams, null, 2)}</pre>
      <div>{isGroup && <Button>Join</Button>}</div>
    </div>
  );
};

Chat.getLayout = (page) => {
  return <TmaSdkProvider>{page}</TmaSdkProvider>;
};

export default Chat;
