const jwt = require('jsonwebtoken')
const { User } = require('../models')
require('dotenv').config()

//Verifikasi token
module.exports = async function(req, res, next){
    // const authHeader = req.header('token')

    var token = req.headers.authorization

    // const authHeader = req.header['Authorization']
    // const token = authHeader && authHeader.split(' ')[1]

    if(token == null) {
        return res.status(401).send('Access Denied')
    }else{
        try{
            // const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

            const verified = jwt.verify(token.replace(/^Bearer\s/, ''), process.env.ACCESS_TOKEN_SECRET)
            
            const user = await User.findOne({where: { username: verified.username}})
            
            const validator = token.replace(/^Bearer\s/, '')

            if(user.api_token != validator)
            {
                res.status(400).send('Token has been expired')
            }else {
                req.user = verified
                next()
            }
        }catch(err){
            res.status(400).send('Invalid Token')
        }
    }
}
