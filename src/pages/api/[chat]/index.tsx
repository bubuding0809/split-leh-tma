import React from "react";
import TmaSdkProvider from "#/components/layouts/TmaSdkProvider";
import { NextPageWithLayout } from "#/pages/_app";
import { GetServerSideProps } from "next";
import { useParams } from "next/navigation";

const Chat: NextPageWithLayout = () => {
  return <div>index</div>;
};

Chat.getLayout = (page) => {
  return <TmaSdkProvider>{page}</TmaSdkProvider>;
};

export default Chat;
