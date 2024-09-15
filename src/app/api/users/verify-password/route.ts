import User from "@/models/userModel";
import { connectDb } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await connectDb();
  const { username, verifyToken,newPassword,confirmPassword }: any = await request.json();
  // console.log(username);
  
  const user = await User.findOne({ username });
    
  if (!user) {
    return Response.json({
      success: false,
      message: "User not found",
    },{status:400});
  }
  if (newPassword!==confirmPassword) {
    return Response.json(
        { success: false, message: 'Confirm password should be same as new password' },
        { status: 400 }
      );
  }
  if (
    verifyToken===user.forgetPasswordToken &&
    user.forgetPasswordTokenExpiry >Date.now()
  ) {
    user.password=await bcrypt.hash(newPassword,10);
    await user.save()
    return Response.json(
        { success: true, message: 'Password updated successfully' },
        { status: 200 }
      );
  }else if (!(user.forgetPasswordTokenExpiry >Date.now())) {
    // Code has expired
    return Response.json(
      {
        success: false,
        message:
          'Verification code has expired. Please try again',
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
