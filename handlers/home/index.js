const Articles = require('../articles/Article')

module.exports = {
  get: {
    home(req, res, next) {
      const removeString = /<[^>]*>/gm
      const context = {post:''}

      Articles.find().lean().then((article) => {
        // article.forEach(e => {
        //   return context.post = [e.post.replace(removeString, "").substring(0, 250)]
        // })
        // console.log(context);
        res.render('home', {
          isLoggedIn: req.user !== undefined,
          article,
          // article: {
          //   post: context
          // },
        })
      })
    }
  },
  post: {

  }
}