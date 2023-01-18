import React from 'react'
import { useRouter } from 'next/router'
import * as Fathom from 'fathom-client'

export function useAnalytics() {
	const router = useRouter()

	React.useEffect(() => {
		// Initialize Fathom when the app loads
		Fathom.load('KKPADALA', {
			includedDomains: ['asierzapata.com']
		})

		function onRouteChangeComplete() {
			Fathom.trackPageview()
		}
		// Record a pageview when route changes
		router.events.on('routeChangeComplete', onRouteChangeComplete)

		// Unassign event listener
		return () => {
			router.events.off('routeChangeComplete', onRouteChangeComplete)
		}
	}, [router.events])
}
