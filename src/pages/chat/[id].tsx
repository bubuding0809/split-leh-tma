"use client";

import React from "react";
import TmaSdkProvider from "#/components/layouts/TmaSdkProvider";
import { NextPageWithLayout } from "#/pages/_app";
import { Title } from "@telegram-apps/telegram-ui";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import useStartParams from "#/lib/hooks/tma/useStartParams";

const Chat: NextPageWithLayout = () => {
  const startParams = useStartParams() ?? {};

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <Title>{startParams?.chat_id ?? "No chat"}</Title>
      <pre>{JSON.stringify(startParams, null, 2)}</pre>
    </div>
  );
};

Chat.getLayout = (page) => {
  return <TmaSdkProvider>{page}</TmaSdkProvider>;
};

export default Chat;
