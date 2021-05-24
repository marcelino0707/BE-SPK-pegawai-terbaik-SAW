const PORT = process.env.PORT || 8081;
const express = require('express')
const route = require('./app/routes')
const app = express()

// const cookieParser = require('cookie-parser')

// const jwt = require('jsonwebtoken')
// require('dotenv').config()

//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
// app.use(cookieParser())

//CORS
app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin", "*")
    // res.header("Access-Control-Allow-Credentials", true)
    res.header("Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})

//Route Middlewares
app.use('/api/employee', route.employee)
app.use('/api/auth', route.auth)
app.use('/api/criterion', route.criterion)
app.use('/api/ranking', route.ranking)

// //test route
// app.get('/test', (req,res) => {
//     res.setHeader('Set-Cookie', 'TEST = true' )
//     res.send('test')
// })

//Port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});