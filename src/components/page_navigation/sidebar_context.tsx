import React from "react";

type SidebarContext = {
	toggleSidebar: () => void;
};

export const SidebarContext = React.createContext<SidebarContext>({
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	toggleSidebar: () => {},
});
