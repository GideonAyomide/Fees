'use client';

import { useState, useEffect, FormEvent, ChangeEvent, FocusEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type AuthMode = 'login' | 'activate' | 'reset';

interface FormErrors {
  phone?: string;
  email?: string;
  pin?: string;
  studentId?: string;
  slipCode?: string;
  terms?: string;
}

export function AuthUnifiedForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial mode from URL search param ?mode=... (default to 'login')
  const initialMode = (searchParams.get('mode') as AuthMode) || 'login';
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Form Fields
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [studentId, setStudentId] = useState('');
  const [slipCode, setSlipCode] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Field Touched State (for Category 1: empty field on blur)
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [disabledButtonClickReason, setDisabledButtonClickReason] = useState<string | null>(null);

  // Keep internal state synced when URL changes
  useEffect(() => {
    const urlMode = searchParams.get('mode') as AuthMode;
    if (urlMode && (urlMode === 'login' || urlMode === 'activate' || urlMode === 'reset')) {
      setMode(urlMode);
    }
  }, [searchParams]);

  // Mode Switcher (Updates URL without page reload)
  const handleModeSwitch = (newMode: AuthMode) => {
    setMode(newMode);
    setStatusMessage(null);
    setDisabledButtonClickReason(null);
    setErrors({});
    setTouched({});
    router.replace(`/auth?mode=${newMode}`, { scroll: false });
  };

  // Validation Logic
  // Category 1 (Empty on blur), Category 2 (Length/Structure), Category 3 (Format)
  const validateField = (name: string, value: string | boolean): string | undefined => {
    if (typeof value === 'string') {
      const trimmed = value.trim();

      if (name === 'phone') {
        if (!trimmed) return 'Phone number cannot be left blank.';
        // Digits only check (text input with numeric enforcement)
        if (!/^\d+$/.test(trimmed)) return 'Phone number must contain numbers only.';
        if (trimmed.length < 10 || trimmed.length > 11) return 'Phone number must be 10 or 11 digits.';
      }

      if (name === 'email') {
        if (!trimmed) return 'Email address cannot be left blank.';
        // The valid shape is a string, then an at character, then a domain (Category 3)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) {
          return 'Please enter a valid email address (e.g. parent@example.com).';
        }
      }

      if (name === 'pin') {
        if (!trimmed) return 'Security PIN cannot be left blank.';
        if (!/^\d+$/.test(trimmed)) return 'PIN must contain digits only.';
        if (trimmed.length !== 4) return 'PIN must be exactly 4 digits.';
      }

      if (name === 'studentId' && mode === 'activate') {
        if (!trimmed) return 'Student ID cannot be left blank.';
        if (trimmed.length < 4) return 'Student ID must be at least 4 characters.';
      }

      if (name === 'slipCode' && mode === 'activate') {
        if (!trimmed) return 'Slip activation code cannot be left blank.';
        if (!/^\d+$/.test(trimmed)) return 'Slip code must contain numbers only.';
        if (trimmed.length !== 6) return 'Slip code must be exactly 6 digits.';
      }
    }

    if (name === 'terms' && mode === 'activate') {
      if (!value) return 'You must accept the terms to activate your account.';
    }

    return undefined;
  };

  // Real-time validation on change for Activation/Registration (Category 3 rule)
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Restrict input to digits only (Step 4: text input instead of number input)
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 11);
    setPhone(cleaned);
    if (mode === 'activate' && touched.phone) {
      setErrors((prev) => ({ ...prev, phone: validateField('phone', cleaned) }));
    }
    setDisabledButtonClickReason(null);
  };

  // Category 3: Asymmetric email format validation
  // Real-time on registration (activate); on-submit on login to avoid premature nagging
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    setDisabledButtonClickReason(null);

    if (mode === 'activate') {
      if (val.length > 0) {
        setErrors((prev) => ({ ...prev, email: validateField('email', val) }));
      } else if (touched.email) {
        setErrors((prev) => ({ ...prev, email: 'Email address cannot be left blank.' }));
      } else {
        setErrors((prev) => ({ ...prev, email: undefined }));
      }
    } else {
      if (errors.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) {
        setErrors((prev) => ({ ...prev, email: undefined }));
      }
    }
  };

  const handlePinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(cleaned);
    if (touched.pin) {
      setErrors((prev) => ({ ...prev, pin: validateField('pin', cleaned) }));
    }
    setDisabledButtonClickReason(null);
  };

  const handleSlipCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 6);
    setSlipCode(cleaned);
    if (touched.slipCode) {
      setErrors((prev) => ({ ...prev, slipCode: validateField('slipCode', cleaned) }));
    }
    setDisabledButtonClickReason(null);
  };

  // Blur handler: Category 1 (Empty fields error when focused and left without typing)
  const handleBlur = (field: string, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Determine if form is completely valid
  const isLoginFormValid = Boolean(
    phone.length >= 10 &&
    pin.length === 4 &&
    !errors.phone &&
    !errors.pin
  );
  const isActivateFormValid = Boolean(
    phone.length >= 10 &&
    email.trim().length > 0 &&
    studentId.trim().length >= 4 &&
    slipCode.length === 6 &&
    acceptTerms &&
    !errors.phone &&
    !errors.email &&
    !errors.studentId &&
    !errors.slipCode &&
    !errors.terms
  );
  const isResetFormValid = Boolean(
    phone.length >= 10 &&
    email.trim().length > 0 &&
    !errors.phone &&
    !errors.email
  );

  const isFormValid =
    mode === 'login' ? isLoginFormValid : mode === 'activate' ? isActivateFormValid : isResetFormValid;

  // Trigger complete validation across all fields and explain blockers (Step 7)
  const triggerValidationAndExplain = () => {
    // 1. Mark all fields as touched for active mode
    if (mode === 'login') {
      setTouched({
        phone: true,
        pin: true,
      });
    } else if (mode === 'activate') {
      setTouched({
        phone: true,
        email: true,
        studentId: true,
        slipCode: true,
        terms: true,
      });
    } else {
      setTouched({
        phone: true,
        email: true,
      });
    }

    // 2. Validate every relevant field for the current active mode
    const newErrors: FormErrors = {};
    const phoneErr = validateField('phone', phone);
    if (phoneErr) newErrors.phone = phoneErr;

    if (mode === 'login') {
      const pinErr = validateField('pin', pin);
      if (pinErr) newErrors.pin = pinErr;
    } else if (mode === 'activate') {
      const emailErr = validateField('email', email);
      if (emailErr) newErrors.email = emailErr;

      const studentErr = validateField('studentId', studentId);
      if (studentErr) newErrors.studentId = studentErr;

      const slipErr = validateField('slipCode', slipCode);
      if (slipErr) newErrors.slipCode = slipErr;

      const termsErr = validateField('terms', acceptTerms);
      if (termsErr) newErrors.terms = termsErr;
    } else if (mode === 'reset') {
      const emailErr = validateField('email', email);
      if (emailErr) newErrors.email = emailErr;
    }

    setErrors(newErrors);

    // 3. Set top-level explanatory alert banner
    if (mode === 'activate' && !acceptTerms) {
      setDisabledButtonClickReason('Please review and accept the Terms & Conditions before activating.');
    } else if (phoneErr) {
      setDisabledButtonClickReason(phoneErr);
    } else if (mode === 'login' && newErrors.pin) {
      setDisabledButtonClickReason(newErrors.pin);
    } else if (mode === 'activate' && newErrors.email) {
      setDisabledButtonClickReason(newErrors.email);
    } else if (mode === 'activate' && newErrors.slipCode) {
      setDisabledButtonClickReason(newErrors.slipCode);
    } else if (mode === 'activate' && newErrors.studentId) {
      setDisabledButtonClickReason(newErrors.studentId);
    } else if (mode === 'reset' && newErrors.email) {
      setDisabledButtonClickReason(newErrors.email);
    } else {
      setDisabledButtonClickReason('Please complete all required fields correctly to proceed.');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      triggerValidationAndExplain();
      return;
    }

    if (mode === 'login') {
      setStatusMessage({ text: 'Verifying credentials with school records...', type: 'success' });
    } else if (mode === 'activate') {
      setStatusMessage({ text: 'Account activated successfully! You may now sign in with your PIN.', type: 'success' });
    } else {
      setStatusMessage({ text: 'A verification code has been dispatched to your registered phone.', type: 'success' });
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem 1rem',
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-on-surface)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '28.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {/* Navigation & Institutional Header */}
        <header style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link
            href="/"
            className="text-label-medium"
            style={{
              color: 'var(--color-primary)',
              textDecoration: 'none',
              alignSelf: 'flex-start',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            ← Back to Home
          </Link>
          <span
            className="text-label-medium"
            style={{
              color: 'var(--color-on-surface-variant)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Crown Heights Academy
          </span>
          <h1 className="text-headline-medium" style={{ margin: 0 }}>
            {mode === 'login' && 'Parent Sign In'}
            {mode === 'activate' && 'Activate Account'}
            {mode === 'reset' && 'Reset Security PIN'}
          </h1>
          <p className="text-body-medium" style={{ color: 'var(--color-on-surface-variant)', margin: 0 }}>
            {mode === 'login' && 'Access verified balances and official school receipts.'}
            {mode === 'activate' && 'First-time setup using your printed bursar slip code.'}
            {mode === 'reset' && 'Recover access to your registered student records.'}
          </p>
        </header>

        {/* Tab Switcher (Step 1: Zero Reload URL Query Parameter Switching) */}
        <div
          role="tablist"
          style={{
            display: 'flex',
            backgroundColor: 'var(--color-surface-container)',
            borderRadius: '0.5rem',
            padding: '0.25rem',
            border: '1px solid var(--color-outline-variant)',
          }}
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            onClick={() => handleModeSwitch('login')}
            className="text-label-medium"
            style={{
              flex: 1,
              padding: '0.5rem 0.75rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: mode === 'login' ? 'var(--color-primary)' : 'transparent',
              color: mode === 'login' ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
              transition: 'background-color 0.15s ease',
            }}
          >
            Sign In
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={mode === 'activate'}
            onClick={() => handleModeSwitch('activate')}
            className="text-label-medium"
            style={{
              flex: 1,
              padding: '0.5rem 0.75rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: mode === 'activate' ? 'var(--color-primary)' : 'transparent',
              color: mode === 'activate' ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
              transition: 'background-color 0.15s ease',
            }}
          >
            Activate
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={mode === 'reset'}
            onClick={() => handleModeSwitch('reset')}
            className="text-label-medium"
            style={{
              flex: 1,
              padding: '0.5rem 0.75rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: mode === 'reset' ? 'var(--color-primary)' : 'transparent',
              color: mode === 'reset' ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
              transition: 'background-color 0.15s ease',
            }}
          >
            Reset PIN
          </button>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div
            role="status"
            style={{
              padding: '1rem',
              borderRadius: '0.5rem',
              backgroundColor: statusMessage.type === 'success' ? 'var(--color-surface-container)' : '#FEF2F2',
              border: `1px solid ${statusMessage.type === 'success' ? 'var(--color-primary)' : 'var(--color-error)'}`,
              color: statusMessage.type === 'success' ? 'var(--color-primary)' : 'var(--color-error)',
              fontSize: '0.875rem',
              lineHeight: 1.4,
            }}
          >
            {statusMessage.text}
          </div>
        )}

        {/* Explanatory Disabled Reason Alert (Step 7) */}
        {disabledButtonClickReason && (
          <div
            role="alert"
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              backgroundColor: '#FEF3C7',
              border: '1px solid #F59E0B',
              color: '#92400E',
              fontSize: '0.8125rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>⚠️</span>
            <span>{disabledButtonClickReason}</span>
          </div>
        )}

        {/* The Unified Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            backgroundColor: 'var(--color-surface-container)',
            borderRadius: '0.75rem',
            border: '1px solid var(--color-outline-variant)',
          }}
        >
          {/* Field: Parent Phone (Text input with numeric inputMode, Step 4) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <label htmlFor="phone" className="text-label-medium">
              Parent Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              inputMode="numeric"
              required
              aria-required="true"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              value={phone}
              onChange={handlePhoneChange}
              onBlur={(e) => handleBlur('phone', e.target.value)}
              style={{
                padding: '0.625rem 0.75rem',
                borderRadius: '0.375rem',
                border: `1px solid ${errors.phone ? 'var(--color-error)' : 'var(--color-outline)'}`,
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-on-surface)',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
            {/* Step 6: Caution icon beside error */}
            {errors.phone && (
              <span id="phone-error" role="alert" style={{ fontSize: '0.75rem', color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                ⚠️ {errors.phone}
              </span>
            )}
          </div>

          {/* Field: Guardian Email (Category 3: Only on activate and reset) */}
          {mode !== 'login' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label htmlFor="email" className="text-label-medium">
                Guardian Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                aria-required="true"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : (mode === 'activate' && email.length > 0 && !errors.email ? 'email-success' : undefined)}
                placeholder="e.g. parent@example.com"
                value={email}
                onChange={handleEmailChange}
                onBlur={(e) => handleBlur('email', e.target.value)}
                style={{
                  padding: '0.625rem 0.75rem',
                  borderRadius: '0.375rem',
                  border: `1px solid ${errors.email ? 'var(--color-error)' : 'var(--color-outline)'}`,
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-on-surface)',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              {mode === 'activate' && email.length > 0 && !errors.email && (
                <span id="email-success" style={{ fontSize: '0.75rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ✓ Valid email format
                </span>
              )}
              {errors.email && (
                <span id="email-error" role="alert" style={{ fontSize: '0.75rem', color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ⚠️ {errors.email}
                </span>
              )}
            </div>
          )}

          {/* Mode-Specific Field: Student ID (Only for Activation) */}
          {mode === 'activate' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label htmlFor="studentId" className="text-label-medium">
                Student Admission Number
              </label>
              <input
                id="studentId"
                name="studentId"
                type="text"
                required
                aria-required="true"
                aria-invalid={Boolean(errors.studentId)}
                aria-describedby={errors.studentId ? 'studentId-error' : undefined}
                value={studentId}
                onChange={(e) => {
                  setStudentId(e.target.value.toUpperCase());
                  setDisabledButtonClickReason(null);
                }}
                onBlur={(e) => handleBlur('studentId', e.target.value)}
                style={{
                  padding: '0.625rem 0.75rem',
                  borderRadius: '0.375rem',
                  border: `1px solid ${errors.studentId ? 'var(--color-error)' : 'var(--color-outline)'}`,
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-on-surface)',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              {errors.studentId && (
                <span id="studentId-error" role="alert" style={{ fontSize: '0.75rem', color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ⚠️ {errors.studentId}
                </span>
              )}
            </div>
          )}

          {/* Mode-Specific Field: Slip Code (Only for Activation, No length clues, Step 5) */}
          {mode === 'activate' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label htmlFor="slipCode" className="text-label-medium">
                Access Slip Code
              </label>
              <input
                id="slipCode"
                name="slipCode"
                type="text"
                inputMode="numeric"
                required
                aria-required="true"
                aria-invalid={Boolean(errors.slipCode)}
                aria-describedby={errors.slipCode ? 'slipCode-error' : 'slipCode-hint'}
                value={slipCode}
                onChange={handleSlipCodeChange}
                onBlur={(e) => handleBlur('slipCode', e.target.value)}
                style={{
                  padding: '0.625rem 0.75rem',
                  borderRadius: '0.375rem',
                  border: `1px solid ${errors.slipCode ? 'var(--color-error)' : 'var(--color-outline)'}`,
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-on-surface)',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              {slipCode.length > 0 && slipCode.length < 6 && (
                <span id="slipCode-hint" style={{ fontSize: '0.75rem', color: 'var(--color-on-surface-variant)' }}>
                  Enter the code from your printed fee advice slip.
                </span>
              )}
              {errors.slipCode && (
                <span id="slipCode-error" role="alert" style={{ fontSize: '0.75rem', color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ⚠️ {errors.slipCode}
                </span>
              )}
            </div>
          )}

          {/* Mode-Specific Field: PIN (Only for Login, Step 4 & 7) */}
          {mode === 'login' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label htmlFor="pin" className="text-label-medium">
                Security PIN
              </label>
              <input
                id="pin"
                name="pin"
                type="password"
                inputMode="numeric"
                required
                aria-required="true"
                aria-invalid={Boolean(errors.pin)}
                aria-describedby={errors.pin ? 'pin-error' : 'pin-hint'}
                value={pin}
                onChange={handlePinChange}
                onBlur={(e) => handleBlur('pin', e.target.value)}
                style={{
                  padding: '0.625rem 0.75rem',
                  borderRadius: '0.375rem',
                  border: `1px solid ${errors.pin ? 'var(--color-error)' : 'var(--color-outline)'}`,
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-on-surface)',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              {/* Step 7: Hint appears only once typing begins */}
              {pin.length > 0 && pin.length < 4 && (
                <span id="pin-hint" style={{ fontSize: '0.75rem', color: 'var(--color-on-surface-variant)' }}>
                  PIN must be 4 digits ({4 - pin.length} remaining).
                </span>
              )}
              {errors.pin && (
                <span id="pin-error" role="alert" style={{ fontSize: '0.75rem', color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ⚠️ {errors.pin}
                </span>
              )}
            </div>
          )}

          {/* Mode-Specific Terms & Conditions Acceptance Checkbox (Step 2) */}
          {mode === 'activate' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8125rem' }}>
                <input
                  type="checkbox"
                  required
                  aria-required="true"
                  checked={acceptTerms}
                  onChange={(e) => {
                    setAcceptTerms(e.target.checked);
                    setDisabledButtonClickReason(null);
                    setErrors((prev) => ({ ...prev, terms: undefined }));
                  }}
                  style={{ marginTop: '0.125rem', cursor: 'pointer' }}
                />
                <span style={{ color: 'var(--color-on-surface-variant)' }}>
                  I confirm I am the registered parent/guardian and agree to official school fee terms and privacy rules.
                </span>
              </label>
              {errors.terms && (
                <span role="alert" style={{ fontSize: '0.75rem', color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ⚠️ {errors.terms}
                </span>
              )}
            </div>
          )}

          {/* Submit Button (Step 7: Disabled until valid, explains itself on click) */}
          <div style={{ width: '100%', marginTop: '0.5rem' }}>
            <button
              type="submit"
              aria-disabled={!isFormValid}
              onClick={(e) => {
                if (!isFormValid) {
                  e.preventDefault();
                  triggerValidationAndExplain();
                }
              }}
              className="text-label-large"
              style={{
                width: '100%',
                padding: '0.875rem 1.5rem',
                backgroundColor: isFormValid ? 'var(--color-primary)' : 'var(--color-surface-container-high)',
                color: isFormValid ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: isFormValid ? 'pointer' : 'not-allowed',
                opacity: isFormValid ? 1 : 0.6,
                transition: 'all 0.15s ease',
              }}
            >
              {mode === 'login' && 'Sign In to Portal'}
              {mode === 'activate' && 'Activate Account'}
              {mode === 'reset' && 'Request PIN Reset'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

