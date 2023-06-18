const router = require('express').Router()
const { publicPosts, privatePosts } = require('./db/post')
const check = require('./middleware/check')

router.get('/public', (req, res) => {
	res.json(publicPosts)
})

router.get('/private', check, (req, res) => {
	res.json(privatePosts)
})

module.exports = router
