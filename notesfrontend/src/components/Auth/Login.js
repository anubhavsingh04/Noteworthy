import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import Divider from "@mui/material/Divider";
import Buttons from "../../utils/Buttons";
import toast from "react-hot-toast";
import { useMyContext } from "../../store/ContextApi";

const apiUrl = process.env.REACT_APP_API_URL;

const Login = () => {
  const [step, setStep] = useState(1);
  const [jwtToken, setJwtToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setToken, token } = useMyContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      code: "",
    },
    mode: "onChange",
  });

  // Watch all form values
  const watchAllFields = watch();

  // Auto-hide errors when form becomes valid
  useEffect(() => {
    if (submitAttempted && isValid && showErrors) {
      const timer = setTimeout(() => {
        setShowErrors(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isValid, showErrors, submitAttempted]);

  // Check if user is already logged in
  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  const handleSuccessfulLogin = (token, decodedToken) => {
    const user = {
      username: decodedToken.sub,
      roles: decodedToken.roles ? decodedToken.roles.split(",") : [],
    };
    localStorage.setItem("JWT_TOKEN", token);
    localStorage.setItem("USER", JSON.stringify(user));
    setToken(token);
    navigate("/notes");
  };

  const onLoginHandler = async (data) => {
    setSubmitAttempted(true);
    
    // Trigger validation on all fields
    const isValid = await trigger();
    
    if (!isValid) {
      setShowErrors(true);
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/public/signin", data);
      toast.success("Login Successful");
      reset();

      if (response.status === 200 && response.data.jwtToken) {
        setJwtToken(response.data.jwtToken);
        const decodedToken = jwtDecode(response.data.jwtToken);
        if (decodedToken.is2faEnabled) {
          setStep(2);
          setSubmitAttempted(false);
          setShowErrors(false);
        } else {
          handleSuccessfulLogin(response.data.jwtToken, decodedToken);
        }
      } else {
        toast.error("Login failed. Please check your credentials and try again.");
      }
    } catch (error) {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const onVerify2FaHandler = async (data) => {
    setSubmitAttempted(true);
    
    // Trigger validation on code field
    const isValid = await trigger("code");
    
    if (!isValid) {
      setShowErrors(true);
      return;
    }

    const code = data.code;
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("code", code);
      formData.append("jwtToken", jwtToken);

      await api.post("/auth/public/verify-2fa-login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const decodedToken = jwtDecode(jwtToken);
      handleSuccessfulLogin(jwtToken, decodedToken);
    } catch (error) {
      console.error("2FA verification error", error);
      toast.error("Invalid 2FA code. Please try again.");
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

  return (
    <div className="min-h-[calc(100vh-74px)] bg-slate-950 flex justify-center items-center p-4">
      <div className="w-full max-w-md">
        {step === 1 ? (
          <form
            onSubmit={handleSubmit(onLoginHandler)}
            className="bg-slate-900/50 backdrop-blur-sm text-slate-300 border border-white/10 rounded-2xl shadow-2xl shadow-black/30 p-8"
          >
            <div className="text-center mb-8">
              <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
                <span className="text-white font-bold text-2xl">N</span>
              </div>
              <h1 className="font-montserrat text-3xl font-bold text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-slate-400">
                Sign in to access Noteworthy
              </p>
            </div>

            {/* Social Login Buttons */}
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

            {/* Login Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                {/* <label htmlFor="username" className="text-sm font-medium text-slate-300">
                  Username <span className="text-red-400">*</span>
                </label> */}
                <input
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                  })}
                  type="text"
                  id="username"
                  placeholder="Enter your username"
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
                    <span>Username looks good!</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {/* <label htmlFor="password" className="text-sm font-medium text-slate-300">
                  Password <span className="text-red-400">*</span>
                </label> */}
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
                    placeholder="Enter your password"
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
                {shouldShowError("password") && (
                  <div className="flex items-center gap-2 mt-1 animate-fadeIn">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-400"></div>
                    <p className="text-sm font-medium text-red-400">
                      {errors.password.message}
                    </p>
                  </div>
                )}
                {submitAttempted && !errors.password && watchAllFields.password?.length >= 6 && (
                  <div className="flex items-center gap-1 text-emerald-400 text-xs">
                    <span>✓</span>
                    <span>Password meets requirements</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <Link
                  to="/forgot-password"
                  className="inline-block text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot Password?
                </Link>
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
              className="mt-6 w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Buttons>

            <p className="text-center text-slate-400 mt-6 text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </form>
        ) : (
          <form
            onSubmit={handleSubmit(onVerify2FaHandler)}
            className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl shadow-black/30 p-8"
          >
            <div className="text-center mb-8">
              <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
                <span className="text-white font-bold text-2xl">✓</span>
              </div>
              <h1 className="font-montserrat text-3xl font-bold text-white mb-2">
                2FA Verification
              </h1>
              <p className="text-slate-400">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium text-slate-300">
                  Verification Code <span className="text-red-400">*</span>
                </label>
                <input
                  {...register("code", {
                    required: "Verification code is required",
                    pattern: {
                      value: /^\d{6}$/,
                      message: "Code must be exactly 6 digits",
                    },
                  })}
                  type="text"
                  id="code"
                  maxLength="6"
                  placeholder="Enter 6-digit code"
                  className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border ${getInputBorderClass("code")} text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                />
                {shouldShowError("code") && (
                  <div className="flex items-center gap-2 mt-1 animate-fadeIn">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-400"></div>
                    <p className="text-sm font-medium text-red-400">
                      {errors.code.message}
                    </p>
                  </div>
                )}
                {submitAttempted && !errors.code && watchAllFields.code?.length === 6 && (
                  <div className="flex items-center gap-1 text-emerald-400 text-xs">
                    <span>✓</span>
                    <span>Valid code format</span>
                  </div>
                )}
              </div>

              {/* Form status indicator for 2FA */}
              {submitAttempted && showErrors && errors.code && (
                <div className="flex items-center gap-2 text-amber-400 text-sm bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                  <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></div>
                  <span>Please enter a valid 6-digit code</span>
                </div>
              )}

              <Buttons
                disabled={loading}
                onClickhandler={() => {}}
                className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:from-emerald-700 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Verifying...
                  </span>
                ) : (
                  "Verify & Continue"
                )}
              </Buttons>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setSubmitAttempted(false);
                  setShowErrors(false);
                  setShowPassword(false);
                  reset();
                }}
                className="w-full py-2.5 text-sm text-slate-400 hover:text-white transition-colors"
              >
                ← Back to login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;