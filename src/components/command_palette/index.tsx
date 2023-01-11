import React from "react";

/* ====================================================== */
/*                       Components                      */
/* ====================================================== */

import { Command } from "cmdk";
import { PostsSearch } from "@/components/command_palette/posts_search";
import { GeneralSearch } from "@/components/command_palette/general_search";
import { useKeyPress } from "@/lib/keyboard/use_key_press";

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const UI_STATES = {
	GENERAL_SEARCH: "generalSearch",
	POST_SEARCH: "postSearch",
} as const;

const CommandPalette = () => {
	const [isOpen, setIsOpen] = React.useState(false);
	const [uiState, setUiState] =
		React.useState<typeof UI_STATES[keyof typeof UI_STATES]>("generalSearch");

	// Toggle the menu when ⌘K is pressed
	const isOpenKeyCombinationPressed = useKeyPress({
		targetKey: "k",
		metaModifier: true,
		preventBubbling: true,
	});
	React.useEffect(() => {
		if (isOpenKeyCombinationPressed) setIsOpen((_isOpen) => !_isOpen);
	}, [isOpenKeyCombinationPressed]);

	const handleCloseCommandPalette = React.useCallback(() => {
		setIsOpen(false);
	}, []);

	const handleSearchPosts = React.useCallback(() => {
		setUiState("postSearch");
	}, []);

	return (
		<Command.Dialog
			open={isOpen}
			onOpenChange={setIsOpen}
			label="Command Palette"
			shouldFilter={uiState !== "postSearch"}
			onKeyDown={(e) => {
				// TODO: Separate this correctly and create a state machine
				if (e.key === "Escape") {
					e.preventDefault();
					if (uiState === "generalSearch") handleCloseCommandPalette();
					if (uiState === "postSearch") setUiState("generalSearch");
				}
			}}
		>
			{uiState === "generalSearch" ? (
				<GeneralSearch
					onCloseCommandPalette={handleCloseCommandPalette}
					onSearchPosts={handleSearchPosts}
				/>
			) : null}
			{uiState === "postSearch" ? (
				<PostsSearch onCloseCommandPalette={handleCloseCommandPalette} />
			) : null}
		</Command.Dialog>
	);
};

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { CommandPalette };
