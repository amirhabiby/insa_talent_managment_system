"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { MentorSchema } from "./formValidationSchema";
import { prisma } from "./prisma";

type CurrentState = { success: boolean; error: boolean; message?: string };

export const createMentor = async (
  currentState: CurrentState,
  data: MentorSchema
) => {
  try {
    const client = await clerkClient();

    const user = await client.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "mentor" },

      emailAddress: data.email && data.email !== "" ? [data.email] : undefined,
    });

    await prisma.mentor.create({
      data: {
        id: user.id,
        name: data.name,
        surname: data.surname,
        email: data.email ?? "",
        phone: data.phone || null,
        address: data.address || null,
        image: data.img || null,
        bloodType: data.bloodType || null,
        sex: data.sex || null,

        departmentId: data.departmentId || null,
        maxStudents: data.maxStudents || null,
        currentStudents: data.currentStudents || null,
        birthday: data.birthday || null,
        userId: user.id,
      },
    });

    return {
      success: true,
      error: false,
      message: "Mentor created successfully!",
    };
  } catch (err: any) {
    console.error("Error creating mentor:", err);

    if (err.clerkError && Array.isArray(err.errors)) {
      err.errors.forEach((e: any) => {
        console.error(
          `Clerk Error - Code: ${e.code}, Message: ${e.message}, Field: ${e.meta?.param}`
        );
      });
      return {
        success: false,
        error: true,
        message: err.errors[0]?.longMessage || "Clerk validation failed.",
      };
    }

    return {
      success: false,
      error: true,
      message: `Failed to create mentor: ${err.message || "Unknown error"}`,
    };
  }
};

export const updateMentor = async (
  currentState: CurrentState,
  data: MentorSchema
) => {
  if (!data.id) {
    console.error("Mentor ID is missing for update.");
    return {
      success: false,
      error: true,
      message: "Mentor ID is required for update.",
    };
  }

  try {
    const client = await clerkClient();

    await client.users.updateUser(data.id, {
      username: data.username,
      ...(data.password && data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    const updateData: { [key: string]: any } = {
      name: data.name,
      surname: data.surname,
      email: data.email === "" || data.email === undefined ? null : data.email,
      phone: data.phone === "" || data.phone === undefined ? null : data.phone,
      address:
        data.address === "" || data.address === undefined ? null : data.address,
      image: data.img === "" || data.img === undefined ? null : data.img,

      bloodType: data.bloodType ?? null,
      sex: data.sex ?? null,

      departmentId:
        data.departmentId === "" || data.departmentId === undefined
          ? null
          : data.departmentId,
      maxStudents: data.maxStudents ?? null,
      currentStudents: data.currentStudents ?? null,
      birthday: data.birthday ?? null,
    };

    await prisma.mentor.update({
      where: {
        id: data.id,
      },
      data: updateData,
    });

    return {
      success: true,
      error: false,
      message: "Mentor updated successfully!",
    };
  } catch (err: any) {
    console.error("Error updating mentor:", err);

    if (err.clerkError && Array.isArray(err.errors)) {
      err.errors.forEach((e: any) => {
        console.error(
          `Clerk Error - Code: ${e.code}, Message: ${e.message}, Field: ${e.meta?.param}`
        );
      });
      return {
        success: false,
        error: true,
        message:
          err.errors[0]?.longMessage ||
          "Clerk validation failed during update.",
      };
    }

    return {
      success: false,
      error: true,
      message: `Failed to update mentor: ${err.message || "Unknown error"}`,
    };
  }
};

export const deleteMentor = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string | null;

  if (!id) {
    console.error("Mentor ID is missing for deletion.");
    return {
      success: false,
      error: true,
      message: "Mentor ID is required for deletion.",
    };
  }

  try {
    const client = await clerkClient();

    await client.users.deleteUser(id);

    await prisma.mentor.delete({
      where: {
        id: id,
      },
    });

    return {
      success: true,
      error: false,
      message: "Mentor deleted successfully!",
    };
  } catch (err: any) {
    console.error("Error deleting mentor:", err);

    if (err.clerkError && Array.isArray(err.errors)) {
      err.errors.forEach((e: any) => {
        console.error(
          `Clerk Error - Code: ${e.code}, Message: ${e.message}, Field: ${e.meta?.param}`
        );
      });
      return {
        success: false,
        error: true,
        message:
          err.errors[0]?.longMessage ||
          "Clerk validation failed during deletion.",
      };
    }

    return {
      success: false,
      error: true,
      message: `Failed to delete mentor: ${err.message || "Unknown error"}`,
    };
  }
};
