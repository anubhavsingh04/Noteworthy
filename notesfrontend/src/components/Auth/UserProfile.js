import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useMyContext } from "../../store/ContextApi";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import InputField from "../InputField/InputField";
import { useForm } from "react-hook-form";
import Buttons from "../../utils/Buttons";
import Switch from "@mui/material/Switch";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { Blocks } from "react-loader-spinner";
import moment from "moment";
import Errors from "../Errors";

const UserProfile = () => {
  const { currentUser, token } = useMyContext();
  const [loginSession, setLoginSession] = useState(null);
  const [credentialExpireDate, setCredentialExpireDate] = useState(null);
  const [pageError, setPageError] = useState(false);
  const [accountExpired, setAccountExpired] = useState();
  const [accountLocked, setAccountLock] = useState();
  const [accountEnabled, setAccountEnabled] = useState();
  const [credentialExpired, setCredentialExpired] = useState();
  const [openAccount, setOpenAccount] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [disabledLoader, setDisbledLoader] = useState(false);
  const [twofaCodeLoader, settwofaCodeLoader] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: currentUser?.username,
      email: currentUser?.email,
      password: "",
    },
    mode: "onTouched",
  });

  // Fetching the 2FA status
  useEffect(() => {
    setPageLoader(true);
    const fetch2FAStatus = async () => {
      try {
        const response = await api.get(`/auth/user/2fa-status`);
        setIs2faEnabled(response.data.is2faEnabled);
      } catch (error) {
        setPageError(error?.response?.data?.message);
        toast.error("Error fetching 2FA status");
      } finally {
        setPageLoader(false);
      }
    };
    fetch2FAStatus();
  }, []);

  // Enable the 2FA
  const enable2FA = async () => {
    setDisbledLoader(true);
    try {
      const response = await api.post(`/auth/enable-2fa`);
      setQrCodeUrl(response.data);
      setStep(2);
    } catch (error) {
      toast.error("Error enabling 2FA");
    } finally {
      setDisbledLoader(false);
    }
  };

  // Disable the 2FA
  const disable2FA = async () => {
    setDisbledLoader(true);
    try {
      await api.post(`/auth/disable-2fa`);
      setIs2faEnabled(false);
      setQrCodeUrl("");
    } catch (error) {
      toast.error("Error disabling 2FA");
    } finally {
      setDisbledLoader(false);
    }
  };

  // Verify the 2FA
  const verify2FA = async () => {
    if (!code || code.trim().length === 0)
      return toast.error("Please Enter The Code To Verify");

    settwofaCodeLoader(true);
    try {
      const formData = new URLSearchParams();
      formData.append("code", code);
      await api.post(`/auth/verify-2fa`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      toast.success("2FA verified successful");
      setIs2faEnabled(true);
      setStep(1);
    } catch (error) {
      toast.error("Invalid 2FA Code");
    } finally {
      settwofaCodeLoader(false);
    }
  };

  // Update the credentials
  const handleUpdateCredential = async (data) => {
    const newUsername = data.username;
    const newPassword = data.password;
    try {
      setLoading(true);
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("newUsername", newUsername);
      formData.append("newPassword", newPassword);
      await api.post("/auth/update-credentials", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      toast.success("Update Credential successful");
    } catch (error) {
      toast.error("Update Credential failed");
    } finally {
      setLoading(false);
    }
  };

  // Set the status of current user
  useEffect(() => {
    if (currentUser?.id) {
      setValue("username", currentUser.username);
      setValue("email", currentUser.email);
      setAccountExpired(!currentUser.accountNonExpired);
      setAccountLock(!currentUser.accountNonLocked);
      setAccountEnabled(currentUser.enabled);
      setCredentialExpired(!currentUser.credentialsNonExpired);
      const expiredFormatDate = moment(
        currentUser?.credentialsExpiryDate
      ).format("D MMMM YYYY");
      setCredentialExpireDate(expiredFormatDate);
    }
  }, [currentUser, setValue]);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const lastLoginSession = moment
        .unix(decodedToken.iat)
        .format("dddd, D MMMM YYYY, h:mm A");
      setLoginSession(lastLoginSession);
    }
  }, [token]);

  // Update the AccountExpiryStatus
  const handleAccountExpiryStatus = async (event) => {
    setAccountExpired(event.target.checked);
    try {
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("expire", event.target.checked);
      await api.put("/auth/update-expiry-status", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      toast.success("Update Account Expirey Status");
    } catch (error) {
      toast.error("Update expirey status failed");
    } finally {
      setLoading(false);
    }
  };

  // Update the AccountLockStatus
  const handleAccountLockStatus = async (event) => {
    setAccountLock(event.target.checked);
    try {
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("lock", event.target.checked);
      await api.put("/auth/update-lock-status", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      toast.success("Update Account Lock Status");
    } catch (error) {
      toast.error("Update Account Lock status failed");
    } finally {
      setLoading(false);
    }
  };

  // Update the AccountEnabledStatus
  const handleAccountEnabledStatus = async (event) => {
    setAccountEnabled(event.target.checked);
    try {
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("enabled", event.target.checked);
      await api.put("/auth/update-enabled-status", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      toast.success("Update Account Enabled Status");
    } catch (error) {
      toast.error("Update Account Enabled status failed");
    } finally {
      setLoading(false);
    }
  };

  // Update the CredentialExpiredStatus
  const handleCredentialExpiredStatus = async (event) => {
    setCredentialExpired(event.target.checked);
    try {
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("expire", event.target.checked);
      await api.put("/auth/update-credentials-expiry-status", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      toast.success("Update Credentials Expiry Status");
    } catch (error) {
      toast.error("Credentials Expiry Status Failed");
    } finally {
      setLoading(false);
    }
  };

  // Two function for opening and closing the accordion
  const onOpenAccountHandler = () => {
    setOpenAccount(!openAccount);
    setOpenSetting(false);
  };
  
  const onOpenSettingHandler = () => {
    setOpenSetting(!openSetting);
    setOpenAccount(false);
  };

  if (pageError) {
    return <Errors message={pageError} />;
  }

  return (
    <div className="min-h-[calc(100vh-74px)] bg-slate-950 py-10 px-4">
      {pageLoader ? (
        <div className="flex flex-col justify-center items-center h-72">
          <Blocks
            height="70"
            width="70"
            color="#4fa94d"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            visible={true}
          />
          <span className="text-slate-300 mt-4">Please wait...</span>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Panel - Profile & Settings */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl shadow-black/30 p-6">
              {/* Profile Header */}
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="relative group">
                  {/* Main avatar circle */}
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-xl shadow-blue-500/30 ring-2 ring-blue-500/30 ring-offset-2 ring-offset-slate-900">
                    <span className="text-white text-3xl font-bold">
                      {currentUser?.username?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  
                  {/* Status indicator with its own ring */}
                  <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-slate-900"></div>
                  
                  {/* Hover effect ring */}
                  <div className="absolute inset-0 rounded-full ring-4 ring-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
                
                <div className="text-center">
                  <h3 className="font-bold text-2xl text-white">
                    {currentUser?.username}
                  </h3>
                  <p className="text-slate-400 mt-1">
                    {currentUser?.roles?.[0] || "User"}
                  </p>
                </div>
              </div>

              {/* User Info */}
              <div className="mb-6 space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-300">👤</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Username</p>
                    <p className="text-white font-medium">{currentUser?.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <span className="text-purple-300">👑</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Role</p>
                    <p className="text-white font-medium">
                      {currentUser && currentUser["roles"][0]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Update Credentials Accordion */}
              <Accordion 
                expanded={openAccount}
                className="!bg-transparent !shadow-none !border-none !mb-4"
                sx={{
                  '&:before': { display: 'none' },
                  '& .MuiAccordionSummary-root': {
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                  },
                  '& .MuiAccordionDetails-root': {
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    borderRadius: '0 0 12px 12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderTop: 'none',
                  }
                }}
              >
                <AccordionSummary
                  onClick={onOpenAccountHandler}
                  expandIcon={<ArrowDropDownIcon className="text-white" />}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <span className="text-emerald-300">🔐</span>
                    </div>
                    <div>
                      <h3 className="text-white text-lg font-semibold">
                        Update Credentials
                      </h3>
                      <p className="text-slate-400 text-sm">
                        Change username and password
                      </p>
                    </div>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <form
                    className="space-y-4 pt-3"
                    onSubmit={handleSubmit(handleUpdateCredential)}
                  >
                    <InputField
                      required
                      id="username"
                      type="text"
                      message="Username is required"
                      placeholder="Enter new username"
                      register={register}
                      errors={errors}
                      className="border-white/10 text-white placeholder:text-slate-500"
                    />
                    <InputField
                      required
                      id="email"
                      type="email"
                      message="Email is required"
                      placeholder="Email address"
                      register={register}
                      errors={errors}
                      readOnly
                      className="border-white/10 text-slate-400 placeholder:text-slate-500 bg-white/5"
                    />
                    <InputField
                      id="password"
                      type="password"
                      message="Password is required"
                      placeholder="Enter new password"
                      register={register}
                      errors={errors}
                      min={6}
                      className="border-white/10 text-white placeholder:text-slate-500"
                    />
                    <Buttons
                      disabled={loading}
                      className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/20"
                      type="submit"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Updating...
                        </span>
                      ) : (
                        "Update Credentials"
                      )}
                    </Buttons>
                  </form>
                </AccordionDetails>
              </Accordion>

              {/* Account Settings Accordion */}
              <Accordion 
                expanded={openSetting}
                className="!bg-transparent !shadow-none !border-none"
                sx={{
                  '&:before': { display: 'none' },
                  '& .MuiAccordionSummary-root': {
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                  },
                  '& .MuiAccordionDetails-root': {
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    borderRadius: '0 0 12px 12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderTop: 'none',
                  }
                }}
              >
                <AccordionSummary
                  onClick={onOpenSettingHandler}
                  expandIcon={<ArrowDropDownIcon className="text-white" />}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <span className="text-amber-300">⚙️</span>
                    </div>
                    <div>
                      <h3 className="text-white text-lg font-semibold">
                        Account Settings
                      </h3>
                      <p className="text-slate-400 text-sm">
                        Manage account security settings
                      </p>
                    </div>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="space-y-4 pt-3">
                    {/* Account Status Switches */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div>
                        <h4 className="text-white font-medium">Account Expired</h4>
                        <p className="text-slate-400 text-sm">Toggle account expiry status</p>
                      </div>
                      <Switch
                        checked={accountExpired}
                        onChange={handleAccountExpiryStatus}
                        color="warning"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div>
                        <h4 className="text-white font-medium">Account Locked</h4>
                        <p className="text-slate-400 text-sm">Lock/unlock your account</p>
                      </div>
                      <Switch
                        checked={accountLocked}
                        onChange={handleAccountLockStatus}
                        color="warning"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div>
                        <h4 className="text-white font-medium">Account Enabled</h4>
                        <p className="text-slate-400 text-sm">Enable/disable your account</p>
                      </div>
                      <Switch
                        checked={accountEnabled}
                        onChange={handleAccountEnabledStatus}
                        color="success"
                      />
                    </div>

                    {/* Credential Expiry Info */}
                    <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                      <h4 className="text-white font-medium mb-2">Credential Expiry</h4>
                      <p className="text-slate-300 text-sm">
                        Your credentials will expire on{" "}
                        <span className="text-white font-semibold">{credentialExpireDate}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div>
                        <h4 className="text-white font-medium">Credentials Expired</h4>
                        <p className="text-slate-400 text-sm">Toggle credential expiry status</p>
                      </div>
                      <Switch
                        checked={credentialExpired}
                        onChange={handleCredentialExpiredStatus}
                        color="warning"
                      />
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>

              {/* Last Login Session */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-300">📅</span>
                  </div>
                  <h3 className="text-white text-lg font-semibold">Last Login Session</h3>
                </div>
                <p className="text-slate-300 text-sm">
                  Your last login was on{" "}
                  <span className="text-white font-medium">{loginSession}</span>
                </p>
              </div>
            </div>

            {/* Right Panel - 2FA Authentication */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl shadow-black/30 p-6">
              <div className="space-y-4">
                {/* 2FA Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-white text-2xl font-bold">Two-Factor Authentication</h1>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          is2faEnabled
                            ? "bg-emerald-500/20 text-emerald-500"
                            : "bg-red-500/30 text-red-500"
                        }`}
                      >
                        {is2faEnabled ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </div>
                    <p className="text-slate-400">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500 flex items-center justify-center">
                    <span className="text-white text-xl">🔒</span>
                  </div>
                </div>

                {/* 2FA Status Card */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-white font-semibold">Security Status</h3>
                      <p className="text-slate-400 text-sm">
                        {is2faEnabled ? "Enhanced protection active" : "Basic protection active"}
                      </p>
                    </div>
                    <div className={`h-3 w-3 rounded-full ${is2faEnabled ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Account Protection</span>
                      <span className={`text-sm font-medium ${is2faEnabled ? "text-emerald-400" : "text-amber-400"}`}>
                        {is2faEnabled ? "Maximum" : "Standard"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Verification Level</span>
                      <span className="text-sm font-medium text-blue-400">
                        {is2faEnabled ? "Two-Factor" : "Single-Factor"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2FA Action Button */}
                <Buttons
                  disabled={disabledLoader}
                  onClickhandler={is2faEnabled ? disable2FA : enable2FA}
                  className={`w-full py-3.5 rounded-xl font-semibold ${
                    is2faEnabled
                      ? "bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600"
                      : "bg-gradient-to-r from-blue-600 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500"
                  } text-white transition-all shadow-lg shadow-purple-500/20`}
                >
                  {disabledLoader ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing...
                    </span>
                  ) : is2faEnabled ? (
                    "Disable Two-Factor Authentication"
                  ) : (
                    "Enable Two-Factor Authentication"
                  )}
                </Buttons>

                {/* QR Code Section */}
                {step === 2 && (
                  <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        <span className="text-amber-300">📱</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Scan QR Code</h3>
                        <p className="text-slate-400 text-sm">
                          Use Google Authenticator or similar app
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center space-y-4">
                      <div className="p-4 bg-white rounded-lg">
                        <img 
                          src={qrCodeUrl} 
                          alt="QR Code" 
                          className="h-48 w-48"
                        />
                      </div>
                      
                      <div className="w-full space-y-3">
                        <div className="text-center">
                          <p className="text-slate-300 text-sm mb-2">
                            Enter the 6-digit code from your authenticator app
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter 2FA code"
                            value={code}
                            required
                            className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            onChange={(e) => setCode(e.target.value)}
                          />
                          <Buttons
                            onClickhandler={verify2FA}
                            className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-amber-600 to-orange-500 text-white hover:from-amber-700 hover:to-orange-600 transition-all"
                          >
                            {twofaCodeLoader ? (
                              <span className="flex items-center justify-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Verifying...
                              </span>
                            ) : (
                              "Verify"
                            )}
                          </Buttons>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Tips */}
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                  <h4 className="text-white font-semibold mb-2">Security Tips</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">✓</span>
                      <span>Keep your backup codes in a safe place</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">✓</span>
                      <span>Use a trusted authenticator app</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">✓</span>
                      <span>Enable 2FA for maximum security</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;