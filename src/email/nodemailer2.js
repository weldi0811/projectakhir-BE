const nodemailer2 = require('nodemailer')

const transporter = nodemailer2.createTransport(
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

const mailResi = (data) => {
    var {id,order_awb,updated_at,email,username} = data
    const mail = {
        from : 'Ithink',
        to : email,
        subject : 'Resi anda telah di update',
        html : `<h5>hai ${username} </h5>
        <p>Pembelian dengan nomor order ${id} telah dikirimkan dengan resi = ${order_awb} pada ${updated_at}</p>`
    }

    transporter.sendMail(mail,(err,result) => {
        if(err) return console.log(err.message)

        console.log('update resi sudah dikirim')
    })
}

module.exports = mailResi