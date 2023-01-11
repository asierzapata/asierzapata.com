import React from "react";

import { classnames } from "@/lib/classnames";

import * as ToastPrimitive from "@radix-ui/react-toast";

import { ToastContentContext } from "./toast_content";

// Toast Actions
// -------------

type ToastActionsProps = { children: React.ReactNode };
export const ToastActions = ({ children }: ToastActionsProps) => {
	const { inline } = React.useContext(ToastContentContext);
	const toastActionsClassname = classnames(
		!inline && "mt-2",
		"flex flex-row justify-start"
	);
	return <div className={toastActionsClassname}>{children}</div>;
};

// Toast Action
// ------------

type ToastActionProps = {
	children: React.ReactNode;
	alternativeActionText: string;
};

export const ToastAction = ({
	children,
	alternativeActionText,
}: ToastActionProps) => {
	const { inline } = React.useContext(ToastContentContext);
	const toastActionClassname = classnames(inline && "ml-4", !inline && "mr-6");
	return (
		<ToastPrimitive.Action asChild altText={alternativeActionText}>
			<div className={toastActionClassname}>{children}</div>
		</ToastPrimitive.Action>
	);
};
