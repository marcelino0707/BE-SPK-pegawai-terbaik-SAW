const employee = require('../controllers/employee.controller')
const express = require('express')
const route = express()
const verifyToken = require('./verifyToken')

route.get('/', verifyToken, employee.employeeGetAll)
route.post('/', verifyToken, employee.employeePost)
route.get('/:id', verifyToken, employee.employeeFindOne)
route.delete('/:id', verifyToken, employee.employeeDelete)
route.put('/:id', verifyToken, employee.employeeUpdate)


module.exports = route

