import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaClock } from "react-icons/fa";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    mode: "onChange", // Validate on change for real-time feedback
  });

  // Watch form values
  const watchAllFields = watch();

  // Auto-hide errors after 2 seconds when fields become valid
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

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      reset();
      setLoading(false);
      setSubmitAttempted(false);
      setShowErrors(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <FaEnvelope />,
      title: "Email",
      value: "noteworthy@gmail.com",
      description: "Drop us an email",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FaPhone />,
      title: "Phone",
      value: "+1 (555) 123-4567",
      description: "Mon-Fri from 9am to 6pm",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Location",
      value: "San Francisco, CA",
      description: "Based in the heart of tech",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <FaClock />,
      title: "Response Time",
      value: "Within 24 hours",
      description: "We value your time",
      color: "from-amber-500 to-orange-500"
    }
  ];

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
    <div className="min-h-[calc(100vh-74px)] bg-slate-950">
      {/* Background effects */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.06),transparent_40%)]" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Header Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-12 lg:mb-16"
          >
            
            <h1 className="font-montserrat text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Get In <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Touch</span>
            </h1>
            
            <p className="text-lg text-slate-300 leading-relaxed">
              Have questions or feedback? We're here to help. Reach out and we'll get back to you as soon as possible.
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Contact Information */}
            <div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    variants={fadeIn}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ y: -4 }}
                    className="bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:border-blue-500/30 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <div className="text-white text-lg mx-2">{info.icon}</div>
                      </div>
                      <div className="flex-1 ">
                        <h3 className="text-white font-semibold mb-1 text-base">{info.title}</h3>
                        <p className="text-slate-100 font-medium text-sm mb-1 ">{info.value}</p>
                        <p className="text-slate-400 text-xs">{info.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Support Card */}
              <div
                variants={fadeIn}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <FaClock className="text-blue-300 text-lg" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Business Hours</h3>
                    <div className="space-y-1">
                      <p className="text-slate-300 text-sm">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-slate-300 text-sm">Saturday - Sunday: 10:00 AM - 4:00 PM</p>
                    </div>
                    <p className="text-blue-300 text-xs mt-3">💡 We typically respond within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: 0.2 }}
              className="lg:sticky lg:top-24"
            >
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl shadow-black/30 p-6 sm:p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Send us a message</h2>
                  <p className="text-slate-400 text-sm">
                    Fill out the form below and we'll get back to you shortly.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-5">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-slate-300">
                      Your Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      {...register("name", { 
                        required: "Name is required",
                        minLength: { value: 2, message: "Name must be at least 2 characters" }
                      })}
                      type="text"
                      id="name"
                      placeholder="John Doe"
                      className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border ${getInputBorderClass("name")} text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                    />
                    {shouldShowError("name") && (
                      <div className="flex items-center gap-2 mt-1 animate-fadeIn">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-400"></div>
                        <p className="text-sm font-medium text-red-400">
                          {errors.name.message}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-slate-300">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Please enter a valid email address"
                        }
                      })}
                      type="email"
                      id="email"
                      placeholder="john@example.com"
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
                  </div>
                  
                  {/* Message Field */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-slate-300">
                      Your Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      {...register("message", { 
                        required: "Message is required",
                        minLength: { 
                          value: 10, 
                          message: "Please write at least 10 characters" 
                        },
                        maxLength: {
                          value: 500,
                          message: "Message cannot exceed 500 characters"
                        }
                      })}
                      id="message"
                      placeholder="Tell us how we can help you..."
                      rows="4"
                      className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border ${getInputBorderClass("message")} text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none`}
                    />
                    {shouldShowError("message") && (
                      <div className="flex items-center gap-2 mt-1 animate-fadeIn">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-400"></div>
                        <p className="text-sm font-medium text-red-400">
                          {errors.message.message}
                        </p>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <div>
                        {submitAttempted && showErrors && !errors.message && watchAllFields.message?.length >= 10 && (
                          <div className="flex items-center gap-1 text-emerald-400 text-xs">
                            <span>✓</span>
                            <span>Looks good!</span>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">
                        {watchAllFields.message?.length || 0}/500 characters
                      </span>
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>

                  {/* Form status indicator */}
                  {submitAttempted && showErrors && Object.keys(errors).length > 0 && (
                    <div className="flex items-center gap-2 text-amber-400 text-sm bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                      <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></div>
                      <span>Please fix the errors above before submitting</span>
                    </div>
                  )}
                </form>

                {/* Privacy Note */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-slate-500 text-xs text-center">
                    Your information is secure. We respect your privacy and will never share your details.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Note */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-slate-400 text-sm">
              Need immediate assistance? Call us at{" "}
              <span className="text-blue-300 font-medium">+1 (555) 123-4567</span>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;