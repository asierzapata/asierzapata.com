export const isEmpty = (obj: unknown) =>
	[Object, Array].includes(
		(obj || {}).constructor as ObjectConstructor | ArrayConstructor
	) && !Object.entries(obj || {}).length;
