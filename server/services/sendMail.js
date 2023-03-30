const nodemailer = require("nodemailer");

transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_HOST,
    pass: process.env.APP_PASSWORD,
  },
});

exports.sendVerificationEmail = async (code, toEmail) => {
  const mailOptions = {
    from: process.env.EMAIL_HOST,
    to: toEmail,
    subject: "Verify your account",
    text: `Your verification code is ${code}. Enter this code on our website to verify your account.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (err) {
    console.log(err);
    throw "Some thing goes wrong while attempting to send verification email";
  }
};
