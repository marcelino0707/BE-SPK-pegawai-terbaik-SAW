const { User } = require('../models')
const bycrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const _ = require('lodash')

//Mailgun
const mailgun = require("mailgun-js");
const e = require('express')
const verifyToken = require('../routes/verifyToken')
const { options } = require('../routes/employee.route')
const DOMAIN = 'sandbox9c32125093c346c1815b282b6e9fb90d.mailgun.org';
const mg = mailgun({apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN});

//logIn
const login = async(req,res)=> {
    const {username, password} = req.body

    try{
        if(_.isEmpty(username)){
            return res.status (404).json({username : 'Username field is empty'})
        }
        else
        {
            const data = await User.findOne({where: { username : username }})
            if(data === null){
               return res.status(404).json({error : 'User Not Found'})
            } 
            else{
                if(_.isEmpty(password)){
                    return res.status(404).json({password : 'Password field is empty'})
                }
                else{
                    if(await bycrypt.compare(password, data.password)){
                        const token = jwt.sign({ username, password }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '60m'})
                        
                        data.api_token = token
                        await data.save()

                        // return res.cookie('token', token, { httpOnly: true}).header('token', token).json({token: token})
                        return res.header('token', token).json({token: token})
                        
                    }else{
                        return res.status(404).json({error : 'Invalid Password'})
                    }
                }
            }
        }
    } catch(err){ 
        return res.json(err)
    }
}

//logOut
const logout = async(req,res)=> {
    try{
        // console.log(req.headers.authorization)
        var token = req.headers.authorization

        if(token == null) {
            return res.status(401).json({message : 'Token is empty'})
        }else{
            const data =  jwt.verify(token.replace(/^Bearer\s/, ''), process.env.ACCESS_TOKEN_SECRET)
            const user = await User.findOne({where: { username: data.username}})

            user.api_token = null
            await user.save()

            return res.status(200).json({ message : 'Logout Success'})
        }

        // return res.cookie('jwt', '',{ maxAge : 1}).status(200).json({ message : 'Logout Success'})
    }catch(err){
        return res.status(404).json({error : 'Logout failed'})
    }
}

//Forget Password Link
const forgetPassword = async(req,res) => {
    const {email} = req.body
    try{
        const user = await User.findOne({where: { email: email}})
        if(user === null){
           return res.status(404).json({error : 'User with this email does not exists'})
        } 
        else{
            const token = jwt.sign({email}, process.env.RESET_PASSWORD_KEY, {expiresIn: '15m'})
            const data = {
                from: 'laravelproject12345@gmail.com',
                to: email,
                subject: 'Forget password link',
                html: `
                    <h2>Please click on given link to reset your passsword</h2>
                    <a href="${process.env.CLIENT_URL}/api/auth/forgetPassword/${token}">${process.env.CLIENT_URL}/api/auth/forgetPassword/${token}</a>
                `
            } 
            user.resetLink = token
            await user.save()
            
            //Send messages to email
            mg.messages().send(data, function (error, body) {
                 if(error){
                    return res.json({
                        error: "err.message"
                    })
                }
                return res.json({message: 'Email has been sent, kindly follow the instructions'})
            })
        }
    } catch(err){ 
        return res.json(err)
    }
}

//Reset Password
const resetPassword = async(req,res) => {
    const {newPassword} = req.body
    const token = req.header('token')
    try{
        if(token == null) {
            return res.status(401).json({error: "Authentication requires a token"})
        } else{
            jwt.verify(token, process.env.RESET_PASSWORD_KEY)

            const user = await User.findOne({where: { resetLink: token}})
            if(user == null){
                return res.status(404).json({error : 'User with this token does not exists'})
            } 
            else{
                if(_.isEmpty(newPassword)){
                    return res.status(401).json({error: "A new password is required"})
                }else{
                    const hashedPassword = await bycrypt.hash(newPassword, 10)
                    user.password = hashedPassword
                    await user.save()
                    return res.status(200).json({message: "Password has been changed"})
                }
            }
        }
    }catch (err){
        return res.status(500).json(err)
    }
}

//Fetch LoggedIn User
const getUser = async (req, res) => {

    // // test
    // const test =  req.user
    // return res.status(200).json(test)

    // // cara 1
    // const accessToken = req.headers('token')
    var token = req.headers.authorization
    if(token == null) {
        return res.status(401).json({message : 'Token is empty'})
    }else{
        try{
            const data =  jwt.verify(token.replace(/^Bearer\s/, ''), process.env.ACCESS_TOKEN_SECRET)
            const user = await User.findOne({where: { username: data.username}, attributes: { exclude: ['password','resetLink','created_at','updated_at','deleted_at'] }})
            return res.status(200).json({user : {'id' : user.id, 'email' : user.email, 'username': data.username, 'api_token': user.api_token,'iat' : data.iat, 'exp' : data.exp}})
        }catch(err) {
            return res.status(400).json({message : 'Invalid Token'})
        }
    }

    // cara 2
    // var token = req.headers.authorization
    // if (token) {
    //     // verifies secret and checks if the token is expired
    //     jwt.verify(token.replace(/^Bearer\s/, ''), process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
    //     if (err) {
    //         return res.status(401).json({message: 'Unauthorized'})
    //     } else {
    //         return res.json({ user: decoded })
    //     }
    //   });
    // }else{
    //     return res.status(401).json({message: 'Unauthorized'})
    // }
}


module.exports = {login, logout, forgetPassword, resetPassword, getUser}
