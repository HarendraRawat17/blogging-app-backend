import nodemailer from "nodemailer";


// create a transporter using SMTP 
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },

});


export const sendEmail = async(recepient, subject, emailTemplate)=> {
  try {
    const info = await transporter.sendMail({
      from: `BlogYourWay Team <${process.env.EMAIL_USER}>`,
      to: recepient, // list of recepients
      subject: subject, // subject line
      html: emailTemplate, // HTML body
    });

    console.log(`📨 Mail dispatched successfully to: ${recepient} | ID: ${info.messageId}`);

    return info;

  } catch (error) {
    console.error("FULL EMAIL ERROR:", error);
    throw error;
  }
}