import React from 'react'

type CommandPaletteContext = {
	toggleCommandPalette: () => void
}

export const CommandPaletteContext = React.createContext<CommandPaletteContext>(
	{
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		toggleCommandPalette: () => {}
	}
)

export const useCommandPaletteContext = () => {
	return React.useContext(CommandPaletteContext)
}
