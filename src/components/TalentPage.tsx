"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createTalentEnhanced, getTalentData } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import { RingLoader } from "react-spinners";

interface CertificateData {
  title: string;
  file?: File;
  fileUrl?: string;
  id?: number;
}

export default function TalentPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser(); //
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true); // Renamed for clarity vs Clerk's isLoaded
  const [certificates, setCertificates] = useState<CertificateData[]>([
    { title: "" },
  ]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const ageRef = useRef<HTMLInputElement>(null);
  const educationRef = useRef<HTMLInputElement>(null);
  const githubRef = useRef<HTMLInputElement>(null);
  const leetcodeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchTalent = async () => {
      if (isLoaded && isSignedIn && user?.id) {
        setIsLoadingData(true);
        try {
          const result = await getTalentData(user.id);
          if (result.success && result.data) {
            const talent = result.data;
            // Pre-fill form fields
            if (ageRef.current)
              ageRef.current.value = talent.age?.toString() || "";
            if (educationRef.current)
              educationRef.current.value = talent.education || "";
            if (githubRef.current)
              githubRef.current.value = talent.github || "";
            if (leetcodeRef.current)
              leetcodeRef.current.value = talent.leetcode || "";

            // Set image preview if an image exists
            if (talent.image) {
              setImagePreview(talent.image);
            }

            // Set existing certificates
            if (talent.certificates && talent.certificates.length > 0) {
              setCertificates(
                talent.certificates.map((cert) => ({
                  id: cert.id,
                  title: cert.title,
                  fileUrl: cert.fileUrl, // Display existing file URL
                  // file: undefined // No File object when fetching existing
                }))
              );
            } else {
              setCertificates([{ title: "" }]); // Ensure at least one empty cert input
            }
          }
        } catch (error) {
          console.error("Failed to fetch talent data:", error);
          // Optionally show an error message to the user
        } finally {
          setIsLoadingData(false);
        }
      } else if (isLoaded && !isSignedIn) {
        // Clerk loaded, but user is not signed in
        setIsLoadingData(false); // Stop data loading
        // Optionally redirect to sign-in page or show a message
        // router.push('/sign-in');
      }
    };

    fetchTalent();
  }, [isLoaded, isSignedIn, user?.id]); // Re-run when Clerk status or user ID changes

  const addCertificate = () => {
    setCertificates([...certificates, { title: "" }]);
  };

  const removeCertificate = (index: number) => {
    if (certificates.length > 1) {
      setCertificates(certificates.filter((_, i) => i !== index));
    } else {
      // If only one certificate remains, clear its content instead of removing the input
      setCertificates([{ title: "", file: undefined, fileUrl: undefined }]);
    }
  };

  const updateCertificate = (
    index: number,
    field: keyof CertificateData,
    value: string | File | undefined
  ) => {
    const updated = certificates.map((cert, i) =>
      i === index ? { ...cert, [field]: value } : cert
    );
    setCertificates(updated);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleCertificateFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    updateCertificate(index, "file", file);
    // Clear fileUrl if a new file is uploaded
    updateCertificate(index, "fileUrl", undefined);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Get userId from Clerk's user object
    const userId = "2767d208-dc9b-40ab-a035-8b2b56385dbf";

    if (!userId) {
      alert("You must be logged in to create or update a talent profile.");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData(e.currentTarget);
      // Pass userId as a string, which is now correct based on actions.ts
      const result = await createTalentEnhanced(formData, certificates, userId);

      if (result.success) {
        router.push("/dashboard/talent"); // Redirect to talent dashboard or profile page
      } else {
        alert(result.error || "Failed to create/update talent profile");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating/updating your profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Overall loading state (Clerk is still loading or our data is loading)
  if (!isLoaded || isLoadingData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <RingLoader color="#1E90FF" size={80} />
      </div>
    );
  }

  // If Clerk is loaded but user is not signed in
  if (!isSignedIn) {
    // Optionally redirect to your sign-in page or display a login prompt
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-blue-700">
          Please sign in to manage your talent profile.
        </p>
        {/* You could add a <SignInButton /> here from Clerk if desired */}
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue mb-4">
              Create/Update Your Talent Profile
            </h1>
            <p className="text-blue text-lg">
              Showcase your skills and achievements to potential mentors
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-blue mb-6">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Age Input */}
                <div>
                  <label
                    htmlFor="age"
                    className="block text-sm font-medium text-blue mb-2"
                  >
                    Age *
                  </label>
                  <input
                    ref={ageRef}
                    type="number"
                    id="age"
                    name="age"
                    min="1"
                    max="100"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue transition-colors"
                    placeholder="Enter your age"
                  />
                </div>

                {/* Education Input */}
                <div>
                  <label
                    htmlFor="education"
                    className="block text-sm font-medium text-blue mb-2"
                  >
                    Education
                  </label>
                  <input
                    ref={educationRef}
                    type="text"
                    id="education"
                    name="education"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue transition-colors"
                    placeholder="e.g., Bachelor's in Computer Science"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* GitHub Input */}
                <div>
                  <label
                    htmlFor="github"
                    className="block text-sm font-medium text-blue mb-2"
                  >
                    GitHub Profile
                  </label>
                  <input
                    ref={githubRef}
                    type="url"
                    id="github"
                    name="github"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue transition-colors"
                    placeholder="https://github.com/yourusername"
                  />
                </div>

                {/* LeetCode Input */}
                <div>
                  <label
                    htmlFor="leetcode"
                    className="block text-sm font-medium text-blue mb-2"
                  >
                    LeetCode Profile
                  </label>
                  <input
                    ref={leetcodeRef}
                    type="url"
                    id="leetcode"
                    name="leetcode"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue transition-colors"
                    placeholder="https://leetcode.com/yourusername"
                  />
                </div>
              </div>
            </div>

            {/* Profile Image Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-blue mb-6">
                Profile Image
              </h2>

              <div className="flex flex-col items-center space-y-4">
                {imagePreview && (
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500">
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="w-full max-w-md">
                  <input
                    ref={imageInputRef}
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="mt-2 text-sm text-blue text-center">
                    Upload a profile picture (JPG, PNG, or GIF - Max 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Certificates Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-blue">
                  Certificates & Achievements
                </h2>
                <button
                  type="button"
                  onClick={addCertificate}
                  className="bg-logopink text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <span>+</span>
                  <span>Add Certificate</span>
                </button>
              </div>

              <div className="space-y-6">
                {certificates.map((certificate, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-6 bg-white"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-blue">
                        Certificate {index + 1}
                      </h4>
                      {certificates.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCertificate(index)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue mb-2">
                          Certificate Title
                        </label>
                        <input
                          type="text"
                          value={certificate.title}
                          onChange={(e) =>
                            updateCertificate(index, "title", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue transition-colors"
                          placeholder="e.g., AWS Certified Solutions Architect"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-blue mb-2">
                          Certificate File
                        </label>
                        <input
                          type="file"
                          onChange={(e) =>
                            handleCertificateFileChange(index, e)
                          }
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="mt-2 text-sm text-blue">
                          Upload certificate file (PDF, JPG, PNG, DOC, DOCX -
                          Max 10MB)
                        </p>
                        {certificate.fileUrl && (
                          <p className="mt-1 text-sm text-gray-500">
                            Existing file:{" "}
                            <a
                              href={certificate.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View File
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-white py-4 px-6 rounded-lg shadow-lg bg-blue focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Saving Profile...</span>
                  </div>
                ) : (
                  "Save Talent Profile"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
