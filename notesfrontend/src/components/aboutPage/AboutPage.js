import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaShieldAlt, FaLock, FaGlobe, FaUserCheck } from "react-icons/fa";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const AboutPage = () => {
  const features = [
    {
      icon: <FaShieldAlt />,
      title: "End-to-End Encryption",
      description: "Your notes are encrypted from the moment you create them"
    },
    {
      icon: <FaLock />,
      title: "2FA Authentication",
      description: "Add an extra layer of security with two-factor authentication"
    },
    {
      icon: <FaGlobe />,
      title: "Cloud Sync",
      description: "Access your notes from anywhere with secure cloud storage"
    },
    {
      icon: <FaUserCheck />,
      title: "User-Friendly",
      description: "Intuitive design that's easy to use for everyone"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-74px)] bg-slate-950 text-slate-100">
      {/* Background effects */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.12),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(236,72,153,0.1),transparent_32%),radial-gradient(circle_at_50%_80%,rgba(56,189,248,0.08),transparent_38%)]" />
        
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 ring-1 ring-white/10 mb-6">
              About Noteworthy
            </div>
            
            <h1 className="font-montserrat text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Secure Your Thoughts, <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Protect Your Ideas</span>
            </h1>
            
            <p className="text-lg text-slate-200/80 leading-relaxed mb-8">
              Welcome to Noteworthy, your trusted companion for secure and private note-taking. 
              We believe in providing a safe space where your thoughts and ideas are protected 
              with the highest level of security. Our mission is to ensure that your notes are 
              always accessible to you and only you.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 my-12">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  transition={{ delay: 0.1 * index }}
                  className="bg-slate-900/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="inline-flex h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 items-center justify-center text-blue-300 text-xl mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-6">Connect With Us</h2>
              <div className="flex flex-wrap gap-4">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://www.facebook.com/people/Anubhav-Singh-Rajput/100058448296720/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                >
                  <FaFacebookF size={20} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://twitter.com/anubhavsingh04"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center text-white hover:shadow-lg hover:shadow-sky-500/30 transition-all"
                >
                  <FaTwitter size={20} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://www.linkedin.com/in/anubhavsingh07/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                >
                  <FaLinkedinIn size={20} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://www.instagram.com/anubhav_singh_07/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center text-white hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                >
                  <FaInstagram size={20} />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;