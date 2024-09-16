import User from "@/models/userModel";
import { connectDb } from "@/lib/db";
import { sendVerificationEmail } from "@/mailer/forgotMail";
import { use } from "react";

export async function POST(request: Request) {
  await connectDb();
  const { email } = await request.json();

  const user = await User.findOne({ email });
  if (!user) {
    return Response.json(
      {
        success: false,
        message: "User does not exists with this email address",
      },
      { status: 400 }
    );
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedOtpExpiry: number = Date.now() + 300000;

  user.forgetPasswordToken = otp;
  user.forgetPasswordTokenExpiry = hashedOtpExpiry;
  const res = await user.save();

  if (!res) {
    return Response.json(
      {
        success: false,
        message: "Something wrong occoured while forgotting password",
      },
      { status: 400 }
    );
  }

  const link =
    "https://anonymously-ochre.vercel.app/new-password" +
    "?forgetPasswordToken=" +
    otp +
    "&username=" +
    user.username;
  await sendVerificationEmail(email, link, user.username);
  return Response.json(
    {
      success: true,
      message: "Click on link sent to your registered email to make a new password",
    },
    { status: 200 }
  );
}
