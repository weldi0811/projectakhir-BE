const router = require('express').Router()
const conn = require('../connection/index')


//NARIK CART USER

router.get('/cart/:userid', (req,res) => {
    const sql = `SELECT  cart.cart_id, user_id , username , cart.product_id, product.product_name, product.thumbnail,
    product.price,qty_S,qty_M,qty_L,qty_XL FROM users
    JOIN cart on users.id = cart.user_id
    JOIN product on product.id = cart.product_id
    WHERE users.id = '${req.params.userid}'`

    conn.query(sql,(err,result) => {
        if(err) return res.send(err)

        //hasil dari select pasti array, jadi tembak langsung indexnya aja

        res.send(result)
    })
})

//add to cart
//SIZE S
router.post('/addtocarts', (req,res) => {
    const sql = `insert into cart (user_id, product_id, qty_S, qty_M, qty_L, qty_XL)
                values ('${req.body.user_id}', '${req.body.product_id}', 
                        '${req.body.qty_S}', 0, 0, 0)`

    conn.query(sql, (err,result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

//SIZE M
router.post('/addtocartm', (req,res) => {
    const sql = `insert into cart (user_id, product_id, qty_M, qty_S, qty_L, qty_XL)
                values ('${req.body.user_id}', '${req.body.product_id}', 
                        '${req.body.qty_M}' , 0,0,0)`

    conn.query(sql, (err,result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

//SIZE L
router.post('/addtocartl', (req,res) => {
    const sql = `insert into cart (user_id, product_id, qty_L, qty_S,qty_M,qty_XL)
                values ('${req.body.user_id}', '${req.body.product_id}', 
                        '${req.body.qty_L}' ,0,0,0)`

    conn.query(sql, (err,result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

//SIZE XL
router.post('/addtocartxl', (req,res) => {
    const sql = `insert into cart (user_id, product_id, qty_XL, qty_S,qty_M, qty_L)
                values ('${req.body.user_id}', '${req.body.product_id}', 
                        '${req.body.qty_XL}',0,0,0)`

    conn.query(sql, (err,result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})


//delete cart
//delete cart by user id

router.delete('/deletecart/:id', (req,res) => {
    const sql = `delete from cart where user_id = ${req.params.id}`

    conn.query(sql,(err,result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

//delete item didalem cart
router.delete('/deletecartitem/:id', (req,res) => {
    const sql = `delete from cart where cart_id = ${req.params.id}`

    conn.query(sql,(err,result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

//update qty item
//SIZE S
router.patch('/updateqtys', (req,res) => {
    const sql = `update cart set qty_S = '${req.body.qty_S}'
                where product_id = ${req.body.product_id} and user_id = ${req.body.user_id}`

    conn.query(sql,(err,result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

//SIZE M
router.patch('/updateqtym', (req,res) => {
    const sql = `update cart set qty_M = '${req.body.qty_M}'
                where product_id = ${req.body.product_id} and user_id = ${req.body.user_id}`

    conn.query(sql,(err,result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

//SIZE L
router.patch('/updateqtyl', (req,res) => {
    const sql = `update cart set qty_L ='${req.body.qty_L}'
                where product_id = ${req.body.product_id} and user_id = ${req.body.user_id}`

    conn.query(sql,(err,result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

//SIZE XL
router.patch('/updateqtyxl', (req,res) => {
    const sql = `update cart set qty_XL ='${req.body.qty_XL}'
                where product_id = ${req.body.product_id} and user_id = ${req.body.user_id}`

    conn.query(sql,(err,result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})


//CHANGE QTY
//SIZE S
router.patch(`/changeqtys/:id`, (req,res) => {
    const sql = `update cart set 
    qty_S = ${req.body.qty_S}
    where cart_id = ${req.params.id}`

    conn.query(sql,(err,result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

//SIZE M
router.patch(`/changeqtym/:id`, (req,res) => {
    const sql = `update cart set 
    qty_M = ${req.body.qty_M}
    where cart_id = ${req.params.id}`

    conn.query(sql,(err,result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

//SIZE L
router.patch(`/changeqtyl/:id`, (req,res) => {
    const sql = `update cart set 
    qty_L = ${req.body.qty_L}
    where cart_id = ${req.params.id}`

    conn.query(sql,(err,result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

//SIZE XL
router.patch(`/changeqtyxl/:id`, (req,res) => {
    const sql = `update cart set 
    qty_XL = ${req.body.qty_XL}
    where cart_id = ${req.params.id}`

    conn.query(sql,(err,result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})


module.exports = router