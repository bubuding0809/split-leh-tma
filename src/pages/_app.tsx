import Head from "next/head";
import { AppProps, type AppType } from "next/app";
import {
  init as initTma,
  postEvent,
  retrieveLaunchParams,
  useLaunchParams,
} from "@telegram-apps/sdk-react";
import { api } from "#/utils/api";
import { NextPage } from "next";
import { ReactNode, ReactElement, useEffect } from "react";
import { AppRoot } from "@telegram-apps/telegram-ui";

import "@telegram-apps/telegram-ui/dist/styles.css";
import "#/styles/globals.css";
import { useRouter } from "next/router";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// Initialize eruda (mobile debugger) in development mode when running in browser
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const initEruda = async () => {
    const { default: eruda } = await import("eruda");
    eruda.init();
  };
  initEruda();
}

const MyApp: AppType = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  const router = useRouter();

  useEffect(() => {
    const lp = retrieveLaunchParams();

    const { chatInstance } = lp.initData ?? {};

    if (chatInstance) {
      router.push(`/chat/${chatInstance}`);
    }
  }, []);

  useEffect(() => {
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

    enableSticky();
  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
        />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      </Head>
      <div id="wrap">
        <div id="content">
          <AppRoot>{getLayout(<Component {...pageProps} />)}</AppRoot>
        </div>
      </div>
    </>
  );
};

export default api.withTRPC(MyApp);
