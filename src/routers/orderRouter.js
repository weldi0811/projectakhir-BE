const router = require('express').Router()
const conn = require('../connection/index')
const multer = require('multer')
const path = require('path')
const rootdir = path.join(__dirname , '/../..' )
const confirmationProve = path.join (rootdir, '/upload/confirmationProve' )


const folder = multer.diskStorage(
    {
        destination: function(req,file,cb){
            cb(null,confirmationProve)
        },
        filename: function(req,file,cb){
            // console.log(req,body)
            cb(null,req.body.idorder + path.extname(file.originalname))
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


//add to cart
router.post('/cart/:user_id', (req,res) => {
    const sql1 = `insert into order_details (user_id_od) values('${req.params.user_id}')`
    const sql2 = `update order_details set 
    product_id_od = ${req.body.product_id_od}, 
    qty_od_s = ${req.body.qty_od_s}, 
    qty_od_m = ${req.body.qty_od_m}, 
    qty_od_L = ${req.body.qty_od_L}, 
    qty_od_XL = ${req.body.qty_od_XL}, 
    total_price_od = ${req.body.total_price_od}, 
    total_weight_od = ${req.body.total_weight_od}
    where user_id_od = '${req.params.user_id}'`
    const show = `select * from order_details where user_id_od = '${req.params.user_id}'`

    conn.query(sql1,(err,result) => {
        if(err) return res.send(err)

        conn.query(sql2,(err,result2) => {
            if(err) return res.send(err)

        })
            conn.query(show,(err,result3) => {
                if(err) return res.send(err)

                res.send(result3)
            })
    })
})

//checkout
router.post('/checkout/:user_id', (req,res) => {
    const sql1 = `insert into orders set ?`
    
})

//payment confirmation
router.post('/confirmation/:orderid',upstore.single('payment_prove') ,(req,res) => {
    const sql = `insert into confirmation (orders_id, status) values (${req.params.orderid}, 'waiting verification')`
    const sql2 = `update confirmation set payment_prove = '${req.file.filename}' where orderd_id = ${req.params.orderid}`

    conn.query(sql,(err,result1) => {
        if(err) return res.send(err)

        conn.query(sql2,(err,result2) => {
            if(err) return res.send(err)

            res.send(result2)
        })
    })


})



module.exports = router