import Head from "next/head";

import { api } from "#/utils/api";

import {
  backButton,
  mainButton,
  isBackButtonVisible,
  initData,
  secondaryButton,
  retrieveLaunchParams,
  postEvent,
} from "@telegram-apps/sdk-react";
import { useEffect } from "react";

import "#/styles/globals.css";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

  useEffect(() => {
    backButton.mount();
    mainButton.mount();
    initData.restore();
    secondaryButton.mount();
  }, []);

  const enableSticky = () => {
    const lp = retrieveLaunchParams();

    // Some versions of Telegram don't need the classes above.
    if (["macos", "tdesktop", "weba", "web", "webk"].includes(lp.platform)) {
      return;
    }

    // Expand the application.
    postEvent("web_app_expand");

    document.body.classList.add("mobile-body");
    document.getElementById("wrap")?.classList.add("mobile-wrap");
    document.getElementById("content")?.classList.add("mobile-content");
  };

  useEffect(() => {
    enableSticky();
  }, []);

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
      <div id="wrap">
        <div id="content">
          <main className="flex min-h-screen flex-col items-center justify-center bg-white">
            <h1 className="py-10 text-xl font-bold">🤑 Split Leh</h1>
            <div className="mt-2 rounded-md border bg-white p-2 font-medium">
              <span>🚧 Under Construction</span>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
