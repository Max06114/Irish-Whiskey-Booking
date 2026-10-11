import React from 'react';
import { motion } from 'framer-motion';
import LazyImage from './LazyImage';

const DayCard = ({ day, title, description, image, alt, distillery, accommodation, dinner }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl overflow-hidden border border-[#E6DEC8] hover:shadow-lg transition-shadow"
    >
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 h-72">
          <LazyImage
            src={image}
            alt={alt}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:col-span-2 p-6">
          <div className="mb-3">
            <h3 className="font-serif text-xl font-bold text-[#1D1D1D]">{title}</h3>
          </div>
          <p className="text-[#5A544C] mb-3 leading-relaxed">
            {description}
          </p>
          <div className="text-sm text-[#74CF6C] font-medium">
            {distillery && `🥃 ${distillery} · `}
            {accommodation && `🏨 ${accommodation}`}
            {dinner && ` · 🍽️ Abendessen inkludiert`}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DayCard;
