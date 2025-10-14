"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
})

type FormData = z.infer<typeof formSchema>

export default function LoginForm() {
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: FormData) {
    try {
      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      })
      console.log("Sign in response:", response);
      if (response?.ok) {
        toast.success("Logged in successfully!")
        setIsRedirecting(true)
        setTimeout(() => router.push("/products"), 500)
      } else {
        toast.error("Invalid credentials")
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during login")
    } finally {
      form.reset()
    }
  }

  if (isRedirecting) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md flex flex-col items-center justify-center min-h-[400px]">
        <LoadingSpinner />
        <p className="mt-4 text-lg">Redirecting to products...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Sign In</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your-email@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
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
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner />
                <span className="ml-2">Signing In...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>
      <p className="text-center mt-4 text-sm text-muted-foreground">
        Don't have an account?{" "}
        <a href="/auth/register" className="text-primary hover:underline">
          Sign up
        </a>
      </p>
      <p className="text-center mt-2 text-sm text-muted-foreground">
        <a href="/auth/forgot-password" className="text-primary hover:underline">
          Forgot password?
        </a>
      </p>
    </div>
  )
}
