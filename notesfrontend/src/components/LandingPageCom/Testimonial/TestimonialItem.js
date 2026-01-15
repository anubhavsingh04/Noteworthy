import React from "react";
import Avatar from "@mui/material/Avatar";
import { motion } from "framer-motion";
import { grey } from '@mui/material/colors';

const TestimonialItem = ({ title, text, name, status, imgurl }) => {
  function getFirstLetter(name = '') {
    const trimmed = name.trim();
    return trimmed ? trimmed[0].toUpperCase() : '?';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 120 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="flex flex-col p-6 shadow-md bg-slate-900 rounded-md hover:bg-slate-800 transition-colors duration-300"
    >
      <h1 className="text-slate-400 font-montserrat text-2xl font-bold pb-6">
        {title}
      </h1>

      <p className="text-base text-slate-300 leading-relaxed mb-4">{text}</p>

      <div className="pt-5 flex gap-4 items-center border-t border-slate-700">
        <Avatar 
          alt={name} 
          src={imgurl} 
          sx={{ 
            bgcolor: grey[800],
            width: 48,
            height: 48,
            fontSize: '1.2rem'
          }}
        >
          {getFirstLetter(name)}
        </Avatar>
        
        <div className="flex flex-col">
          <span className="font-semibold text-slate-100 text-lg">{name}</span>
          <span className="text-slate-400 text-sm">{status}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialItem;