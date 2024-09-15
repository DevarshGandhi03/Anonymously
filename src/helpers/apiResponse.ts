import { MessageInterface } from "@/models/userModel";


export interface ApiResponse{
    success:boolean,
    message:string,
    isAcceptingMessage?:boolean,
    messages?:[MessageInterface]
}