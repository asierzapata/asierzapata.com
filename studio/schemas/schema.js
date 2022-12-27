// We import object and document schemas
import blockContent from "./blockContent";
import category from "./category";
import post from "./post";
import author from "./author";
import project from "./project";

export default [
	// The following are document types which will appear
	// in the studio.
	post,
	author,
	category,
	project,
	// When added to this list, object types can be used as
	// { type: 'typename' } in other document schemas
	blockContent,
];
