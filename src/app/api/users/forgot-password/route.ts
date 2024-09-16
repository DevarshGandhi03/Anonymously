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
  if ((user?.ResendforgetPasswordTokenExpiry>Date.now())) {
    return Response.json(
      {
        success: false,
        message: "Email already sent please try again after 3 minutes",
      },
      { status: 400 }
    );
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedOtpExpiry: number = Date.now() + 300000;

  user.forgetPasswordToken = otp;
  user.forgetPasswordTokenExpiry = hashedOtpExpiry;
  user.ResendforgetPasswordTokenExpiry=Date.now() + 180000;
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
    request.url.replace("api/users/forgot-password", "new-password") +
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
