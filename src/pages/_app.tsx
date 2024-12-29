import Head from "next/head";
import { GeistSans } from "geist/font/sans";
import { AppProps, type AppType } from "next/app";
import { init as initTma } from "@telegram-apps/sdk-react";
import { api } from "#/utils/api";
import "#/styles/globals.css";
import { NextPage } from "next";
import { ReactNode, ReactElement } from "react";

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

// Initialize telegram mini app only when running in browser
if (typeof window !== "undefined") {
  initTma();
}

const MyApp: AppType = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <div className={GeistSans.className}>
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
        />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      </Head>
      {getLayout(<Component {...pageProps} />)}
    </div>
  );
};

export default api.withTRPC(MyApp);
