import React from 'react'
import { classnames } from '@/lib/classnames'

type ToastContentProps = {
	children: React.ReactNode
	inline?: boolean
}

export const ToastContentContext = React.createContext<{ inline: boolean }>({
	inline: false
})
export const ToastContent = ({
	children,
	inline = false
}: ToastContentProps) => {
	const toastContentContextValue = React.useMemo(() => ({ inline }), [inline])
	const toastContentClassname = classnames(
		'flex flex-grow-1',
		inline && 'row',
		!inline && 'column'
	)
	return (
		<ToastContentContext.Provider value={toastContentContextValue}>
			<div className={toastContentClassname}>{children}</div>
		</ToastContentContext.Provider>
	)
}
