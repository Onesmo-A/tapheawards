import React, { useMemo, useState } from 'react';
import axios from 'axios';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  UserPlus,
  UserRound,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const fieldShell =
  'group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] transition-all duration-300 focus-within:border-[#D90429]/70 focus-within:bg-white/[0.07] focus-within:shadow-[0_0_0_1px_rgba(217,4,41,0.22),0_18px_45px_rgba(217,4,41,0.08)]';

const inputClass =
  'w-full bg-transparent py-3.5 pl-11 pr-4 font-inter text-sm text-white outline-none placeholder:text-white/25';

const registrationSteps = [
  {
    number: 1,
    label: 'Personal',
    title: 'Personal Information',
    subtitle: 'Start with your name and an optional mobile number.',
  },
  {
    number: 2,
    label: 'Account',
    title: 'Account Details',
    subtitle: 'Enter the email and password you will use to sign in.',
  },
  {
    number: 3,
    label: 'Confirm',
    title: 'Confirm Account',
    subtitle: 'Confirm your password before creating the account.',
  },
] as const;

export default function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [registerStep, setRegisterStep] = useState(1);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isRegistering = mode === 'register';
  const currentRegistrationStep =
    registrationSteps[registerStep - 1] ?? registrationSteps[0];

  const title = useMemo(() => {
    if (!isRegistering) {
      return 'Sign In';
    }

    return currentRegistrationStep.title;
  }, [currentRegistrationStep.title, isRegistering]);

  const subtitle = isRegistering
    ? currentRegistrationStep.subtitle
    : 'Welcome back to the TAPHE Awards portal. Continue with your email and password.';

  const persistSession = (data: any) => {
    localStorage.setItem('user_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
    window.dispatchEvent(new Event('taphe:user-auth-changed'));
  };

  const switchMode = (nextMode: 'login' | 'register') => {
    setMode(nextMode);
    setRegisterStep(1);
    setErrorMsg('');
  };

  const validateRegistrationStep = () => {
    setErrorMsg('');

    if (registerStep === 1) {
      if (name.trim().length < 2) {
        setErrorMsg('Please enter your full name.');
        return false;
      }

      return true;
    }

    if (registerStep === 2) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email.trim())) {
        setErrorMsg('Please enter a valid email address.');
        return false;
      }

      if (password.length < 8) {
        setErrorMsg('Password must contain at least 8 characters.');
        return false;
      }

      return true;
    }

    if (!passwordConfirmation) {
      setErrorMsg('Please confirm your password.');
      return false;
    }

    if (password !== passwordConfirmation) {
      setErrorMsg('Password confirmation does not match.');
      return false;
    }

    return true;
  };

  const goToNextStep = () => {
    if (!validateRegistrationStep()) {
      return;
    }

    setRegisterStep((current) => Math.min(current + 1, registrationSteps.length));
  };

  const goToPreviousStep = () => {
    setErrorMsg('');
    setRegisterStep((current) => Math.max(current - 1, 1));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isRegistering && registerStep < registrationSteps.length) {
      goToNextStep();
      return;
    }

    if (isRegistering && !validateRegistrationStep()) {
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const endpoint = isRegistering ? '/api/v1/register' : '/api/v1/login';

      const payload = isRegistering
        ? {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          password,
          password_confirmation: passwordConfirmation,
        }
        : {
          email: email.trim(),
          password,
        };

      const response = await axios.post(endpoint, payload);

      persistSession(response.data);
      navigate('/portal');
    } catch (error: any) {
      const errors = error.response?.data?.errors;
      const firstValidationMessage = errors
        ? Object.values(errors).flat()[0]
        : null;

      setErrorMsg(
        String(
          firstValidationMessage ||
          error.response?.data?.message ||
          'Unable to complete authentication. Please try again.',
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-[#030303] px-4 py-8 text-white sm:px-6 lg:px-8">
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(217,4,41,0.24),transparent_28%),radial-gradient(circle_at_78%_80%,rgba(212,168,83,0.16),transparent_31%),linear-gradient(135deg,#030303_0%,#090607_42%,#110407_100%)]" />

        <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:54px_54px]" />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
          className="absolute -left-24 top-14 h-72 w-72 rounded-full border border-[#D4A853]/20"
        />

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-0 right-[-9rem] h-96 w-96 rounded-full border border-[#D90429]/20"
        />

        <motion.div
          animate={{ x: ['-20%', '110%'] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatDelay: 2.5,
          }}
          className="absolute top-0 h-full w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/[0.055] to-transparent"
        />
      </motion.div>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-144px)] w-full items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.65,
            delay: 0.08,
            ease: 'easeOut',
          }}
          className="w-full max-w-[34rem]"
        >
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#080506]/85 p-5 shadow-[0_28px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-7">
            <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
            <div className="absolute -right-10 top-16 h-32 w-32 rounded-full border border-[#D90429]/20" />
            <div className="absolute -bottom-16 left-10 h-44 w-44 rounded-full border border-[#D4A853]/15" />

            <div className="relative">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-[#D4A853] shadow-[0_18px_60px_rgba(212,168,83,0.1)]">
                  <ShieldCheck className="h-7 w-7" />
                </div>

                <p className="font-outfit text-[10px] font-black uppercase tracking-[0.28em] text-[#ff405b]">
                  Account Access
                </p>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${mode}-${registerStep}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22 }}
                  >
                    <h2 className="mt-2 font-outfit text-2xl font-black uppercase text-white sm:text-3xl">
                      {title}
                    </h2>

                    <p className="mx-auto mt-3 max-w-sm font-inter text-sm leading-6 text-white/50">
                      {subtitle}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mb-5 grid grid-cols-2 gap-1 rounded-2xl border border-white/10 bg-black/45 p-1.5">
                {(['login', 'register'] as const).map((item) => {
                  const active = mode === item;

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => switchMode(item)}
                      className={`relative rounded-xl px-3 py-3 font-outfit text-[10px] font-black uppercase tracking-[0.18em] transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853]/70 ${active
                          ? 'text-white'
                          : 'text-white/45 hover:text-white/80'
                        }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="auth-mode-pill"
                          className="absolute inset-0 rounded-xl bg-[#D90429] shadow-[0_10px_35px_rgba(217,4,41,0.32)]"
                          transition={{
                            type: 'spring',
                            stiffness: 420,
                            damping: 32,
                          }}
                        />
                      )}

                      <span className="relative">
                        {item === 'login' ? 'Sign In' : 'Create Account'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {isRegistering && (
                <div className="mb-6">
                  <div className="grid grid-cols-3">
                    {registrationSteps.map((step, index) => {
                      const completed = registerStep > step.number;
                      const active = registerStep === step.number;

                      return (
                        <div
                          key={step.number}
                          className="relative flex flex-col items-center"
                        >
                          {index < registrationSteps.length - 1 && (
                            <div className="absolute left-1/2 top-4 h-px w-full bg-white/10">
                              <motion.div
                                initial={false}
                                animate={{
                                  width: completed ? '100%' : '0%',
                                }}
                                transition={{ duration: 0.3 }}
                                className="h-full bg-[#D90429]"
                              />
                            </div>
                          )}

                          <div
                            className={`relative z-10 grid h-8 w-8 place-items-center rounded-full border text-[10px] font-black transition-all duration-300 ${completed || active
                                ? 'border-[#D90429] bg-[#D90429] text-white shadow-[0_0_20px_rgba(217,4,41,0.3)]'
                                : 'border-white/15 bg-[#100b0c] text-white/35'
                              }`}
                          >
                            {completed ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              step.number
                            )}
                          </div>

                          <span
                            className={`mt-2 font-outfit text-[8px] font-black uppercase tracking-[0.14em] ${active || completed
                                ? 'text-white'
                                : 'text-white/30'
                              }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <AnimatePresence>
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mb-4 rounded-2xl border border-[#D90429]/30 bg-[#D90429]/10 px-4 py-3 font-inter text-sm leading-5 text-red-100"
                  >
                    {errorMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait" initial={false}>
                  {!isRegistering && (
                    <motion.div
                      key="login-form"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      transition={{ duration: 0.24 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="mb-1.5 block font-outfit text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
                          Email Address
                        </label>

                        <div className={fieldShell}>
                          <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35 transition-colors group-focus-within:text-[#D4A853]" />

                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className={inputClass}
                            placeholder="you@example.com"
                            autoComplete="email"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block font-outfit text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
                          Password
                        </label>

                        <div className={fieldShell}>
                          <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35 transition-colors group-focus-within:text-[#D4A853]" />

                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className={inputClass}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {isRegistering && registerStep === 1 && (
                    <motion.div
                      key="registration-step-1"
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -18 }}
                      transition={{ duration: 0.24 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="mb-1.5 block font-outfit text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
                          Full Name
                        </label>

                        <div className={fieldShell}>
                          <UserRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35 transition-colors group-focus-within:text-[#D4A853]" />

                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            className={inputClass}
                            placeholder="Your full name"
                            autoComplete="name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block font-outfit text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
                          Mobile Number
                          <span className="ml-2 normal-case tracking-normal text-white/25">
                            Optional
                          </span>
                        </label>

                        <div className={fieldShell}>
                          <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35 transition-colors group-focus-within:text-[#D4A853]" />

                          <input
                            type="tel"
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                            className={inputClass}
                            placeholder="e.g. 0712345678"
                            autoComplete="tel"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {isRegistering && registerStep === 2 && (
                    <motion.div
                      key="registration-step-2"
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -18 }}
                      transition={{ duration: 0.24 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="mb-1.5 block font-outfit text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
                          Email Address
                        </label>

                        <div className={fieldShell}>
                          <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35 transition-colors group-focus-within:text-[#D4A853]" />

                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className={inputClass}
                            placeholder="you@example.com"
                            autoComplete="email"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block font-outfit text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
                          Password
                        </label>

                        <div className={fieldShell}>
                          <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35 transition-colors group-focus-within:text-[#D4A853]" />

                          <input
                            type="password"
                            required
                            minLength={8}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className={inputClass}
                            placeholder="Minimum 8 characters"
                            autoComplete="new-password"
                          />
                        </div>

                        <p className="mt-2 px-1 font-inter text-[11px] leading-5 text-white/35">
                          Use at least 8 characters for a stronger account.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {isRegistering && registerStep === 3 && (
                    <motion.div
                      key="registration-step-3"
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -18 }}
                      transition={{ duration: 0.24 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="mb-1.5 block font-outfit text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
                          Confirm Password
                        </label>

                        <div className={fieldShell}>
                          <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35 transition-colors group-focus-within:text-[#D4A853]" />

                          <input
                            type="password"
                            required
                            minLength={8}
                            value={passwordConfirmation}
                            onChange={(event) =>
                              setPasswordConfirmation(event.target.value)
                            }
                            className={inputClass}
                            placeholder="Repeat your password"
                            autoComplete="new-password"
                          />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#D90429]/15 text-[#ff405b]">
                            <ShieldCheck className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="font-outfit text-[10px] font-black uppercase tracking-[0.16em] text-white">
                              Ready to create account
                            </p>

                            <p className="mt-1 font-inter text-xs leading-5 text-white/45">
                              Your account will use{' '}
                              <span className="text-white/75">
                                {email || 'your email address'}
                              </span>
                              .
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-5">
                  {!isRegistering && (
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={loading ? undefined : { y: -2 }}
                      whileTap={
                        loading
                          ? undefined
                          : {
                            y: 0,
                            scale: 0.99,
                          }
                      }
                      className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl border border-[#ff405b]/30 bg-[#D90429] px-4 py-4 font-outfit text-[10px] font-black uppercase tracking-[0.22em] text-white shadow-[0_18px_50px_rgba(217,4,41,0.28)] transition-all duration-300 hover:bg-[#b90022] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853]/75 disabled:cursor-not-allowed disabled:opacity-55"
                    >
                      <span className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-20deg] bg-white/20 transition-transform duration-700 group-hover:translate-x-[420%]" />

                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Processing</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-4 w-4" />
                          <span>Sign In</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </motion.button>
                  )}

                  {isRegistering && registerStep < registrationSteps.length && (
                    <div
                      className={`grid gap-3 ${registerStep > 1 ? 'grid-cols-2' : 'grid-cols-1'
                        }`}
                    >
                      {registerStep > 1 && (
                        <button
                          type="button"
                          onClick={goToPreviousStep}
                          className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 font-outfit text-[10px] font-black uppercase tracking-[0.18em] text-white/70 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          <span>Back</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={goToNextStep}
                        className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl border border-[#ff405b]/30 bg-[#D90429] px-4 py-4 font-outfit text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-[0_18px_50px_rgba(217,4,41,0.25)] transition-all duration-300 hover:bg-[#b90022]"
                      >
                        <span>Continue</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    </div>
                  )}

                  {isRegistering &&
                    registerStep === registrationSteps.length && (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={goToPreviousStep}
                          disabled={loading}
                          className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 font-outfit text-[10px] font-black uppercase tracking-[0.18em] text-white/70 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          <span>Back</span>
                        </button>

                        <motion.button
                          type="submit"
                          disabled={loading}
                          whileHover={loading ? undefined : { y: -2 }}
                          whileTap={
                            loading
                              ? undefined
                              : {
                                y: 0,
                                scale: 0.99,
                              }
                          }
                          className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl border border-[#ff405b]/30 bg-[#D90429] px-3 py-4 font-outfit text-[9px] font-black uppercase tracking-[0.16em] text-white shadow-[0_18px_50px_rgba(217,4,41,0.28)] transition-all duration-300 hover:bg-[#b90022] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853]/75 disabled:cursor-not-allowed disabled:opacity-55 sm:text-[10px]"
                        >
                          <span className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-20deg] bg-white/20 transition-transform duration-700 group-hover:translate-x-[420%]" />

                          {loading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Creating</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4" />
                              <span>Create</span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    )}
                </div>

                <p className="mt-5 px-3 text-center font-inter text-xs leading-5 text-white/45">
                  {isRegistering
                    ? 'Already have an account? Select Sign In above to continue.'
                    : 'No account yet? Select Create Account and complete the three simple steps.'}
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
