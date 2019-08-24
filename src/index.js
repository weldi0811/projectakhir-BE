const express = require('express')
const cors = require('cors')

// Routers
const portconfig = require('./config/port')
const userRouter = require('./routers/userRouter')
const productRouter = require('./routers/productRouter')
const orderRouter = require('./routers/orderRouter')


const server = express()
const port = portconfig

server.use(cors())

server.use(express.json())
server.use(userRouter)
server.use(productRouter)
server.use(orderRouter)

server.get('/',(req,res) => {
    res.send('hai')
})


//server is up andrunning
server.listen(port, () => {
    console.log('sukses di port ' + port)
})