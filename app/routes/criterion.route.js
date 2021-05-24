const criterion = require('../controllers/criterion.controller')
const express = require('express')
const route = express()
const verifyToken = require('./verifyToken')

route.get('/', verifyToken, criterion.criterionGetAll)
route.get('/:id', verifyToken, criterion.criterionFindOne)
route.put('/:id', verifyToken, criterion.criterionUpdate)

module.exports = route