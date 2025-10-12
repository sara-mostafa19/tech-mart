"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { apiServices } from "@/services/api"

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
})

type FormData = z.infer<typeof formSchema>

export default function ForgotPasswordForm() {
  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: FormData) {
    try {
      const response = await apiServices.forgotPassword(values.email)
      if (response.message === "success") {
        toast.success("Reset code sent to your email!")
        router.push(`/auth/verify-reset?email=${encodeURIComponent(values.email)}`)
      } else {
        toast.error(response.message || "Failed to send reset code")
      }
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
      <p className="text-muted-foreground mb-6">Enter your email to receive a reset code.</p>
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
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Sending..." : "Send Reset Code"}
          </Button>
        </form>
      </Form>
      <p className="text-center mt-4 text-sm text-muted-foreground">
        <a href="/auth/login" className="text-primary hover:underline">
          Back to Login
        </a>
      </p>
    </div>
  )
}
