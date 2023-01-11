import React from "react";

export function useKeyPress({
	targetKey,
	metaModifier = false,
	altModifier = false,
	preventBubbling = false,
}: {
	targetKey: string;
	metaModifier?: boolean;
	altModifier?: boolean;
	preventBubbling?: boolean;
}) {
	// State for keeping track of whether key is pressed
	const [keyPressed, setKeyPressed] = React.useState<boolean>(false);

	// If pressed key is our target key then set to true
	const downHandler = React.useCallback(
		(event: KeyboardEvent) => {
			if (
				event.key === targetKey &&
				metaModifier === event.metaKey &&
				altModifier === event.altKey
			) {
				if (preventBubbling) event.preventDefault();
				setKeyPressed(true);
			}
		},
		[targetKey, metaModifier, altModifier, preventBubbling]
	);

	// If released key is our target key then set to false
	const upHandler = React.useCallback(
		(event: KeyboardEvent) => {
			if (
				event.key === targetKey ||
				metaModifier === event.metaKey ||
				altModifier === event.altKey
			) {
				setKeyPressed(false);
			}
		},
		[altModifier, metaModifier, targetKey]
	);

	// Add event listeners
	React.useEffect(() => {
		window.addEventListener("keydown", downHandler);
		window.addEventListener("keyup", upHandler);
		// Remove event listeners on cleanup
		return () => {
			window.removeEventListener("keydown", downHandler);
			window.removeEventListener("keyup", upHandler);
		};
	}, [downHandler, upHandler]);

	console.log(">>> keypressed", keyPressed);

	return keyPressed;
}
