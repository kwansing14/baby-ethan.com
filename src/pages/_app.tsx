import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { api } from "../utils/api";
import { Sofia_Sans } from "next/font/google";

import "../styles/globals.css";

const sofiaSans = Sofia_Sans({
  subsets: ["latin"],
  variable: "--font-sofia-sans",
});


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <main className={`${sofiaSans.variable} font-sans`}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
        <Toaster />
      </SessionProvider>
    </main>
  );
};

export default api.withTRPC(MyApp);
