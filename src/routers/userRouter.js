const conn = require('../connection/index')
const router = require('express').Router()
const isEmail = require('validator/lib/isEmail')
const bcrypt = require('bcrypt')
const path = require('path')
const multer = require('multer')
const fs = require('fs')
const mailVerify = require('../email/nodemailer')
const rootdir = path.join(__dirname , '/../..' )
const photoUserdir = path.join (rootdir , '/upload/userPhotos')

// console.log(photoUserdir)
// console.log(photoProductdir)

const folder = multer.diskStorage(
    {
        destination: function(req,file,cb){
            cb(null,photoUserdir)
        },
        filename: function(req,file,cb){
            console.log(req.body)
            cb(null, Date.now() + '-' + req.body.username + path.extname(file.originalname))
        }
    }
)

const upstore = multer (
    {
        storage : folder,
        limits : {
            fileSize : 2000000 //bytes
        },
        fileFilter(req,file,cb){
            var allowed = file.originalname.match(/\.(jpg|jpeg|png|gif)$/)

            if(!allowed){
                cb(new Error('Masukan file dengan extensin jpg, jpeg, png atau gif'))
            }

            cb(undefined, true)
        }
    }
)


//bikin user baru

router.post('/users', (req,res) => {
    const sql = `INSERT INTO users set ?`
    const sql2 = `SELECT first_name,username,email,verified from users where id =?`
    const data = req.body

    //validate email
    if(!isEmail(data.email)){
        return res.send('please input a correct Email')
    }

    //hash password
    data.password = bcrypt.hashSync(data.password, 8)

    conn.query(sql,data, (err,result1) => {
        if(err){
            return res.send(err)
        }

        conn.query(sql2,result1.insertId, (err,result2) => {
            if(err){
                return res.send(err)
            }
            res.send(result2)

            mailVerify(result2[0])
        })
    })
})

//upload avatar
//INGET DI POSTMAN, USERNAME DIISI DULUAN BARU AVATAR OKE

router.post('/users/avatar', upstore.single('avatar'), (req,res) => {
    const sql = `select id,first_name,last_name,username,email from users where username =?`
    const sql2 = `update users set avatar = '${req.file.filename}' where username = '${req.body.username}'`
    const data = req.body.username

    conn.query(sql,data,(err,result) => {
        if(err){
            return res.send(err)
        }
        //bikin variabel baru buat di cek
        const user = result[0]
        if(!user){
            return res.send('user not found')
        }
        conn.query(sql2,(err,result2) => {
            if(err) return res.send(err)
            res.send(
                {
                    message : 'upload sukses',
                    filename : req.file.filename
                }
            )
        })
    })
})

//ACCESS AVATAR USER
//NANTI PARAMETER AVATARNAME DIOPER KE REDUX
router.get('/users/avatar/:avatarname', (req,res) => {
    const options = {
        root : photoUserdir
    }

    const filename = req.params.avatarname

    res.sendFile(filename, options, function(err){
        if(err) res.send(err)
        console.log('berhasil kirim gambar')
    })
})

//DELETE IMAGE DI DIREKTORI
router.delete('/users/avatar', (req,res) => {
    const sql = `select * from users where username = '${req.body.username}'`
    const sql2 = `update users set avatar = null where username = '${req.body.username}'`

    conn.query(sql,(err,result)=> {
        if(err) return res.send(err)

        //nama file

        const filename = result[0].avatar
        const avatarpath = photoUserdir+ '/' +filename

        //DELETE IMAGE
        //import fs dulu
        fs.unlink(avatarpath,(err) => {
            if(err) return res.send(err)

            conn.query(sql2,(err,result2) => {
                if(err) return res.send(err)

                res.send('berhasil delete avatar')
            })
        })
    })
})



module.exports = router