import React from 'react'

/* ====================================================== */
/*                       Components                      */
/* ====================================================== */

import { Command } from 'cmdk'
import { PostsSearch } from '@/components/command_palette/posts_search'
import { GeneralSearch } from '@/components/command_palette/general_search'
import { useKeyPress } from '@/lib/keyboard/use_key_press'
import { CommandPaletteContext } from '@/components/command_palette/command_palette_context'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const UI_STATES = {
	GENERAL_SEARCH: 'generalSearch',
	POST_SEARCH: 'postSearch'
} as const

const CommandPalette = ({ children }: { children: React.ReactNode }) => {
	const [isOpen, setIsOpen] = React.useState(false)
	const [uiState, setUiState] =
		React.useState<typeof UI_STATES[keyof typeof UI_STATES]>('generalSearch')

	const targetKey = 'k'

	// For toggling the command palette the combination will be Ctrl + K
	const isOpenKeyCombinationPressed = useKeyPress({
		targetKey,
		ctrlModifier: true,
		preventBubbling: true
	})
	React.useEffect(() => {
		if (isOpenKeyCombinationPressed) setIsOpen(_isOpen => !_isOpen)
	}, [isOpenKeyCombinationPressed])

	const handleCloseCommandPalette = React.useCallback(() => {
		setIsOpen(false)
	}, [])

	const handleSearchPosts = React.useCallback(() => {
		setUiState('postSearch')
	}, [])

	const handleToggleCommandPalette = React.useCallback(() => {
		setIsOpen(_isOpen => !_isOpen)
	}, [])

	const commandPaletteContextValue = React.useMemo(() => {
		return {
			toggleCommandPalette: handleToggleCommandPalette
		}
	}, [handleToggleCommandPalette])

	return (
		<CommandPaletteContext.Provider value={commandPaletteContextValue}>
			<Command.Dialog
				open={isOpen}
				onOpenChange={setIsOpen}
				label="Command Palette"
				shouldFilter={uiState !== 'postSearch'}
				onKeyDown={e => {
					// TODO: Separate this correctly and create a state machine
					if (e.key === 'Escape') {
						e.preventDefault()
						if (uiState === 'generalSearch') handleCloseCommandPalette()
						if (uiState === 'postSearch') setUiState('generalSearch')
					}
				}}
			>
				{uiState === 'generalSearch' ? (
					<GeneralSearch
						onCloseCommandPalette={handleCloseCommandPalette}
						onSearchPosts={handleSearchPosts}
					/>
				) : null}
				{uiState === 'postSearch' ? (
					<PostsSearch onCloseCommandPalette={handleCloseCommandPalette} />
				) : null}
			</Command.Dialog>
			{children}
		</CommandPaletteContext.Provider>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { CommandPalette }
