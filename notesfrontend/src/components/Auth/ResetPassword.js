import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import { Divider } from "@mui/material";
import InputField from "../InputField/InputField";
import toast from "react-hot-toast";
import Buttons from "../../utils/Buttons";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
    },
    mode: "onTouched",
  });

  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const handleResetPassword = async (data) => {
    const { password } = data;
    const token = searchParams.get("token");

    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("newPassword", password);
      
      await api.post("/auth/public/reset-password", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      
      toast.success("Password reset successful! You can now log in.");
      reset();
    } catch (error) {
      toast.error("Error resetting password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-74px)] bg-slate-950 flex justify-center items-center p-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit(handleResetPassword)}
          className="bg-slate-900/50 backdrop-blur-sm text-slate-300 border border-white/10 rounded-2xl shadow-2xl shadow-black/30 p-8"
        >
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 items-center justify-center shadow-lg shadow-green-500/20 mb-4">
              <span className="text-white font-bold text-2xl">✓</span>
            </div>
            <h1 className="font-montserrat text-3xl font-bold text-white mb-2">
              Reset Your Password
            </h1>
            <p className="text-slate-400">
              Enter your new password below
            </p>
          </div>

          <Divider className="!my-6 !text-slate-500"></Divider>

          <div className="space-y-4">
            <div>
              <InputField
                required
                id="password"
                type="password"
                message="Password is required (min 6 characters)"
                placeholder="Enter your new password"
                register={register}
                errors={errors}
                min={6}
                className="border-white/10 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <Buttons
            disabled={loading}
            onClickhandler={() => {}}
            className="mt-6 w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:from-green-700 hover:to-emerald-600 transition-all shadow-lg shadow-green-500/20"
            type="submit"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Resetting...
              </span>
            ) : (
              "Reset Password"
            )}
          </Buttons>

          <div className="mt-6 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <p className="text-sm text-slate-300">
              Your password must be at least 6 characters long.
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

export default ResetPassword;