const router = require('express').Router()
const { User } = require('./db/user')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const { json } = require('express')

router.get('/', (req, res) => {
	res.send('Hello Auth World!')
})

router.post(
	'/register',
	// ２　バリデーションチェック
	body('email').isEmail(),
	body('password').isLength({ min: 6 }),
	async (req, res) => {
		const email = req.body.email
		const password = req.body.password
		// ３. エラーハンドリング
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		// ユーザー存在確認

		const user = User.find((user) => user.email === email)
		if (user) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'ユーザーはすでに存在します。' }] })
		}

		// パスワード暗号化
		let hashedPassword = await bcrypt.hashSync(password, 10)
		console.log(hashedPassword)

		// ユーザー登録
		User.push({ email: email, password: hashedPassword })

		// JWTトークン生成
		const token = await JWT.sign(
			{
				email,
			},
			'SECRET_KEY',
			{
				expiresIn: '24h',
			},
		)

		return res.json({ token: token })
	},
)

// ログイン
router.post('/login', async (req, res) => {
	const { email, password } = req.body

	const user = User.find((user) => user.email === email)

	if (!user) {
		return res
			.status(400)
			.json({ errors: [{ msg: 'ユーザーが存在しません。' }] })
	}

	// PW復号化・照合
	const isMatch = await bcrypt.compare(password, user.password)

	if (!isMatch) {
		return res
			.status(400)
			.json({ errors: [{ msg: 'パスワードが間違っています。' }] })
	}

	// JWTトークン生成
	const token = await JWT.sign(
		{
			email,
		},
		'SECRET_KEY',
		{
			expiresIn: '24h',
		},
	)
	return res.json({ token: token })
})

// ユーザー一覧取得
router.get('/users', (req, res) => {
	res.json(User)
})

module.exports = router
