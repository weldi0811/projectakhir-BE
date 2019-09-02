const router = require('express').Router()
const conn = require('../connection/index')
const multer = require('multer')
const path = require('path')
const rootdir = path.join(__dirname, '/../..')
const photoProductdir = path.join(rootdir, '/upload/productPhotos')
const fs = require('fs')

const folder = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            cb(null, photoProductdir)
        },
        filename: function (req, file, cb) {
            // console.log(req,body)
            cb(null, Date.now() + '_' + req.body.product_name + path.extname(file.originalname))
        }
    }
)

const upstore = multer(
    {
        storage: folder,
        limits: {
            fileSize: 2000000
        },
        fileFilter(req, file, cb) {
            var boleh = file.originalname.match(/\.(jpg|jpeg|png|gif)$/)

            if (!boleh) {
                cb(new Error('Hanya menerima file dengan ekstensi jpg, jpeg, png atau gif'))
            }

            cb(undefined, true)

        }
    }
)

//create new product in category
router.post('/product/:category_id', upstore.single('thumbnail'), (req, res) => {
    const { product_name, description, stock_S, stock_M, stock_L, stock_XL, price, weight } = req.body


    const sql = `insert into product set product_name='${product_name}'
                    ,category_id='${req.params.category_id}'
                    ,stock_S='${stock_S}'
                    ,stock_M='${stock_M}'
                    ,stock_L='${stock_L}'
                    ,stock_XL='${stock_XL}'
                    ,price='${price}'
                    ,weight='${weight}'
                    ,description='${description}'
                    ,thumbnail='${req.file.filename}'`

    conn.query(sql, (err, result) => {
        if (err) return res.send(err)

        res.send(result)


        })
    })

//create category
router.post('/category', (req, res) => {
    const sql = `insert into category set ?`
    const data = req.body

    conn.query(sql, data, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
    })
})

// ADD THUMBNAIL
router.post('/products/thumbnail', upstore.single('thumbnail_product'), (req, res) => {
    const sql = `update product set thumbnail = '${req.file.filename}' where id = ${req.body.id}`

    conn.query(sql, (err, result) => {
        if (err) return res.send(err)

        res.send({
            message: 'upload sukses',
            filename: req.file.filename
        })
    })
})

//akses thumbnail produk
router.get('/product/photos/:thumbnail', (req, res) => {
    const options = {
        root: photoProductdir
    }

    const filename = req.params.thumbnail

    res.sendFile(filename, options, function (err) {
        if (err) res.send(err)
        console.log('berhasil kirim gambar')
    })
})




//narik all product

router.get('/allproduct', (req, res) => {
    const sql = `select 
                product.id,product.product_name,category.category,product.stock_S,
                product.stock_M,product.stock_L,product.stock_XL,
                product.weight,product.price,product.thumbnail,product.status,product.description
                from product join category on product.category_id = category.id`

    conn.query(sql, (err, result) => {
        if (err) return res.send(err)

        res.send(result)
    })
})

//narik product by category
router.get('/products/:category_id', (req, res) => {
    const sql = `select 
                product.id,product.product_name,category.category,product.stock_S,
                product.stock_M,product.stock_L,product.stock_XL,
                product.weight,product.price,product.thumbnail, product.status, product.description
                from product inner join category on product.category_id = category.id where category.id = ${req.params.category_id}`

    conn.query(sql, (err, result) => {
        if (err) return res.send(err)

        res.send(result) //bentuknya [{}]
    })
})

//show product by id product

router.get('/product/:prod_id', (req, res) => {
    const sql = `select 
                product.id,product.product_name,category.category,product.stock_S,
                product.stock_M,product.stock_L,product.stock_XL,
                product.weight,product.price,product.thumbnail,product.status,product.description
                from product inner join 
                category on product.category_id = category.id 
                where product.id = ${req.params.prod_id}`


    conn.query(sql, (err, result) => {
        if (err) return res.send(err)

        res.send(result) //bentuknya array
    })
})

//set item jadi not available

router.patch(`/statusproduct/:id`, (req,res) => {
    const sql = `select * from product where id = ${req.params.id}`
    const sql2 = `update product set status = false where id = ${req.params.id}`
    const sql3 = `update product set status = true where id = ${req.params.id}`

    //cek item ada atau ngga
    conn.query(sql,(err,result1) => {
        if(err) return res.send(err)

        //update status
        if(result1[0].status === 1){
            conn.query(sql2,(err,resultFalse) => {
                if(err) return res.send(err)

                res.send('status = false')
            })
        } else {
            conn.query(sql3, (err, resultTrue) => {
                if(err) return res.send(err)

                res.send('status = true')
            })
        }
        
        // conn.query(sql2,(err,result2) => {
        //     if(err) return res.send(err)

        //     return res.send('sukses update status item')
        // })
    })
})

router.delete(`/deleteproduct/:id`, (req, res) => {
    const sql = `select thumbnail from product where id=${req.params.id}`
    const sql2 = `delete from product where id = ${req.params.id}`

    //delete gambar dari direktori dulu

    conn.query(sql, (err, result) => {
        if (err) return res.send(err)

        const filename = result[0].thumbnail
        const tobeDeleted = photoProductdir + '/' + filename

        fs.unlink(tobeDeleted, (err) => {
            if (err) return res.send(err)

            //delete produknya

            conn.query(sql2, (err, result2) => {
                if (err) return res.send(err)

                res.send(result2)
            })
        })
    })
})


//add product photos
//SETIAP YANG /product DIUBAH JADI /products AJA BIAR GA BENTROK SAMA ADD ITEM BY CATEGORY
router.post('/products/photos', upstore.single('pp_product'), (req, res) => {
    const sql = `insert into product_photos (pp_product, product_id_pp) values ('${req.file.filename}', ${req.body.id})`
    //id si product
    conn.query(sql, (err, result) => {
        if (err) return res.send(err)

        res.send({
            message: 'upload sukses',
            filename: req.file.filename
        })

    })
})


//update stock
router.patch('/product/stock/:productid', (req, res) => {
    const show = `select id,product_name,stock_S,stock_M,stock_L,stock_XL from product where id = '${req.params.productid}'`
    const sql = `update product set ? where id = ?`
    const sql2 = `select id,product_name,stock_S,stock_M,stock_L,stock_XL from product where id = '${req.params.productid}'`

    const data = [req.body, req.params.productid]

    //query buat show data sebelum update
    conn.query(show, (err, result) => {
        if (err) return res.send(err)

        conn.query(sql, data, (err, result2) => {
            if (err) return res.send(err)
            const product = result[0]

            //query buat nampilin data terupdate

            conn.query(sql2, (err, result3) => {
                if (err) return res.send(err)

                res.send(result3)
            })
        })
    })
    //query buat update stock
})


//update item
router.patch('/product/:productid', (req, res) => {
    const show = `select product_name,price,description from product where id = ${req.params.productid}`
    const sql = `update product set ? where id = ${req.params.productid}` //cuma bisa update nama harga deskripsi
    const data = req.body

    conn.query(show, (err, result1) => {
        if (err) return res.send(err)
        product = result1[0]

        conn.query(sql, data, (err, result2) => {
            if (err) return res.send(err)

            res.send('data berhasil di update')
        })
    })
})


module.exports = router