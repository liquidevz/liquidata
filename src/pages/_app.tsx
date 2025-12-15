import { NavBar } from "@/components/navbar/NavBar";
// import GeminiChatbot from "@/components/chatbot/GeminiChatbot";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { pageview } from "@/lib/gtag";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin');

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  if (isAdminRoute) {
    return <Component {...pageProps} />;
  }

  return (
    <>
      <NavBar />
      <Component {...pageProps} />
      {/* <GeminiChatbot /> */}
    </>
  );
}
