const employee = require('./employee.route')
const auth = require('./auth.route')
const criterion = require('./criterion.route')
const ranking = require('./employeeRanking.route')

module.exports = {
    employee, auth, criterion, ranking
}