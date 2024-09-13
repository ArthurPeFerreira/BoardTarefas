import "@/styles/globals.css"
import type { AppProps } from "next/app";
import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react"

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

export default function App({ Component, pageProps }: AppProps) {
  return( 
    <SessionProvider session={pageProps.session}>
      <Navbar/>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
