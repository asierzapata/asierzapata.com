import { type AppType } from 'next/app'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

import { api } from '@/utils/api'

import '@/styles/globals.css'
import Head from 'next/head'
import { PageLoading } from '@/components/page_loading'
import { PageNavigation } from '@/components/page_navigation'
import { CommandPalette } from '@/components/command_palette'
import { useAnalytics } from '@/lib/analytics'

const MyApp: AppType<{ session: Session | null }> = ({
	Component,
	pageProps: { session, ...pageProps }
}) => {
	useAnalytics()
	return (
		<>
			<Head>
				<title>Asier Zapata</title>
				<meta name="description" content="Personal page of Asier Zapata" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<SessionProvider session={session}>
				<CommandPalette>
					<PageLoading />
					<PageNavigation>
						<Component {...pageProps} />
					</PageNavigation>
				</CommandPalette>
			</SessionProvider>
		</>
	)
}

export default api.withTRPC(MyApp)
