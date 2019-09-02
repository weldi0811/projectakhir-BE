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

const mailSubscribe = (data) => {
    var { email } = data

    const mail = {
        from : 'Ithink',
        to : email,
        subject : 'Anda telah terdaftar dalam newsletter iThink',
        html : `<h1>Selamat bergabung!</h1>
                <p>Anda akan terus mendapatkan informasi terbaru dan teraktual dari kami</p>
                
                <a href='http://localhost:4000/unsubscribe?email=${email}'>klik untuk unsubcsribe</a>`
    }
    
    transporter.sendMail(mail,(err,result) => {
        if(err) return console.log(err.message)
        
        console.log('oke')
    })
}

module.exports = mailSubscribe