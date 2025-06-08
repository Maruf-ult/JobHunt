import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587, 
    secure: false, 
    auth: {
      user: process.env.SMTP_USER || "8b28aa002@smtp-brevo.com",
      pass: process.env.SMTP_PASS || "Bm43VNFRJZUcrD1M",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  export default transporter