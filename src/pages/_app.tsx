import Head from "next/head";
import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import { init as initTma } from "@telegram-apps/sdk-react";

import { api } from "#/utils/api";

import "#/styles/globals.css";

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

const MyApp: AppType = ({ Component, pageProps }) => {
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
      <Component {...pageProps} />
    </div>
  );
};

export default api.withTRPC(MyApp);
