import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import Buttons from "../../utils/Buttons";
import { Divider } from "@mui/material";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const navigate = useNavigate();
  const { token } = useMyContext();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  // Watch form values
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

  const onPasswordForgotHandler = async (data) => {
    setSubmitAttempted(true);
    
    // Trigger validation on email field
    const isValid = await trigger();
    
    if (!isValid) {
      setShowErrors(true);
      return;
    }

    const { email } = data;

    try {
      setLoading(true);

      const formData = new URLSearchParams();
      formData.append("email", email);
      await api.post("/auth/public/forgot-password", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      reset();
      setSubmitAttempted(false);
      setShowErrors(false);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      toast.error("Error sending password reset email. Please try again.");
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

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  return (
    <div className="min-h-[calc(100vh-74px)] bg-slate-950 flex justify-center items-center p-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit(onPasswordForgotHandler)}
          className="bg-slate-900/50 backdrop-blur-sm text-slate-300 border border-white/10 rounded-2xl shadow-2xl shadow-black/30 p-8"
        >
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
              <span className="text-white font-bold text-2xl">🔑</span>
            </div>
            <h1 className="font-montserrat text-3xl font-bold text-white mb-2">
              Forgot Password?
            </h1>
            <p className="text-slate-400">
              Enter your email and we'll send you a password reset link
            </p>
          </div>

          <Divider className="!my-6 !text-slate-500"></Divider>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-300">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address",
                  },
                })}
                type="email"
                id="email"
                placeholder="Enter your email address"
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

            {/* Form status indicator */}
            {submitAttempted && showErrors && Object.keys(errors).length > 0 && (
              <div className="flex items-center gap-2 text-amber-400 text-sm bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></div>
                <span>Please enter a valid email address</span>
              </div>
            )}
          </div>

          <Buttons
            disabled={loading}
            onClickhandler={() => {}}
            className="mt-6 w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Sending...
              </span>
            ) : (
              "Send Reset Link"
            )}
          </Buttons>

          <div className="mt-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <p className="text-sm text-slate-300">
              Check your spam folder if you don't see the email in your inbox.
            </p>
          </div>

          <p className="text-center text-slate-400 mt-6 text-sm">
            <Link
              className="text-blue-400 hover:text-blue-300 transition-colors"
              to="/login"
            >
              ← Back to Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;