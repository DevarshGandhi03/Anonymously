import User from "@/models/userModel";
// import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { connectDb } from "@/lib/db";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/mailer/mail";

export async function POST(request: Request) {
  await connectDb();
  try {
    const { username, email, password } = await request.json();

    const existingVerifiedUserByUsername = await User.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const existingUserByEmail = await User.findOne({email});
    
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else {
        
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyToken = otp;
        existingUserByEmail.verifyTokenExpiry = Date.now() + 300000;
        await existingUserByEmail.save();
      }
    } else {
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = Date.now() + 300000;

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        verifyToken: otp,
        verifyTokenExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      await newUser.save();
     
    }
    
     // Now sending the verification email
     const response = await sendVerificationEmail(email, username, otp);
     
     if (!response.success) {
       return Response.json(
         {
           success: false,
           message: response.message,
         },
         { status: 500 }
       );
     }
     
     return Response.json(
       {
         success: true,
         message: "User registered successfully. Please verify your account.",
       },
       { status: 201 }
     );
  } catch (error) {
    return Response.json(
      {
        message: "Something went wrong while registering the user",
        success: false,
        error,
      },
      { status: 400 }
    );
  }
}
