"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { useState } from "react"
import { error } from "console"

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

export default function Verify() {
  const {username}= useParams();
  const router = useRouter();
  const [responseMessage,setResponseMessage]=useState()
  


  





  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data.pin);
    
   try {
     const response = await axios.post("/api/users/verify-code",{code:data.pin,username})
     console.log(response);
     
     setResponseMessage(response.data.message)
 
     toast({
       title: "Success",
       description: response.data.message,
       
     })

     router.replace("/sign-in")
   } catch (error:any) {
    const axiosError= error.response?.data.message ?? 'Error verifying code'
    
    toast({
      title: 'Verification Failed',
      description: axiosError,
      variant: 'destructive',
    });
   }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
      <FormField
        control={form.control}
        name="pin"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xl font-extrabold tracking-tight lg:text-xl mb-6"> Verify Your Account</FormLabel>
            <FormControl>
              <InputOTP maxLength={6} {...field}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </FormControl>
            <FormDescription>
            Enter the verification code sent to your email
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button type="submit">Submit</Button>
    </form>
  </Form>
    </div>
</div>
   
   
  )
}
