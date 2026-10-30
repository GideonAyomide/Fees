export interface EnquiryInput {
  parentPhone?: unknown;
  studentName?: unknown;
  message?: unknown;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitized?: {
    parentPhone: string;
    studentName: string;
    message: string;
  };
}

export function validateEnquiryInput(body: EnquiryInput): ValidationResult {
  const phone = typeof body.parentPhone === 'string' ? body.parentPhone.trim() : '';
  const name = typeof body.studentName === 'string' ? body.studentName.trim() : '';
  const msg = typeof body.message === 'string' ? body.message.trim() : '';

  // Phone validation: 7 to 20 characters
  if (!phone || phone.length < 7 || phone.length > 20) {
    return {
      isValid: false,
      error: 'A valid phone number is required (7 to 20 digits).',
    };
  }

  // Student name validation: 2 to 100 characters
  if (!name || name.length < 2 || name.length > 100) {
    return {
      isValid: false,
      error: 'Student name must be between 2 and 100 characters.',
    };
  }

  // Message validation: 5 to 1000 characters
  if (!msg || msg.length < 5 || msg.length > 1000) {
    return {
      isValid: false,
      error: 'Message must be between 5 and 1000 characters.',
    };
  }

  return {
    isValid: true,
    sanitized: {
      parentPhone: phone,
      studentName: name,
      message: msg,
    },
  };
}
