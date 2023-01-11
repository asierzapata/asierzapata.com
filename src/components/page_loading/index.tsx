import * as React from 'react'
import { classnames } from '@/lib/classnames'
import { useRouter } from 'next/router'

const LOADING_STATES = {
	IDLE: 'idle',
	SUBMITTING: 'submitting',
	LOADING: 'loading'
} as const

function PageLoading() {
	const router = useRouter()
	const [loadingState, setLoadingState] = React.useState<
		typeof LOADING_STATES[keyof typeof LOADING_STATES]
	>(LOADING_STATES.IDLE)
	const [animationComplete, setAnimationComplete] = React.useState(true)
	const ref = React.useRef<HTMLDivElement>(null)

	const active = loadingState !== 'idle'
	React.useEffect(() => {
		if (!ref.current) return
		if (active) setAnimationComplete(false)

		Promise.allSettled(
			ref.current.getAnimations().map(({ finished }) => finished)
		).then(() => !active && setAnimationComplete(true))
	}, [active])

	const handleRouteHistoryChange = React.useCallback(() => {
		if (loadingState === 'idle') return
		setLoadingState('loading')
	}, [loadingState])

	const handleRouteChangeStart = React.useCallback(() => {
		setLoadingState('submitting')
	}, [])

	const handleRouteChangeEnded = React.useCallback(() => {
		setLoadingState('idle')
	}, [])

	React.useEffect(() => {
		router.events.on('beforeHistoryChange', handleRouteHistoryChange)
		router.events.on('routeChangeStart', handleRouteChangeStart)
		router.events.on('routeChangeComplete', handleRouteChangeEnded)
		router.events.on('routeChangeError', handleRouteChangeEnded)
		return () => {
			router.events.off('beforeHistoryChange', handleRouteHistoryChange)
			router.events.off('routeChangeStart', handleRouteChangeStart)
			router.events.off('routeChangeComplete', handleRouteChangeEnded)
			router.events.off('routeChangeError', handleRouteChangeEnded)
		}
	}, [
		handleRouteChangeEnded,
		handleRouteChangeStart,
		handleRouteHistoryChange,
		router.events
	])

	return (
		<div
			role="progressbar"
			aria-hidden={!active}
			aria-valuetext={active ? 'Loading' : undefined}
			className="fixed inset-x-0 top-0 left-0 z-50 h-1 animate-pulse"
		>
			<div
				ref={ref}
				className={classnames(
					'h-full bg-gradient-to-r from-secondary to-primary transition-all duration-500 ease-in-out',
					loadingState === 'idle' &&
						animationComplete &&
						'w-0 opacity-0 transition-none',
					loadingState === 'submitting' && 'w-4/12',
					loadingState === 'loading' && 'w-10/12',
					loadingState === 'idle' && !animationComplete && 'w-full'
				)}
			/>
		</div>
	)
}

export { PageLoading }
