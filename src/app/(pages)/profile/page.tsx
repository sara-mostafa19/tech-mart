"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useSession } from "next-auth/react"
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

const updateDataSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
})

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(6, { message: "Current password must be at least 6 characters." }),
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters." }),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
})

type UpdateDataForm = z.infer<typeof updateDataSchema>
type UpdatePasswordForm = z.infer<typeof updatePasswordSchema>

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()

  if (!session) {
    router.push("/auth/login")
    return null
  }

  const user = session.user

  // Update User Data Form
  const dataForm = useForm<UpdateDataForm>({
    resolver: zodResolver(updateDataSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
    },
  })

  async function onUpdateData(values: UpdateDataForm) {
    try {
      const response = await apiServices.updateLoggedUserData(values)
      if (response.message === "success") {
        toast.success("Profile updated successfully!")
        update({ user: { ...user, ...values } })
      } else {
        toast.error(response.message || "Failed to update profile")
      }
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  // Update Password Form
  const passwordForm = useForm<UpdatePasswordForm>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  })

  async function onUpdatePassword(values: UpdatePasswordForm) {
    try {
      const response = await apiServices.updateLoggedUserPassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
      if (response.message === "success") {
        toast.success("Password updated successfully!")
        passwordForm.reset()
      } else {
        toast.error(response.message || "Failed to update password")
      }
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      
      {/* User Info */}
      <div className="bg-muted p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-2">Current Info</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      {/* Update Data Form */}
      <div className="space-y-8 mb-8">
        <h2 className="text-2xl font-semibold">Update Profile</h2>
        <Form {...dataForm}>
          <form onSubmit={dataForm.handleSubmit(onUpdateData)} className="space-y-6">
            <FormField
              control={dataForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={dataForm.control}
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
            <Button type="submit" className="w-full" disabled={dataForm.formState.isSubmitting}>
              {dataForm.formState.isSubmitting ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </Form>
      </div>

      {/* Update Password Form */}
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold">Change Password</h2>
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onUpdatePassword)} className="space-y-6">
            <FormField
              control={passwordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input placeholder="********" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
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
              control={passwordForm.control}
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
            <Button type="submit" className="w-full" disabled={passwordForm.formState.isSubmitting}>
              {passwordForm.formState.isSubmitting ? "Updating..." : "Change Password"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
