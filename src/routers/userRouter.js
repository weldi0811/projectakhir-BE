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


//login user
router.post('/users/login', (req,res) => {
    const sql = `select * from users where email= ?`
    const data = req.body.email

    conn.query(sql,data, async(err,result) => {
        if(err) return res.send(err)

        const user = result[0]
        if(!user) return res.send('user not found')

        //kalau usernya ada
        const isMatch = await bcrypt.compare(req.body.password, user.password)

        if(isMatch === false) return res.send('user or password is not correct')
        res.send(user)
    })
})

//login admin
router.post('/admin/login', (req,res) => {
    const sql = `select * from admin where admin_name = '${req.body.admin_name}'`
    const data = req.body

    conn.query(sql,data, async(err,result) => {
        if(err) return res.send(err)

        const admin = result[0]
        if(!admin) return res.send('admin not found')

        //kalau adminnya ada

        const isAdmin = await bcrypt.compare(req.body.admin_pass, admin.admin_pass)

        if(isAdmin === false) return res.send('password incorrect')
        
        res.send(admin)
    })
})

//input admin baru
router.post('/admin/input', (req,res) => {
    const sqlUnique = `select * from admin`
    const sql = `INSERT INTO admin set ?`
    const data = req.body

    //username minimum 6 karakter
    if(data.admin_name.length <3){
        return res.send('username must be 3 characters or more')
    }

    //password 8-16 karakter
    if(data.admin_pass.length<8 || data.admin_pass.length>16){
        return res.send('password must be 8-16 characters')
    }

    //hash password
    data.admin_pass = bcrypt.hashSync(data.admin_pass, 8)


    conn.query(sqlUnique,data,(err,result) => {
        if(err) return res.send(err)

        //res.send(result) [{}]
        let adminExist = result.filter(adminObject => {
            return adminObject.admin_name === data.admin_name
        })

        if(adminExist.length === 1){
            return res.send('username already used')
        }
    })

    conn.query(sql,data, (err,result1) => {
        if(err){
            return res.send(err)
        }
        res.send(result1)
    })
})

//bikin user baru

router.post('/users/input', (req,res) => {
    const sqlUnique = `select * from users`
    const sql = `INSERT INTO users set ?`
    const sql2 = `select * from users where id =? `
    const data = req.body

    //username minimum 6 karakter
    if(data.username.length <6){
        return res.send('username must be 6 characters or more')
    }

    //validate email
    if(!isEmail(data.email)){
        return res.send('please input a correct Email')
    }

    //password 8-16 karakter
    if(data.password.length<8 || data.password.length>16){
        return res.send('password must be 8-16 characters')
    }

    //hash password
    data.password = bcrypt.hashSync(data.password, 8)

    //filter username dan email

    conn.query(sqlUnique,data,(err,result) => {
        if(err) return res.send(err)

        //res.send(result) [{}]
        let usernameExist = result.filter(userObject => {
            return userObject.username === data.username
        })
        if(usernameExist.length === 1){
            return res.send('username already used')
        }
        let emailExist = result.filter(userObject => {
            return userObject.email === data.email
        })
        if(emailExist.length === 1){
            return res.send('email already registerd')
        }
    })

    conn.query(sql,data, (err,result1) => {
        if(err){
            return res.send(err)
        }
        
        conn.query(sql2,result1.insertId,(err,result2) => {
            if(err) return res.send(err)

            res.send(result2)

            mailVerify(result2[0])
        })
    })
})

//get profile

router.get('/users/profile/:username', (req,res) => {
    const sql = `select username,first_name,last_name,email,avatar from users where username = ?`
    const data = req.params.username

    conn.query(sql,data, (err,result) => {
        if(err) return res.send(err)

        //buat nampilin beberapa hasil aja dan dimasukin kedalem object bernama user
        const user = result[0]
        //if user not found
        if(!user) return res.send(err)
        //mau balikin username, first name, last name, email sama avatar
        res.send({
            username : user.username,
            first_name : user.first_name,
            last_name : user.last_name,
            email : user.email,
            phone_number : user.phone_number,
            profilePicture : `localhost:4000/users/avatar/${user.avatar}`
        })
    })
})

//update profile

router.patch('/users/profile/:username', (req,res) => {
    //habis update mau nampilin datanya
    const sql = `update users set ? where username = ? `
    const sql2 = `select username,first_name,last_name,email from users where username = '${req.params.username}'`
    //data bisa dalem bentuk array, yang penting urutan dalem array ngikutin urutan didalem query
    const data = [req.body, req.params.username]

    //ngehash password baru dulu, kalau password dirubah
    if(data[0].password){
        data[0].password = bcrypt.hashSync(data[0].password, 8)
    }
    //query buat update
    conn.query(sql,data, (err,result) => {
        if(err) return res.send(err)

        //query buat show data update
        conn.query(sql2,(err,result2) => {
            if(err) return res.send(err)

            const user = result2[0]
            if(!user) return res.send('user not found')
            res.send(user)
        })
    })
})

//upload avatar
//INGET DI POSTMAN, ID DIISI DULUAN BARU AVATAR OKE
//TES GANTI POST KE PATCH
router.patch('/users/avatar', upstore.single('avatar'), (req,res) => {
    const sql = `update users set avatar = '${req.file.filename}' where id = '${req.body.id}'`
    

    conn.query(sql,(err,result) => {
        if(err) return res.send(err)
        res.send(
            {
                message : 'upload sukses',
                filename : req.file.filename
            }
        )
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
router.delete('/users/avatar/:id', (req,res) => {
    const sql = `select * from users where id = '${req.params.id}'`
    const sql2 = `update users set avatar = null where id = '${req.params.id}'`

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





//verify user ??
router.get('/verify', (req,res) => {
    const sql = `update users set verified = true where username = ?`
    const data = req.query.username

    conn.query(sql,data,(err,result) => {
        if (err) return res.send(err)

        res.send('<h1>Selamat, akun anda telah terverifikasi</h1>')
    })
})



module.exports = router