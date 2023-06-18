const express = require('express')
const app = express()

const PORT = 8000
const auth = require('./auth')
const post = require('./post')

app.use(express.json())
app.use('/auth', auth)
app.use('/post', post)

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
