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
  resetCode: z.string().min(4, { message: "Reset code must be at least 4 digits." }),
})

type FormData = z.infer<typeof formSchema>

export default function VerifyResetForm() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resetCode: "",
    },
  })

  async function onSubmit(values: FormData) {
    try {
      const response = await apiServices.verifyResetCode(email, values.resetCode)
      if (response.message === "success") {
        toast.success("Code verified! Now reset your password.")
        router.push(`/auth/reset-password?email=${encodeURIComponent(email)}&resetCode=${values.resetCode}`)
      } else {
        toast.error(response.message || "Invalid reset code")
      }
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Verify Reset Code</h1>
      <p className="text-muted-foreground mb-6">Enter the code sent to {email}.</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="resetCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reset Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter 4-digit code" type="text" maxLength={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Verifying..." : "Verify Code"}
          </Button>
        </form>
      </Form>
      <p className="text-center mt-4 text-sm text-muted-foreground">
        <a href="/auth/forgot-password" className="text-primary hover:underline">
          Back to Forgot Password
        </a>
      </p>
    </div>
  )
}
