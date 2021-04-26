const nodemailer = require("nodemailer"),
  express = require("express");

if (express().get("env") === "development") {
  require("dotenv/config");
}
module.exports = function (req, res, next) {
  let uri;
  if (express().get("env") === "development") {
    uri = `${req.protocol}://${req.hostname}:5000${req.originalUrl}`;
  } else {
    uri = `${req.protocol}://${req.hostname}${req.originalUrl}`;
  }
  async function main() {
    let transporter = nodemailer.createTransport({
      host: "host11.registrar-servers.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMPT_USER,
        pass: process.env.SMPT_PASS,
      },
    });

    let userMsg = await transporter.sendMail({
      from: `"Bridal kandil" <ewmrhumr@yowamusic.com.ng>`, // sender address
      to: `${req.body.email}`, // list of receivers
      subject: "Activation link", // Subject line
      html: `<body style='display: flex; flex-direction: column; justify-content: center; background:#eee; font-family:poppins'>
 <section id='body' style="box-shadow: 1px 1px 2px 5px rgba(10,10,10,0.97); color:#333;  background:white; max-width:80%; width:80%; margin: 30px auto 40px auto; padding: 5px 20px; text-align: center">


 <h1 style="font-size:37px; color: #8740dd; margin-bottom: 30px; text-align:center">Bridal Kandil </h1>
 <p style='font-size:22px;'>Hey ${req.body.name}!</p>
 <p style='font-size:22px; padding-top: 7px; margin-bottom:0px;'> Thanks for creating an account with us,</p>
 <p style='font-size:22px; margin-top:0; padding-top: 3px'> kindly use the button below to activate your account.</p>
 
 <div style="display: flex; flex-direction: column; justify-content: center; margin: 30px 0 20px 0;">
 <a style='border:none; padding:5px 14px; font-size: 18px; background: #8740dd; color: white; text-decoration: none; display: block; margin: 0px auto 0px auto; border-radius:20px' href="${uri}/authentication/${req.headers.token}">
 Activate Account  </a>
 </div>
 </section>
 </body>
 `, // html body
    });

    console.log(
      "Message sent: %s",
      `${userMsg.messageId} ${req.body.email} ${req.headers.token}`
    );
    console.log(uri);
  }
  main().catch(console.error);

  res.status(201).json({ data: "Account created successfully" });
};
