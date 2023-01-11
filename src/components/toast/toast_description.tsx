import React from 'react'

import * as ToastPrimitive from '@radix-ui/react-toast'

type ToastDescriptionProps = {
	children: React.ReactNode
}

export const ToastDescription = ({ children }: ToastDescriptionProps) => {
	return (
		<ToastPrimitive.Description asChild>{children}</ToastPrimitive.Description>
	)
}
