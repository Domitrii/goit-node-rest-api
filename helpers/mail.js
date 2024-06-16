import nodemailer from 'nodemailer'
import "dotenv/config";


const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAIL_TRAP_USERNAME,
      pass: process.env.MAIL_TRAP_PASS
    }
  });


  const sendMail = (message) => {
    return transport.sendMail(message);
  };

export default {sendMail}