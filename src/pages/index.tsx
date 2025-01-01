import Head from "next/head";
import { NextPageWithLayout } from "#/pages/_app";
import TmaSdkProvider from "#/components/layouts/TmaSdkProvider";
import useStartParams from "#/lib/hooks/tma/useStartParams";
import { Placeholder, Text, Title } from "@telegram-apps/telegram-ui";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLaunchParams } from "@telegram-apps/sdk-react";

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>SplitLeh</title>
        <meta
          name="description"
          content="🤑 Split expenses with your friends"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤑</text></svg>"
        />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-center gap-y-4">
        <Title weight="1">🤑 Split Leh</Title>
        <div className="flex flex-col items-center justify-center gap-4">
          <Text weight="2"></Text>
          <Placeholder
            description="Watch this space!"
            header="🚧 Under Construction"
          >
            <img
              alt="Telegram sticker"
              className="blt0jZBzpxuR4oDhJc8s"
              src="https://xelene.me/telegram.gif"
            />
          </Placeholder>
        </div>
      </main>
    </>
  );
};

Home.getLayout = (page) => {
  return <TmaSdkProvider>{page}</TmaSdkProvider>;
};

export default Home;
