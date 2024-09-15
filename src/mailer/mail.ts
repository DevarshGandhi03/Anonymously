import nodemailer from "nodemailer";
import { ApiResponse } from "@/helpers/apiResponse";

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: "devarsh600@gmail.com",
    pass: process.env.RESEND_API_KEY,
  },
});

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  // send mail with defined transport object
  try {
    const info = await transporter.sendMail({
      from: '"Anonymously" <devarsh600@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Anonymously || Verify user", // Subject line
      html: `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>User Verification Email</title>
      <style>
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f1f1f1;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 30px auto;
            padding: 40px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 6px 12px rgba(0,0,0,0.1);
            border: 1px solid #e0e0e0;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header img {
            max-width: 200px;
            height: auto;
        }
        .content {
            font-size: 16px;
            color: #333333;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .content h1 {
            color: #2c3e50;
            font-size: 26px;
            margin-bottom: 20px;
            font-weight: 600;
        }
        .button {
            display: block;
            width: 100%;
            max-width: 220px;
            margin: 30px auto;
            padding: 14px;
            text-align: center;
            color: #ffffff;
            background-color: #3498db;
            border-radius: 5px;
            text-decoration: none;
            font-size: 18px;
            font-weight: 500;
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }
        .button:hover {
            background-color: #2980b9;
            box-shadow: 0 6px 12px rgba(0,0,0,0.2);
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #7f8c8d;
            margin-top: 30px;
        }
        .footer a {
            color: #3498db;
            text-decoration: none;
            font-weight: 500;
        }
         @media only screen and (max-width: 600px) {
            .content {
                font-size: 14px;
            }
            .button {
                font-size: 14px;
                padding: 12px;
            }
            .footer {
                font-size: 12px;
            }
        }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="content">
              <h1>Hello ${username},</h1>
              <p>Thank you for registering. Please use the following verification
              code to complete your registration:<b> ${verifyCode}</b></p>
              <p>If you did not create an account, please ignore this email.</p>
              <p>Best regards,<br>Anonymously Team</p>
          </div>
      </div>
  </body>
  </html>
  `,
    });
    // console.log("Message sent: %s", info.messageId);
    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    console.log("Error occoured while sending email");

    return { success: false, message: "Something wrong occoured while sending email" };
  }
}
