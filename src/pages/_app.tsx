import Head from 'next/head';
import { AppProps, type AppType } from 'next/app';
import { api } from '#/utils/api';
import { NextPage } from 'next';
import { ReactNode, ReactElement, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  initData,
  init as initTma,
  mainButton,
  postEvent,
  retrieveLaunchParams,
} from '@telegram-apps/sdk-react';
import '@telegram-apps/telegram-ui/dist/styles.css';
import { AppRoot } from '@telegram-apps/telegram-ui';
import '#/styles/globals.css';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// @ts-expect-error
BigInt.prototype.toJSON = function () {
  return this.toString();
};

// Initialize eruda (mobile debugger) in development mode when running in browser
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const initEruda = async () => {
    const { default: eruda } = await import('eruda');
    eruda.init();
  };
  initEruda();
}

const MyApp: AppType = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? (page => page);

  const router = useRouter();

  useEffect(() => {
    const enableSticky = () => {
      const lp = retrieveLaunchParams();

      // Some versions of Telegram don't need the classes above.
      if (['macos', 'tdesktop', 'weba', 'web', 'webk'].includes(lp.platform)) {
        return;
      }

      postEvent('web_app_expand');
      postEvent('web_app_request_fullscreen');

      document.body.classList.add('mobile-body');
      document.getElementById('wrap')?.classList.add('mobile-wrap');
      document.getElementById('content')?.classList.add('mobile-content');
    };

    // Initialize telegram mini app sdk
    initTma();

    // Enable sticky mode
    enableSticky();

    // Ensure initData is properly restored
    initData.restore();

    // Mount required tma components
    mainButton.mount();

    // Redirect to chat if chatInstance is present
    const lp = retrieveLaunchParams();

    const { chatInstance, user } = lp.initData ?? {};

    if (chatInstance) {
      router.push(`/chat/${chatInstance}?userId=${user?.id}`);
    }

    return () => {
      mainButton.unmount();
    };
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
      <AppRoot platform="ios" appearance="light">
        <div id="wrap">
          <div id="content">{getLayout(<Component {...pageProps} />)}</div>
        </div>
      </AppRoot>
    </>
  );
};

export default api.withTRPC(MyApp);
