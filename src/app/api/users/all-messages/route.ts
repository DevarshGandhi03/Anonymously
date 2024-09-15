import mongoose from 'mongoose';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import User  from '@/models/userModel';
import { connectDb as dbConnect } from '@/lib/db';

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user = session?.user;
    console.log(_user);
    
  
    if (!session || !_user) {
      return Response.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    const userId = new mongoose.Types.ObjectId(_user._id);
    try {
      const user = await User.aggregate([
        { $match: { _id: userId } },
        { $unwind: '$messages' },
        { $sort: { 'messages.createdAt': -1 } },
        { $group: { _id: '$_id', messages: { $push: '$messages' } } },
      ]).exec();
      console.log(user);
      
  
      if ( user.length === 0) {
        return Response.json(
          { message: 'No message to display', success: true },
          { status: 200}
        );
      }
      if (!user ) {
        return Response.json(
          { message: 'User not found', success: false },
          { status: 404 }
        );
      }
  
      return Response.json(
        { messages: user[0].messages },
        {
          status: 200,
        }
      );
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      return Response.json(
        { message: 'Internal server error', success: false },
        { status: 500 }
      );
    }
  }