"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { Input } from "@/components/ui/input"
import axios, { AxiosError } from "axios"
import { useToast } from "@/hooks/use-toast";
import { useState } from "react"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  email: z
  .string()
  .email({ message: "Please enter a valid email adderess" })
  .regex(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    "Please enter a valid email adderess"
  )
})

export default function ProfileForm() {

  const [loading, setLoading] = useState(false)
  const { toast } = useToast();
  const form=useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues:{
        email:" "
    }
  })

  const onSubmit=async (data:z.infer<typeof formSchema>)=>{

    try {
      setLoading(true)
      const response=await axios.post("/api/users/forgot-password",data)
      // console.log(response);
      
      toast({
        title: 'Success',
        description: response.data.message,
      });
      
    } catch (error) {
      // console.log(error);
      
      setLoading(true)
      const axiosError:any = error as AxiosError;

      let errorMessage = axiosError.response?.data.message;
      
      toast({
        title:"Something went wrong",
        description:errorMessage,
        variant:"destructive"
      })
    }finally{
      setLoading(false)
    }
    
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email" {...field} />
              </FormControl>
              <FormMessage></FormMessage>
            </FormItem>
          )}
        />
        <Button className="" type="submit" disabled={loading}>
             
             {loading?(<>
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                 Please wait
               </>):(
                 "Submit"
               )}
           </Button>
      </form>
    </Form>
  )
}
