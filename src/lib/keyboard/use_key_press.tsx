import React from 'react'
import { every, some } from 'lodash'

export function useKeyPress({
	targetKey,
	metaModifier = false,
	altModifier = false,
	ctrlModifier = false,
	preventBubbling = false
}: {
	targetKey: string
	metaModifier?: boolean
	altModifier?: boolean
	ctrlModifier?: boolean
	preventBubbling?: boolean
}) {
	const [keyPressed, setKeyPressed] = React.useState<boolean>(false)

	const downHandler = React.useCallback(
		(event: KeyboardEvent) => {
			let keysToCheck = [event.key === targetKey]
			if (metaModifier) keysToCheck = [...keysToCheck, event.metaKey]
			if (altModifier) keysToCheck = [...keysToCheck, event.altKey]
			if (ctrlModifier) keysToCheck = [...keysToCheck, event.ctrlKey]

			if (every(keysToCheck)) {
				if (preventBubbling) event.preventDefault()
				setKeyPressed(true)
			}
		},
		[targetKey, metaModifier, altModifier, ctrlModifier, preventBubbling]
	)

	// If released key is our target key then set to false
	const upHandler = React.useCallback(
		(event: KeyboardEvent) => {
			let keysToCheck = [event.key === targetKey]
			if (metaModifier) keysToCheck = [...keysToCheck, event.metaKey]
			if (altModifier) keysToCheck = [...keysToCheck, event.altKey]
			if (ctrlModifier) keysToCheck = [...keysToCheck, event.ctrlKey]

			if (some(keysToCheck)) {
				setKeyPressed(false)
			}
		},
		[altModifier, ctrlModifier, metaModifier, targetKey]
	)

	// Add event listeners
	React.useEffect(() => {
		window.addEventListener('keydown', downHandler)
		window.addEventListener('keyup', upHandler)
		// Remove event listeners on cleanup
		return () => {
			window.removeEventListener('keydown', downHandler)
			window.removeEventListener('keyup', upHandler)
		}
	}, [downHandler, upHandler])

	return keyPressed
}
