const express = require('express')
const mysql = require('mysql')
const portconfig = require('./config/port')
const userRouter = require('./routers/userRouter')


const server = express()
const port = portconfig

server.use(express.json())
server.use(userRouter)

server.get('/',(req,res) => {
    res.send('hai')
})

server.listen(port, () => {
    console.log('sukses di port ' + port)
})