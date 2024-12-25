import Head from "next/head";
import Link from "next/link";

import { api } from "#/utils/api";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

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
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">🤑 SplitLeh</h1>
        <p className="mt-10 text-xl font-bold">&#123;FIX ME&#125;</p>
      </main>
    </>
  );
}
