const routes = require('../routes')

module.exports = (app) => {
	app.use('/home', routes.home)
	app.use('/', routes.home)   
	app.use('/', routes.users)
	app.use('/createArticle', routes.article)

	app.use('*', () => {
		console.log('this is not the webpage you are looking for')
	})
}