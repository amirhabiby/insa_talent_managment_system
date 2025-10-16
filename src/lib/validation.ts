export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateFile(
  file: File,
  options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
  } = {}
): ValidationResult {
  const errors: string[] = [];
  const {
    maxSize = 5 * 1024 * 1024, // Default 5MB
    allowedTypes = ["image/jpeg", "image/png", "image/gif"], // Default image types
  } = options;

  if (file.size === 0) {
    errors.push("File is empty.");
  } else if (file.size > maxSize) {
    errors.push(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    errors.push(`File type must be one of: ${allowedTypes.join(", ")}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Moved from upload.ts, now uses the generic validateFile
export function validateCertificateFile(file: File): ValidationResult {
  // Changed return type to ValidationResult
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  ];

  return validateFile(file, {
    maxSize: 10 * 1024 * 1024, // 10MB for certificates
    allowedTypes,
  });
}

// Existing validation functions below (renamed validateImageFile to avoid conflict)

export function validateTalentForm(data: {
  age?: string;
  education?: string;
  github?: string;
  leetcode?: string;
}): ValidationResult {
  const errors: string[] = [];

  // Age validation
  if (data.age && data.age.trim() !== "") {
    // Add check for empty string
    const age = parseInt(data.age);
    if (isNaN(age) || age < 1 || age > 100) {
      errors.push("Age must be a number between 1 and 100");
    }
  }

  // GitHub URL validation
  if (data.github && data.github.trim()) {
    try {
      const url = new URL(data.github.trim()); // Use trimmed URL
      if (!url.hostname.includes("github.com")) {
        // Check hostname for github
        errors.push("Please enter a valid GitHub profile URL");
      }
    } catch {
      errors.push("Please enter a valid GitHub profile URL");
    }
  }

  // LeetCode URL validation
  if (data.leetcode && data.leetcode.trim()) {
    try {
      const url = new URL(data.leetcode.trim()); // Use trimmed URL
      if (!url.hostname.includes("leetcode.com")) {
        // Check hostname for leetcode
        errors.push("Please enter a valid LeetCode profile URL");
      }
    } catch {
      errors.push("Please enter a valid LeetCode profile URL");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateCertificateInput(data: {
  title: string;
  file?: File;
}): ValidationResult {
  const errors: string[] = [];

  if (!data.title.trim()) {
    errors.push("Certificate title is required");
  }

  if (data.file) {
    const fileValidation = validateCertificateFile(data.file);
    if (!fileValidation.valid) {
      errors.push(...fileValidation.errors); // Add all file-specific errors
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateImageFileInput(file: File): ValidationResult {
  const errors: string[] = [];
  const fileValidation = validateFile(file, {
    allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"], // Added webp as common image format
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  if (!fileValidation.valid) {
    errors.push(...fileValidation.errors);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
