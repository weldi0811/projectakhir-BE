const router = require('express').Router()
const conn = require('../connection/index')
const multer = require('multer')
const path = require('path')
const rootdir = path.join(__dirname , '/../..' )
const confirmationProve = path.join (rootdir, '/upload/confirmationProve' )
const fs = require('fs')


const folder = multer.diskStorage(
    {
        destination: function(req,file,cb){
            cb(null,confirmationProve)
        },
        filename: function(req,file,cb){
            // console.log(req,body)
            cb(null, Date.now() + '_' + req.body.id + path.extname(file.originalname))
        }
    }
)

const upstore = multer(
    {
        storage:folder,
        limits: {
            fileSize : 2000000
        },
        fileFilter(req,file,cb){
            var boleh = file.originalname.match(/\.(jpg|jpeg|png|gif)$/)
    
            if(!boleh){
                cb(new Error('Hanya menerima file dengan ekstensi jpg, jpeg, png atau gif'))
            }
    
            cb(undefined, true)

        }
    }
)

//payment confirmation

router.patch('/confirmation', upstore.single('proof_of_payment'), (req,res) => {
    const sql = `update checkout set proof_of_payment = '${req.file.filename}' ,
    order_status = 'pending' where id = ${req.body.id}`

    conn.query(sql, (err,result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

//NEW CHECKOUT
router.post('/checkout', (req,res) => {
    
    const {user_id, total_price,total_weight,order_address,order_name,order_phonenumber,cartArray} = req.body
    
    const sql = `insert into checkout
    (user_id, total_price, order_name, order_address,order_phonenumber,order_status, total_weight)
    values ('${user_id}', '${total_price}', '${order_name}', '${order_address}', '${order_phonenumber}', 'waiting payment', 0)`

    
    conn.query(sql, (err,result) => {
        if(err) return res.send(err)

        //mecah array cart jadi object 1 1

        const valueCart = cartArray.map ( cart => {
            return `(${result.insertId}, '${cart.product_name}', '${cart.price}', '${cart.qty_S}', '${cart.qty_M}', '${cart.qty_L}', '${cart.qty_XL}')`
        })

        const sql2 = `insert into checkout_details 
        (checkout_id, product_name, product_price, qty_S, qty_M, qty_L, qty_XL)
        values ${valueCart.join(',')}`

        conn.query(sql2,(err2,result2) => {
            if(err2) return res.send(err2)

            res.send(result2)
        })
    })
})

//nampilin semua checkout per user
router.get('/usertransaction/:user_id', (req,res) => {
    const sql = `select * from checkout where user_id = ${req.params.user_id}`

    conn.query(sql, (err,result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

//nampilin item user transaction
router.get('/usertransaction/items/:checkout_id', (req,res) => {
    const sql =`select * from checkout_details where id = ${req.params.checkout_id}`

    conn.query(sql,(err,result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})


//delete cart

router.delete(`/deletecart/:user_id`, (req,res) => {
    const sql = `delete from cart where user_id = ${req.params.user_id}`

    conn.query(sql,(err,result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

//set order status 
//UPDATE JADI REJECTED

router.patch('/checkoutrejected/:checkout_id', (req,res) => {
    const sql = `update checkout set order_status = 'rejected',
    proof_of_payment = null
    where id = ${req.params.checkout_id} `

    const fileName = req.body.proof_of_payment

    const thisProofImage = confirmationProve + '/' + fileName

    //delete dari database

    fs.unlink(thisProofImage, (err) => {
        if(err) return res.send(err)

        conn.query(sql, (err,result) => {
            if(err) return res.send(err)

            res.send(result)
        })
    })
})

//udpate jadi processing

router.patch('/checkoutprocessed/:checkout_id', (req,res) => {
    const sql = `update checkout set order_status = 'processing' where id = ${req.params.checkout_id}`

    conn.query(sql, (err,result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

//update jadi complete

router.patch('/checkoutcomplete/:checkout_id', (req,res) => {
    const sql = `update checkout set order_status = 'completed' where id = ${req.params.checkout_id}`

    conn.query(sql, (err,result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})





//akses confirmation image
router.get('/proof/:filename', (req,res) => {
    const options = {
        root : confirmationProve
    }

    const fileName = req.params.filename

    res.sendFile(fileName, options, (err) => {
        if(err) return res.send(err)
    })
})




//khusus admin

//NARIK SEMUA TRANSAKSI

router.get('/alltransactions', (req,res) => {
    const sql = `select checkout.id, checkout.user_id, username, email,
    total_price, order_name, order_address, order_phonenumber,
    order_awb, order_status,proof_of_payment, 
    DATE_FORMAT(checkout.created_at, "%a %D %M %Y") 'created_at' from checkout
    join users on users.id = checkout.user_id`


    conn.query(sql, (err,result) => {
        if(err) return res.send(err)
    })
})

//narik 1 transaksi

router.get('/transactions/:checkout_id', (req,res) => {
    const sql = `select checkout_id, total_price 
    cd.product_name, cd.product_price, cd.qty_S, cd.qty_M, cd.qty_L, cd.qty_XL
    from checkout join checkout_details cd on checkout.id = cd.checkout_id
    where checkout_id = ${req.params.checkout_id} `

    conn.query(sql, (err,result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

//update resi
router.patch('/updateresi/:id', (req,res) => {
    const sql = `update checkout set order_awb = '${req.body.order_awb}' , order_status = 'sent'
    where id = ${req.params.id} `

    conn.query(sql, (err,result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})





module.exports = router