import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import Divider from "@mui/material/Divider";
import Buttons from "../../utils/Buttons";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMyContext } from "../../store/ContextApi";

const Signup = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [role, setRole] = useState();
  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { token } = useMyContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  // Watch all form values
  const watchAllFields = watch();
  const watchPassword = watch("password");

  // Calculate password strength
  useEffect(() => {
    if (!watchPassword) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    
    // Length check
    if (watchPassword.length >= 4) strength += 1;
    if (watchPassword.length >= 6) strength += 1;
    
    // Character type checks
    if (/[a-z]/.test(watchPassword)) strength += 1; // lowercase
    if (/[A-Z]/.test(watchPassword)) strength += 1; // uppercase
    if (/[0-9]/.test(watchPassword)) strength += 1; // number
    if (/[^A-Za-z0-9]/.test(watchPassword)) strength += 1; // special char

    setPasswordStrength(Math.min(strength, 5));
  }, [watchPassword]);

  useEffect(() => {
    setRole("ROLE_USER");
  }, []);

  // Auto-hide errors when form becomes valid
  useEffect(() => {
    if (submitAttempted && isValid && showErrors) {
      const timer = setTimeout(() => {
        setShowErrors(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isValid, showErrors, submitAttempted]);

  const onSubmitHandler = async (data) => {
    setSubmitAttempted(true);
    
    // Trigger validation on all fields
    const isValid = await trigger();
    
    if (!isValid) {
      setShowErrors(true);
      return;
    }

    const { username, email, password } = data;
    const sendData = {
      username,
      email,
      password,
      role: [role],
    };

    try {
      setLoading(true);
      const response = await api.post("/auth/public/signup", sendData);
      toast.success("Registration Successful!");
      reset();
      setSubmitAttempted(false);
      setShowErrors(false);
      setShowPassword(false);
      if (response.data) {
        navigate("/login");
      }
    } catch (error) {
      if (
        error?.response?.data?.message === "Error: Username is already taken!"
      ) {
        setError("username", { message: "Username is already taken" });
        setShowErrors(true);
      } else if (
        error?.response?.data?.message === "Error: Email is already in use!"
      ) {
        setError("email", { message: "Email is already in use" });
        setShowErrors(true);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Show errors only when submit was attempted AND field has error
  const shouldShowError = (fieldName) => {
    return submitAttempted && errors[fieldName] && showErrors;
  };

  // Get input border color based on state
  const getInputBorderClass = (fieldName) => {
    if (submitAttempted && errors[fieldName] && showErrors) {
      return "border-red-500/50 focus:ring-red-500";
    }
    if (watchAllFields[fieldName] && !errors[fieldName]) {
      return "border-emerald-500/50 focus:ring-emerald-500";
    }
    return "border-white/10 focus:ring-blue-500";
  };

  // Get password strength color
  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "bg-slate-700";
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-amber-500";
    if (passwordStrength <= 4) return "bg-blue-500";
    return "bg-emerald-500";
  };

  // Get password strength text
  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "Very Weak";
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Fair";
    if (passwordStrength <= 4) return "Good";
    return "Strong";
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  // Proper email validation regex
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return (
    <div className="min-h-[calc(100vh-74px)] bg-slate-950 flex justify-center items-center p-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="bg-slate-900/50 backdrop-blur-sm text-slate-300 border border-white/10 rounded-2xl shadow-2xl shadow-black/30 p-8"
        >
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
              <span className="text-white font-bold text-2xl">✏️</span>
            </div>
            <h1 className="font-montserrat text-3xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-slate-400">
              Join Noteworthy and secure your thoughts
            </p>
          </div>

          {/* Social Signup Buttons */}
          <div className="space-y-3 mb-6">
            <a
              href={`${apiUrl}/oauth2/authorization/google`}
              className="flex items-center justify-center gap-3 w-full p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
            >
              <FcGoogle className="text-xl" />
              <span className="font-medium text-slate-300 group-hover:text-white">
                Continue with Google
              </span>
            </a>
            <a
              href={`${apiUrl}/oauth2/authorization/github`}
              className="flex items-center justify-center gap-3 w-full p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
            >
              <FaGithub className="text-xl" />
              <span className="font-medium text-slate-300 group-hover:text-white">
                Continue with GitHub
              </span>
            </a>
          </div>

          <Divider className="!my-6 !text-slate-500">OR</Divider>

          {/* Signup Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <input
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                  maxLength: {
                    value: 20,
                    message: "Username cannot exceed 20 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: "Username can only contain letters, numbers, and underscores",
                  },
                })}
                type="text"
                id="username"
                placeholder="Enter username"
                className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border ${getInputBorderClass("username")} text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
              />
              {shouldShowError("username") && (
                <div className="flex items-center gap-2 mt-1 animate-fadeIn">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-400"></div>
                  <p className="text-sm font-medium text-red-400">
                    {errors.username.message}
                  </p>
                </div>
              )}
              {submitAttempted && !errors.username && watchAllFields.username?.length >= 3 && (
                <div className="flex items-center gap-1 text-emerald-400 text-xs">
                  <span>✓</span>
                  <span>Username available</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: emailPattern,
                    message: "Please enter a valid email address (e.g., example@domain.com)",
                  },
                })}
                type="email"
                id="email"
                placeholder="Enter your email"
                className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border ${getInputBorderClass("email")} text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
              />
              {shouldShowError("email") && (
                <div className="flex items-center gap-2 mt-1 animate-fadeIn">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-400"></div>
                  <p className="text-sm font-medium text-red-400">
                    {errors.email.message}
                  </p>
                </div>
              )}
              {submitAttempted && !errors.email && watchAllFields.email && (
                <div className="flex items-center gap-1 text-emerald-400 text-xs">
                  <span>✓</span>
                  <span>Valid email format</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Create a password (min. 6 characters)"
                  className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border ${getInputBorderClass("password")} text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password strength indicator */}
              {watchPassword && (
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Password strength:</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength <= 2 ? 'text-red-400' :
                      passwordStrength <= 3 ? 'text-amber-400' :
                      passwordStrength <= 4 ? 'text-blue-400' : 'text-emerald-400'
                    }`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              
              {shouldShowError("password") && (
                <div className="flex items-center gap-2 mt-1 animate-fadeIn">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-400"></div>
                  <p className="text-sm font-medium text-red-400">
                    {errors.password.message}
                  </p>
                </div>
              )}
              
              {submitAttempted && !errors.password && watchAllFields.password?.length >= 6 && (
                <div className="space-y-1 mt-2">
                  <div className="flex items-center gap-1 text-emerald-400 text-xs">
                    <span>✓</span>
                    <span>Password meets minimum requirements</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    For stronger security, include uppercase letters, numbers, and special characters
                  </div>
                </div>
              )}
            </div>

            {/* Form status indicator */}
            {submitAttempted && showErrors && Object.keys(errors).length > 0 && (
              <div className="flex items-center gap-2 text-amber-400 text-sm bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></div>
                <span>Please fix the errors above before submitting</span>
              </div>
            )}
          </div>

          <Buttons
            disabled={loading}
            onClickhandler={() => {}}
            className="mt-6 w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </Buttons>

          <p className="text-center text-slate-400 mt-6 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;