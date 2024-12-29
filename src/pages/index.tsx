"use client";

import Head from "next/head";
import { NextPageWithLayout } from "#/pages/_app";
import {
  backButton,
  mainButton,
  initData,
  secondaryButton,
  retrieveLaunchParams,
  postEvent,
  viewport,
  isFullscreen,
  requestFullscreen,
  exitFullscreen,
  useSignal,
} from "@telegram-apps/sdk-react";
import { useEffect } from "react";
import TmaSdkProvider from "#/components/layouts/TmaSsrLoader";

const Home: NextPageWithLayout = () => {
  useEffect(() => {
    initData.restore();
    backButton.mount();
    mainButton.mount();
    secondaryButton.mount();
    viewport.mount();

    return () => {
      backButton.unmount();
      mainButton.unmount();
      secondaryButton.unmount();
      viewport.unmount();
    };
  }, []);

  const isTmaFullScreen = useSignal(viewport.isFullscreen);

  const enableSticky = () => {
    const lp = retrieveLaunchParams();

    // Some versions of Telegram don't need the classes above.
    if (["macos", "tdesktop", "weba", "web", "webk"].includes(lp.platform)) {
      return;
    }

    postEvent("web_app_expand");
    postEvent("web_app_request_fullscreen");

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
            <div className="flex flex-col gap-4">
              <div className="mt-2 rounded-md border bg-white p-2 font-medium shadow-md">
                <span>🚧 Under Construction</span>
              </div>
              <div className="mt-2 rounded-md border bg-white p-2 font-medium shadow-md">
                <button
                  onClick={() =>
                    isTmaFullScreen
                      ? viewport.exitFullscreen()
                      : viewport.requestFullscreen()
                  }
                >
                  {isTmaFullScreen ? "full" : "not-full"}
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

Home.getLayout = (page) => {
  return <TmaSdkProvider>{page}</TmaSdkProvider>;
};

export default Home;
