import nodemailer from 'nodemailer';
import { marked } from 'marked';

const email = async (markdown, to, subject) => {
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const html = marked(markdown);

    try {
        let info = await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
        console.log('Email enviado: ' + info.response);
    } catch (error) {
        console.log('Erro ao enviar email: ' + error.message);
    }
};  

export default email;