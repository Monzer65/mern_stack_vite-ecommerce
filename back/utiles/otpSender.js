/** @format */

const axios = require("axios");
const nodemailer = require("nodemailer");

async function sendSMS(UserName, Password, From, To, Message) {
  const url = "https://webone-sms.ir/SMSInOutBox/Send";
  const data = {
    UserName,
    Password,
    From,
    To,
    Message,
  };

  try {
    const response = await axios.post(url, data);
    console.log(response.data);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send SMS");
  }
}

async function sendEmail(from, to, subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send email");
  }
}

module.exports = {
  sendSMS,
  sendEmail,
};
