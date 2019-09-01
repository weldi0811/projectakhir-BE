const nodemailer3 = require('nodemailer')

const transporter = nodemailer3.createTransport(
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




const mailPOP = (data) => {
    var{admin_name, email} = data
    const mail = {
        from : 'Ithink',
        to : email,
        subject :'ada yang upload bukti pembayaran',
        html : `<h1>silahkan cek manage transaction, ada yang update bukti pembayaran</h1>`
    }
    
    transporter.sendMail(mail,(err,result) => {
        if(err) return console.log(err.message)

        console.log('ada yang upload bukti pembayaran')
    })

}

module.exports = mailPOP