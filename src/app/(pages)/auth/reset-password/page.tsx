"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useSearchParams, useRouter } from "next/navigation"
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
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters." }),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
})

type FormData = z.infer<typeof formSchema>

export default function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const resetCode = searchParams.get("resetCode") || ""
  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  })

  async function onSubmit(values: FormData) {
    try {
      const response = await apiServices.resetPassword({
        email,
        newPassword: values.newPassword,
        resetCode,
      })
      if (response.message === "success") {
        toast.success("Password reset successfully!")
        router.push("/auth/login")
      } else {
        toast.error(response.message || "Failed to reset password")
      }
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
      <p className="text-muted-foreground mb-6">Enter your new password for {email}.</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input placeholder="********" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input placeholder="********" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Resetting..." : "Reset Password"}
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
