import nodemailer from "nodemailer";


// create a transporter using SMTP 
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connections to TLS after connecting)
  auth: {
    user: "yt2022a3@gmail.com",
    pass: "kgizugsfrqhhvoqa"
  },
});


export const sendEmail = async(recepient, subject, emailTemplate)=> {
  try {
    const info = await transporter.sendMail({
      from: "BlogYourWay Team", //sender address
      to: recepient, // list of recepients
      subject: subject, // subject line
      html: emailTemplate, // HTML body
    });

    console.log("message sent: ", info.messageId);

  } catch (error) {
    console.error("Error while sending mail: %s", error.message);
  }
}

sendEmail()