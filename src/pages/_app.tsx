import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import PlausibleProvider from "next-plausible";

import { trpc } from "@/utils/trpc";

import "@/styles/globals.css";
import Head from "next/head";
import { PageLoading } from "@/components/page_loading";
import { PageNavigation } from "@/components/page_navigation";

const MyApp: AppType<{ session: Session | null }> = ({
	Component,
	pageProps: { session, ...pageProps },
}) => {
	return (
		<>
			<Head>
				<title>Asier Zapata</title>
				<meta name="description" content="Personal page of Asier Zapata" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<PlausibleProvider domain="asierzapata.com">
				<SessionProvider session={session}>
					<PageLoading />
					<PageNavigation />
					<Component {...pageProps} />
				</SessionProvider>
			</PlausibleProvider>
		</>
	);
};

export default trpc.withTRPC(MyApp);
