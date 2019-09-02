const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport(
    {
        service : 'gmail',
        auth : {
            type : 'OAuth2',
            user: 'weldi0811@gmail.com',
            clientId : '238497532592-bp12v9qltnmrv4t9c8j9g5ehmfr86dqq.apps.googleusercontent.com',
            clientSecret : 'vKuwtkkr2E81uPsJoohBix3j',
            refreshToken : '1/7aGuzi3gIczRgEG3uZuRupKi60BSK_6gfI6KBbTg1ys'
        }
    }
)

const mailUpdates = (data) => { 

    let{product_name,price, thumbnail} = data
   
    const mail = {
        from : 'Ithink',
        to : email,
        subject : `Hai!, Update terbaru khusus buat kamu</b>`,
        html : `<h1>New Item! ${product_name}</h1>
                <p>Cuma dengan harga ${price} kamu sudah bisa dapetin apparel keren ini </p>
                <img src='http://localhost:4000/product/photos/${thumbnail}' />`    }
    
    transporter.sendMail(mail,(err,result) => {
        if(err) return console.log(err.message)
        
        console.log('oke')
    })
}



module.exports = mailUpdates