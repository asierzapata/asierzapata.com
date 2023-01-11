import React from "react";

function GradientBorder({ children }: { children: React.ReactNode }) {
	return (
		<div className="rounded bg-gradient-to-br from-primary via-darkPrimary to-secondary transition duration-300 hover:from-secondary hover:to-primary">
			<div className="group h-full rounded p-0.5">{children}</div>
		</div>
	);
}

export { GradientBorder };
