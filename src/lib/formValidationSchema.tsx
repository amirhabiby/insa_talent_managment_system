import { z } from "zod";

export const mentorSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  img: z.string().optional().nullable(),
  bloodType: z
    .string()
    .min(1, { message: "Blood Type is required!" })
    .optional()
    .nullable(),
  birthday: z.string().optional(),
  sex: z.enum(["MALE", "FEMALE"]).optional().nullable(),
  departmentId: z.string().optional().nullable(),
  maxStudents: z.number().int().optional().nullable(),
  currentStudents: z.number().int().optional().nullable(),
});

export type MentorSchema = z.infer<typeof mentorSchema>;
