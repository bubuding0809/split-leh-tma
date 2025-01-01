"use client";

import React from "react";
import TmaSdkProvider from "#/components/layouts/TmaSdkProvider";
import { NextPageWithLayout } from "#/pages/_app";
import { Title } from "@telegram-apps/telegram-ui";
import { useLaunchParams } from "@telegram-apps/sdk-react";

const Chat: NextPageWithLayout = () => {
  const tmaLaunchParams = useLaunchParams();
  const { chatInstance } = tmaLaunchParams.initData ?? {};

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <Title>{chatInstance ?? "No chat"}</Title>
    </div>
  );
};

Chat.getLayout = (page) => {
  return <TmaSdkProvider>{page}</TmaSdkProvider>;
};

export default Chat;
