import React, { type ReactElement } from "react";

/* ====================================================== */
/*                       Components                      */
/* ====================================================== */

import { renderers } from "@markdoc/markdoc";
import { markdown } from "~/services/markdown/markdown";

/* ====================================================== */
/*                    Implementation                     */
/* ====================================================== */

type Props = { content: string };

function Markdown({ content }: Props) {
	return (
		<span className="markdown">
			{renderers.react(markdown(content), React, {})}
		</span>
	);
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { Markdown, links };
