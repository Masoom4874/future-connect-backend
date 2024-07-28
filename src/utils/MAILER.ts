import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, 
    pass: process.env.GMAIL_PASS, 
  },
});

interface EmailOptions {
  from?: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
}

// Function to send an email
export const sendEmail = (options: EmailOptions): Promise<nodemailer.SentMessageInfo> => {
  const mailOptions: nodemailer.SendMailOptions = {
    from: options.from || process.env.GMAIL_USER, 
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error);
      }
      resolve(info);
    });
  });
};
