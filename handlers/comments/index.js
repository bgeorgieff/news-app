const Article = require('../articles/Article')
const Comments = require('./Comments')
const Replies = require('./Replies')
const { getAllCategories } = require('../../utils/helpers')

module.exports = {
  post: {
    async createPost(req, res, next) {
      const {message} = req.body
      const {id} = req.params
      const {_id} = req.user._id
      const categories = await getAllCategories()
      const {isAdmin} = req.user || false

      // Comment validation
      if(!message) {
        Article.findById(id).lean()
        .populate('author')
        .populate('tags')
        .populate({ path: 'comments', populate: { path: 'author' }})
        .populate({ path: 'comments', populate: [
          { path: 'reply' }, 
          { path: 'reply', populate: { path: 'author' }}]}).then((article) => {


          Article.find().sort({date:-1}).lean().then((articles) => {
            const trendingArticles = [...articles]
            const recentArticle = [...articles]
            
            trendingArticles.sort((a, b) => {return b.views - a.views}).splice(4)
            recentArticle.splice(1)

            res.render('./posts/postView', {
              isLoggedIn: req.user !== undefined,
              articleTitle: article.title,
              tags: article.tags,
              meta: article.meta,
              img: article.img,
              post: article.post,
              views: article.views,
              comments: article.comments,
              trendingArticles,
              recentArticle,
              author: article.replies.author,
              postAuthor: article.author,
              date: article.date,
              isAdmin,
              id: id,
              title: article.title,
              categories,
              message: `You can't create an empty comment`
            })  
          }) 
      })
        return
      }

      Promise.all([
        Comments.create({comment: message, author: _id, article: id}),
      ]).then(() => {
        res.redirect(`/article/post/${id}`)
      }).catch(err => { console.error(err)})  
    },
    async reply(req, res, next) {
      const {message} = req.body
      const {id} = req.params
      const {_id} = req.user._id
      const {isAdmin} = req.user || false
      const categories = await getAllCategories()

      // Reply validation
      if(!message) {
        Comments.findById(id).lean().then((comment) => {
          Article.findById(comment.article)
            .populate('author')
            .populate('tags')
            .populate({ path: 'comments', populate: { path: 'author' }})
            .populate({ path: 'comments', populate: [
              { path: 'reply' }, 
              { path: 'reply', populate: { path: 'author' }}]})
            .lean()
            .then((article) => {
              Article.find().sort({date:-1}).lean().then((articles) => {
                const trendingArticles = [...articles]
                const recentArticle = [...articles]
                
                trendingArticles.sort((a, b) => {return b.views - a.views}).splice(4)
                recentArticle.splice(1)
    
                res.render('./posts/postView', {
                  isLoggedIn: req.user !== undefined,
                  articleTitle: article.title,
                  tags: article.tags,
                  meta: article.meta,
                  img: article.img,
                  post: article.post,
                  views: article.views,
                  comments: article.comments,
                  trendingArticles,
                  recentArticle,
                  author: article.replies.author,
                  postAuthor: article.author,
                  date: article.date,
                  isAdmin,
                  id: id,
                  title: article.title,
                  categories,
                  message: `You can't create an empty comment`
                })  
              }) 
            })  
      })
        return
      }

      Comments.findById({_id: id}).lean().then((comment) => {
        const articleId = comment.article
        Replies.create({comment: message, author: _id, commentId: id, article: articleId})
          .then(() => {
            res.redirect(`/article/post/${comment.article}`)
          })
      })
    },  
  },
}