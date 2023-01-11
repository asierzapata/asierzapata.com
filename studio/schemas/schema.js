// We import object and document schemas
import postType from './postType'
import post from './post'
import author from './author'
import project from './project'
import stackApp from './stackApp'
import stackGear from './stackGear'

export default [
	// The following are document types which will appear
	// in the studio.
	post,
	author,
	postType,
	project,
	stackApp,
	stackGear
]
