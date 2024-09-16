import { z } from "zod";
import User from "@/models/userModel";
import { connectDb } from "@/lib/db";
import { usernameValidation } from "@/schemas/signupSchema";

const UserNameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await connectDb();

  try {
    
    const { searchParams }: any = new URL(request.url);

    const queryParams = {
      username: searchParams.get("username"),
    };

    console.log(queryParams);
    

    const result = UserNameQuerySchema.safeParse(queryParams);
    
    
    if (!result.success) {
      const resultError = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message: resultError || "Please enter a valid username",
        },
        { status: 400 }
      );
    }

    const { username } = result.data!;
 
    

    const existingUser = await User.findOne({ username, isVerified: true });
    
    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        { status: 200 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username:", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
