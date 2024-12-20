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
        await transporter.sendMail({ from: 'lab@odutra.com', to, subject, html });
    } catch (error) {
        console.log('sendEmail error:', error)
    }
};  

export default email;