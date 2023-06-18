const JWT = require('jsonwebtoken')

module.exports = async (req, res, next) => {
	// JWTを持っているか確認・リクエストヘッダの中のx-auth-tokenを確認
	const token = req.header('x-auth-token')

	if (!token) {
		res.status([{ message: '権限ありません' }])
	} else {
		// JWTトークンを検証
		try {
			let user = await JWT.verify(token, 'SECRET_KEY')
			console.log(user)
			req.user = user.email
			next()
		} catch (err) {
			res.json([{ message: 'トークン一致しません' }])
		}
	}
}
