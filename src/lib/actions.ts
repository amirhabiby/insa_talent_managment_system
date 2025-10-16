"use server";

import { PrismaClient } from "@/generated/prisma";
import { revalidatePath } from "next/cache";
import { uploadFile } from "@/lib/upload";

import { validateFile, validateCertificateFile } from "@/lib/validation";

const prisma = new PrismaClient();

interface CertificateData {
  title: string;
  file?: File;
}

export async function createTalentEnhanced(
  formData: FormData,
  certificates: CertificateData[],
  userId: string
) {
  try {
    // Extract form data
    const age = formData.get("age") as string;
    const education = formData.get("education") as string;
    const github = formData.get("github") as string;
    const leetcode = formData.get("leetcode") as string;
    const imageFile = formData.get("image") as File;

    // Handle image upload
    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      const validation = validateFile(imageFile);
      if (!validation.valid) {
        return { success: false, error: validation.errors };
      }

      try {
        imageUrl = await uploadFile(imageFile, "uploads/talents");
      } catch (error) {
        return { success: false, error: "Failed to upload image file" };
      }
    }

    // Check if talent already exists for this user
    // No need for String(userId) here anymore, as userId is already a string
    const existingTalent = await prisma.talent.findUnique({
      where: { userId: userId },
    });

    let talent;
    if (existingTalent) {
      // Update existing talent
      talent = await prisma.talent.update({
        where: { id: existingTalent.id },
        data: {
          age: age ? parseInt(age) : null,
          education: education || null,
          github: github || null,
          leetcode: leetcode || null,
          image: imageUrl || existingTalent.image,
        },
      });
    } else {
      // Create new talent
      talent = await prisma.talent.create({
        data: {
          // No need for String(userId) here anymore, as userId is already a string
          userId: userId,
          age: age ? parseInt(age) : null,
          education: education || null,
          github: github || null,
          leetcode: leetcode || null,
          image: imageUrl,
        },
      });
    }

    // Handle certificates with file uploads
    if (certificates.length > 0) {
      // Delete existing certificates for this talent
      await prisma.certificate.deleteMany({
        where: { talentId: talent.id },
      });

      // Process each certificate
      for (const certData of certificates) {
        // Only process if either title is present OR a file is provided.
        // It's better to ensure a file is present if the intention is to upload one.
        // If you only want to create a record if both are present:
        if (certData.title.trim() && certData.file) {
          // Validate certificate file
          const validation = validateCertificateFile(certData.file);
          if (!validation.valid) {
            return {
              success: false,
              error: `Certificate validation failed for '${certData.title}': ${validation.errors}`,
            };
          }

          // Upload certificate file
          try {
            const fileUrl = await uploadFile(
              certData.file,
              "uploads/certificates"
            );

            // Create certificate record
            await prisma.certificate.create({
              data: {
                talentId: talent.id,
                title: certData.title,
                fileUrl: fileUrl,
              },
            });
          } catch (error) {
            return {
              success: false,
              error: `Failed to upload certificate file for '${certData.title}'`,
            };
          }
        } else if (certData.title.trim() && !certData.file) {
          // Optionally handle case where title is present but file is not.
          // For now, we'll just skip creating a certificate if no file.
          // You might want to create a certificate with just a title and null fileUrl if that's a valid state.
          console.warn(
            `Certificate '${certData.title}' has no file, skipping file upload.`
          );
        }
      }
    }

    revalidatePath("/talent");

    return { success: true, talentId: talent.id };
  } catch (error) {
    console.error("Error creating/updating talent:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  } finally {
    // Only disconnect if `prisma` is a new instance created for each call,
    // otherwise, it's generally better to let the global instance manage connections.
    // If you're using `const prisma = new PrismaClient();` inside each action,
    // then disconnecting is fine. If you have a singleton, remove this.
    await prisma.$disconnect();
  }
}

// Function to get talent data for editing
export async function getTalentData(userId: string) {
  // <--- CHANGE THIS TO 'string' as well
  try {
    const talent = await prisma.talent.findUnique({
      where: { userId: userId }, // No need for String(userId)
      include: {
        certificates: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return { success: true, data: talent };
  } catch (error) {
    console.error("Error fetching talent data:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch talent data",
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Function to delete a certificate
export async function deleteCertificate(certificateId: number) {
  // certificateId is an Int (@id @default(autoincrement())) in your schema
  // so `number` here is correct.
  try {
    await prisma.certificate.delete({
      where: { id: certificateId },
    });

    revalidatePath("/talent");
    return { success: true };
  } catch (error) {
    console.error("Error deleting certificate:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete certificate",
    };
  } finally {
    await prisma.$disconnect();
  }
}
