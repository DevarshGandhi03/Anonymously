import User from "@/models/userModel";
import { connectDb } from "@/lib/db";
import { use } from "react";

export async function POST(request: Request) {
  await connectDb();
  // console.log("ave to che ");
  

  const { username, code } = await request.json();

  const user = await User.findOne({ username });
// console.log(user);

  if (!user) {
    return Response.json({
      success: false,
      message: "User not found",
    });
  }

  if (
    user.verifyToken === code &&
    user.verifyTokenExpiry >Date.now()
  ) {
    user.isVerified=true;
    await user.save()
    return Response.json(
        { success: true, message: 'Account verified successfully' },
        { status: 200 }
      );
  }else if (!(user.verifyTokenExpiry >Date.now())) {
    // Code has expired
    return Response.json(
      {
        success: false,
        message:
          'Verification code has expired. Please sign up again to get a new code.',
      },
      { status: 400 }
    );
  }else {
    // Code is incorrect
    return Response.json(
      { success: false, message: 'Incorrect verification code' },
      { status: 400 }
    );
  }
}
