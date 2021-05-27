const routes = require('../routes')

module.exports = (app) => {
	app.use('/', routes.home)   
	app.use('/user', routes.users)
	app.use('/article', routes.article)
	app.use('/post', routes.comments)
	app.use('/category', routes.categories)

	app.use(function(req, res) {
    res.status(404).end('this is not the page you are looking for');
	})
}