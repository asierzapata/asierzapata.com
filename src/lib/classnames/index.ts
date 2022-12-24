/**
 * Thanks to https://dev.to/gugaguichard/replace-clsx-classnames-or-classcat-with-your-own-little-helper-3bf
 */

type Classnames = (...a: Array<undefined | null | string | boolean>) => string;

export const classnames: Classnames = (...args) =>
	args
		.flat()
		.filter((x) => x !== null && x !== undefined && typeof x !== "boolean")
		.join(" ");
