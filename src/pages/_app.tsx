import "@/styles/globals.css";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Layout from "./_layout";

export default function App({
  Component,
  pageProps,
}: AppProps<{ session: Session }>) {
  return (
    <Layout>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />;
      </SessionProvider>
    </Layout>
  );
}
