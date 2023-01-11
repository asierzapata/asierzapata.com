import React from 'react'
import { createPortal } from 'react-dom'

/* ====================================================== */
/*                     Implementation                     */
/* ====================================================== */

import * as ToastPrimitive from '@radix-ui/react-toast'

import { ToastActions, ToastAction } from './toast_actions'
import { ToastClose } from './toast_close'
import { ToastContent } from './toast_content'
import { ToastDescription } from './toast_description'
import { GradientBorder } from '@/components/gradient_border'

/* ====================================================== */
/*                     Implementation                     */
/* ====================================================== */

const TOAST_ACCESSIBILITY_TYPE = {
	FOREGROUND: 'foreground',
	BACKGROUND: 'background'
} as const

type ToastProps = {
	children: React.ReactNode
	duration?: number
	accessibilityType?: typeof TOAST_ACCESSIBILITY_TYPE[keyof typeof TOAST_ACCESSIBILITY_TYPE]
	portal?: boolean
	onOpenChange?: (open: boolean) => void
}

const Toast = ({
	children,
	duration,
	accessibilityType,
	portal = false,
	onOpenChange = () => {
		return
	}
}: ToastProps) => {
	return (
		<ToastPrimitive.Provider duration={duration}>
			<ToastPrimitive.Root
				type={accessibilityType}
				asChild
				onOpenChange={onOpenChange}
			>
				<GradientBorder>
					<div className="flex h-full w-full flex-row items-start rounded bg-background py-5 px-6 text-text backdrop-blur-lg">
						{children}
					</div>
				</GradientBorder>
			</ToastPrimitive.Root>
			{portal &&
				createPortal(
					<ToastPrimitive.Viewport asChild>
						<div className="absolute bottom-4 right-4" />
					</ToastPrimitive.Viewport>,
					document.body
				)}
			{!portal && <ToastPrimitive.Viewport />}
		</ToastPrimitive.Provider>
	)
}

/* ====================================================== */
/*                       Public API                       */
/* ====================================================== */

Toast.Actions = ToastActions
Toast.Action = ToastAction
Toast.Close = ToastClose
Toast.Content = ToastContent
Toast.Description = ToastDescription

export { Toast }
