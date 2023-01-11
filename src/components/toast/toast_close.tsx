import React from "react";
import PropTypes from "prop-types";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { Cross2Icon } from "@radix-ui/react-icons";

type ToastCloseProps = {
	onClose: () => void;
};

export const ToastClose = ({ onClose }: ToastCloseProps) => {
	return (
		<ToastPrimitive.Close asChild>
			<button
				className="font-sm pointer ml-6"
				aria-label="Close"
				onClick={onClose}
			>
				<Cross2Icon />
			</button>
		</ToastPrimitive.Close>
	);
};

ToastClose.propTypes = {
	onClose: PropTypes.func.isRequired,
};
