const routes = require('../routes')

module.exports = (app) => {
	app.use('/', routes.home)   
	app.use('/user', routes.users)
	app.use('/createArticle', routes.article)
	app.use('/viewArticle', routes.article)

	app.use('*', () => {
		console.log('this is not the webpage you are looking for')
	})
}