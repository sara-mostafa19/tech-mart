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
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"


const formSchema = z.object({
  email: z.string(),
  password: z.string()
  
})

export default function ProfileForm() {
  const form= useForm();
  const router= useRouter()



  async function onSubmit(values:any){
   try{
     const response=await signIn("credentials", {
      email: values.email,
      password:values.password,
      redirect:false
    })
    if(response?.ok){
      router.push("/products")
    }
  }catch(error){
    alert(JSON.stringify(error))
  }
    
  }

  return (
<div className="max-w-2xl mx-auto my-12">
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your-email@example.com" type="email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="********" type="password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
</div>
  )
}