const ranking = require('../controllers/employeeRanking.controller')
const express = require('express')
const route = express()
const verifyToken = require('./verifyToken')

route.get('/', verifyToken, ranking.rankingGetAll)
route.post('/', verifyToken, ranking.rankingPost)
route.get('/all', verifyToken, ranking.exportAll)
route.get('/:id', verifyToken, ranking.rankingEmployee)

module.exports = route