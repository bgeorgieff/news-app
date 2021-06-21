const Article = require('./Article')
const { getCategories } = require('../categories')
const Categories = require('../categories/Categories')
const { getAllCategories, getCurrentCategory, getRobotsString } = require('../../utils/helpers')
const PostCategories = require('../postCategory/postCategory')
const { validationResult } = require('express-validator')

module.exports = {
  get: {
    async postArticle(req, res, next) {
      const categories = await getCategories()
      const postCategory = await getAllCategories()

      res.render('./posts/post-add', {
        isLoggedIn: req.user !== undefined,
        categories,
        postCategory,
        title: 'Create Article'
      })
    }, 
    searchResult(req, res, next) {
      const {searchText} = req.query

      Article.find().lean().then((article) => {
        const articles = article.filter((e) => {
          return e.title.toLowerCase().includes(searchText.toLowerCase())
        })

        res.render('./posts/searchResult', {
          isLoggedIn: req.user !== undefined,
          articles
        })
      })

    },
    viewAll(req, res, next) {
      Article.find().populate('postCategory').sort({date: -1}).lean().then((articles) => {
        const trendingArticles = [...articles]
        const recentArticle = [...articles]

        trendingArticles.sort((a, b) => {return b.views - a.views}).splice(4)
        recentArticle.splice(1)

        res.render('./posts/posts', {
          isLoggedIn: req.user !== undefined,
          articles,
          trendingArticles,
          recentArticle,
        })
      })
    },
    async viewArticle(req, res, next) {
      const { id } = req.params
      const categories = await getAllCategories()

      Article.findById(id).lean()
        .populate('author')
        .populate('tags')
        .populate({ path: 'comments', populate: { path: 'author' }})
        .populate({ path: 'comments', populate: [
          { path: 'reply' }, 
          { path: 'reply', populate: { path: 'author' }}
        ]}).then((article) => {

        const views = article.views + 1
        const {isAdmin} = req.user || false

        Article.findByIdAndUpdate(id, { views: views }).then(() => {
          Article.find().sort({date:-1}).lean().then((articles) => {
            const trendingArticles = [...articles]
            const recentArticle = [...articles]
            
            trendingArticles.sort((a, b) => {return b.views - a.views}).splice(4)
            recentArticle.splice(1)

            res.render('./posts/postView', {
              isLoggedIn: req.user !== undefined,
              articleTitle: article.title,
              postImg: article.postImg,
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
              categories
            })  
          }) 
        })
      })
    },
    async editArticleView(req, res, next) {
      const { id } = req.params

      const allCategories = await getCategories()
      const postCategories = await getAllCategories()

      Article.findById(id).lean()
      .populate('tags')
      .populate('postCategory')
      .then((article) => {
        
        // Filter unassigned categories for edit menu
        const assignedCategoryId = article.postCategory._id.valueOf().toString()

        const unassignedCategories = postCategories.filter((category) => {
          const postCategoryId = category._id.valueOf().toString()
          return !assignedCategoryId.includes(postCategoryId)
        })

        // Filter unassigned tags for edit menu 
        let assignedTagId
        if (article.tags) {
          assignedTagId = article.tags.map((e) => e._id.valueOf().toString())
        } else {
          assignedTagId = []
        }

        const unassignedTags = allCategories.filter((tag) => {
          const tagId = tag._id.valueOf().toString()
          return !assignedTagId.includes(tagId)
        })

        // Extract the content from the saved meta tag
        const metaContent = article.meta.replace(/^<meta +name="description" +content="([^"]+)" *\/>$/gm, '$1')

        res.render('./posts/editArticle', {
          isLoggedIn: req.user !== undefined,
          title: article.title,
          meta: metaContent,
          img: article.postImg,
          post: article.post,
          author: article.author.username,
          id: id,
          postCategories: unassignedCategories,
          categories: article.tags,
          allCategories: unassignedTags,
          textSnippet: article.textSnippet,
          category: article.postCategory.postCategory,
          excerpt: article.textSnippet
        })
      })
    }
  }, 
  post: {
    async postArticle(req, res, next) {
      const {
        title,
        post, 
        postMetaDescription,
        postCategory,
        indexFollow,
        postImg,
        noindexFollow,
        noindexNofollow,
        indexNofollow,
        addCategory,
        excerpt
      } = req.body

      const _id = req.user
      const date = new Date()
      const currentCategory = await getCurrentCategory(postCategory)
      
      // Meta Robots String
      const robots = getRobotsString(noindexFollow, noindexNofollow, indexFollow, indexNofollow)

      const errors = validationResult(req)

      const categories = await getCategories()
      const postSection = await getAllCategories()

      if(!errors.isEmpty()) {
        res.render('./posts/post-add', {
          message: errors.array()[0].msg,
          isLoggedIn: req.user !== undefined,
          categories,
          postCategory: postSection,
          title: 'Create Article'
        })
        return
      }

      const meta = `<meta name="description" content="${postMetaDescription}"/>`
      
      Article
      .create({ 
        date, title, postImg, post, meta, robots: robots, author: _id, textSnippet: excerpt, 
        views: 0, tags: addCategory, postCategory: currentCategory._id,})
      .then(() => { res.redirect('/home') 
      }).catch((err) => {
        console.log(err);
      })
    },
    addCategory(req, res, next) {
      const { newCategory } = req.body

      Categories.create({ name: newCategory }).then(() => res.redirect('/article/create'))
    }
  },
  put: {
    async editArticle(req, res, next) {
      const { id } = req.params
      const {
        title,
        post, 
        postMetaDescription,
        postImg,
        tagsCategory,
        excerpt,
        postCategory
      } = req.body

      const metaStr = `<meta name="description" content="${postMetaDescription}"/>`
      const tags = await getCategories()
      const postCategoryId = await getCurrentCategory(postCategory)
      const allCategory = await getAllCategories()
    
      Article.findById({ _id: id }).populate('tags').lean().then((article) => {

        // Filter unused Tags
        const filteredTags = tags.filter((e) => {
          const tagId = e._id.valueOf().toString()
          return !tagsCategory.includes(tagId)
        })

        // Filter unused Category
        const filteredCategories = allCategory.filter((e) => {
          const categoryId = e._id.valueOf().toString()
          return !categoryId.includes(postCategoryId._id.valueOf().toString())
        })
        
        // Validations
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
          res.render(`./posts/editArticle`, {
            message: errors.array()[0].msg,
            isLoggedIn: req.user !== undefined,
            categories: article.tags,
            allCategories: filteredTags,
            postCategory,
            title,
            img: postImg,
            post,
            meta: postMetaDescription,
            excerpt,
            id: article._id,
            category: postCategoryId.postCategory
          })
          return
        }

        Promise.all([
          // Update Tags
          Categories.updateMany({_id: tagsCategory}, {$addToSet: {article: article._id}}),
          Categories.updateMany({_id: filteredTags}, {$pull: {article: article._id}}),
          // Update Categories
          PostCategories.findByIdAndUpdate({ _id: postCategoryId._id }, {$addToSet: { articles: article._id }}),
          PostCategories.updateMany({ _id: filteredCategories }, {$pull: { articles: article._id}}),
          // Update Article
          Article.updateOne({_id: article._id}, 
            {$set: {title, post, meta: metaStr, textSnippet: excerpt, postImg,
                    tags: tagsCategory, postCategory: postCategoryId}})
        ])
        .then(() => {
            res.redirect('/home')
        })
        .catch((err) => {
          console.error(err)
        })

      })   
    }
  },
  delete: {
    deleteArticle(req, res, next) {
      const { id } = req.params

      Article.deleteOne({ _id: id}).then(() => {
        res.redirect('/home')
      })
    }
  }
}