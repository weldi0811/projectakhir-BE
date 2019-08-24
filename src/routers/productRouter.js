const router = require('express').Router()
const conn = require('../connection/index')
const multer = require('multer')
const path = require('path')
const rootdir = path.join(__dirname , '/../..' )
const photoProductdir = path.join (rootdir, '/upload/productPhotos' )

const folder = multer.diskStorage(
    {
        destination: function(req,file,cb){
            cb(null,photoProductdir)
        },
        filename: function(req,file,cb){
            // console.log(req,body)
            cb(null, Date.now() + '_' + req.body.product_name + path.extname(file.originalname))
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

//create category
router.post('/category', (req,res) => {
    const sql = `insert into category set ?`
    const data = req.body

    conn.query(sql,data,(err,result) => {
        if(err) return res.send(err)
        res.send(result)
    })
})

// ADD THUMBNAIL
router.post('/products/thumbnail', upstore.single('thumbnail_product'), (req,res) => {
    const sql = `update product set thumbnail = '${req.file.filename}' where id = ${req.body.id}`

    conn.query(sql,(err,result) => {
        if(err) return res.send(err)

        res.send({
            message : 'upload sukses',
            filename : req.file.filename
        })
    })
})

//create new product in category
router.post('/product/:category_id',(req,res) => {
    const sql = `insert into product set ?`
    const sql2 = `update product set category_id = '${req.params.category_id}' where id = ?`
    //input id product ke product_photo
    const sql3 = `insert into product_photos set product_id_pp = ?`
    
    //input category 
    const data = req.body
    
    conn.query(sql,data,(err,result1) => {
        if(err) return res.send(err)

        conn.query(sql2,result1.insertId,(err,result2)=> {
            if(err) return res.send(err)
        }) 

        conn.query(sql3,result1.insertId,(err,result3)=> {
            if(err) return res.send(err)

        })
        res.send(result1)
    })
    
})

//narik all product

router.get('/product', (req,res) => {
    const sql = `select product.id,product_photos.id,product.product_name,product_photos.pp_product,product.thumbnail from product
    inner join product_photos on product_photos.product_id_pp = product.id`

    conn.query(sql,(err,result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

//narik product by category
router.get('/products/:category_id', (req,res) => {
    const sql = `select * from product inner join category on product.category_id = category.id where category.id = ${req.params.category_id}`

    conn.query(sql,(err,result) => {
        if(err) return res.send(err)

        res.send(result) //bentuknya [{}]
    })
})

//show product by id product

router.get('/product/:prod_id', (req,res) => {
    const sql = `select product.id,product.product_name,product_photos.pp_product from product
    inner join product_photos on product_photos.product_id_pp = product.id where product.id = ${req.params.prod_id}`

    conn.query(sql,(err,result) => {
        if(err) return res.send(err)

        res.send(result) //bentuknya array
    })
})


//add product photos
//SETIAP YANG /product DIUBAH JADI /products AJA BIAR GA BENTROK SAMA ADD ITEM BY CATEGORY
router.post('/products/photos', upstore.single('pp_product'), (req,res) => {
    const sql = `insert into product_photos (pp_product, product_id_pp) values ('${req.file.filename}', ${req.body.id})`
     //id si product
    conn.query(sql,(err,result) => {
        if(err) return res.send(err)

        res.send({
            message : 'upload sukses',
            filename : req.file.filename
        })

    })
})


//update stock
router.patch('/product/stock/:productid', (req,res) => {
    const show = `select id,product_name,stock_S,stock_M,stock_L,stock_XL from product where id = '${req.params.productid}'`
    const sql = `update product set ? where id = ?`
    const sql2 = `select id,product_name,stock_S,stock_M,stock_L,stock_XL from product where id = '${req.params.productid}'`
    
    const data = [req.body, req.params.productid]

    //query buat show data sebelum update
    conn.query(show,(err,result) => {
        if(err) return res.send(err)

        conn.query(sql,data,(err,result2) => {
            if(err) return res.send(err)
            const product = result[0]
    
            //query buat nampilin data terupdate

            conn.query(sql2,(err,result3) => {
                if(err) return res.send(err)

                res.send(result3)
            })
        })
    })
    //query buat update stock
})


//update item
router.patch('/product/:productid', (req,res) => {
    const show = `select product_name,price,description from product where id = ${req.params.productid}`
    const sql = `update product set ? where id = ${req.params.productid}`
    const data = req.body

    conn.query(show,(err,result1) => {
        if(err) return res.send(err)
        product = result1[0]

        conn.query(sql, data, (err,result2) => {
            if(err) return res.send(err)

            res.send('data berhasil di update')
        })
    })
})


module.exports = router