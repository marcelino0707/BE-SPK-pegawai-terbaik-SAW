const auth = require('../controllers/auth.controller')
const express = require('express')
const route = express()

route.post('/login', auth.login)
route.post('/logout', auth.logout)
route.post('/forgetPassword', auth.forgetPassword)
route.put('/resetPassword', auth.resetPassword)
route.get('/getUser', auth.getUser)

module.exports = route