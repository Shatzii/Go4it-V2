import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileUpload } from "@/components/ui/file-upload";

// Form schema with validation
const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50, { message: "First name must be less than 50 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(50, { message: "Last name must be less than 50 characters" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(30, { message: "Username must be less than 30 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  bio: z
    .string()
    .max(500, { message: "Bio must be less than 500 characters" })
    .optional(),
  profileImage: z.string().nullable().optional(),
  dateOfBirth: z.date().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface BasicInfoStepProps {
  data: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    bio: string;
    profileImage: string | null;
    dateOfBirth: Date | null;
  };
  updateData: (data: Partial<FormValues>) => void;
}

export default function BasicInfoStep({ data, updateData }: BasicInfoStepProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      bio: data.bio || "",
      profileImage: data.profileImage,
      dateOfBirth: data.dateOfBirth,
    },
  });

  // When form values change, update parent component's state
  const onValuesChange = (values: Partial<FormValues>) => {
    updateData(values);
  };

  // Handle profile image upload
  const handleImageUpload = (url: string) => {
    form.setValue("profileImage", url);
    updateData({ profileImage: url });
  };

  const getInitials = () => {
    const first = form.getValues("firstName").charAt(0);
    const last = form.getValues("lastName").charAt(0);
    return (first + last).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Basic Information</h2>
      <p className="text-muted-foreground">
        Tell us about yourself so coaches and teammates can identify you.
      </p>

      <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={form.getValues("profileImage") || ""}
            alt="Profile picture"
          />
          <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <FileUpload
            endpoint="profileImage"
            onUploadComplete={handleImageUpload}
            allowedFileTypes={["image/jpeg", "image/png", "image/webp"]}
            maxSize={5 * 1024 * 1024} // 5MB
          >
            <Button variant="outline" className="w-full sm:w-auto">
              {form.getValues("profileImage")
                ? "Change Profile Picture"
                : "Upload Profile Picture"}
            </Button>
          </FileUpload>
          <p className="mt-2 text-xs text-muted-foreground">
            Recommended: Square JPG, PNG, or WebP image less than 5MB
          </p>
        </div>
      </div>

      <Form {...form}>
        <form
          onChange={() => onValuesChange(form.getValues())}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe123" {...field} />
                </FormControl>
                <FormDescription>
                  Your unique username for the platform.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john.doe@example.com"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  We'll use this for account notifications.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a bit about yourself..."
                    className="min-h-[120px] resize-y"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Coaches and teammates will see this on your profile.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}