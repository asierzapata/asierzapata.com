import { transform, parse } from "@markdoc/markdoc";

export function markdown(content: string) {
	return transform(parse(content));
}
