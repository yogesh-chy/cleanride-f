"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { X, Play } from "lucide-react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const galleryItems = [
  { src: gallery1, alt: "Hand polishing car", category: "Detailing", type: "image" as const },
  { src: gallery2, alt: "SUV in car wash tunnel", category: "Exterior Wash", type: "image" as const },
  { src: gallery3, alt: "Motorcycle cleaning", category: "Bike Wash", type: "image" as const },
  { src: gallery4, alt: "Interior cleaning", category: "Interior", type: "image" as const },
  { src: gallery5, alt: "Clean car finish", category: "Results", type: "image" as const },
  { src: gallery6, alt: "Ceramic coating application", category: "Ceramic Coating", type: "image" as const },
];

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<any>(null);

  return (
    <section id="gallery" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-body text-xs tracking-[0.3em] text-primary uppercase">Our Work</span>
          <h2 className="font-heading text-4xl md:text-6xl font-bold mt-2 mb-4">
            OUR <span className="text-gradient">GALLERY</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See the quality of our work — from exterior washes to full ceramic coating applications.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
               className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-[4/3] shadow-card hover:shadow-glow"
              onClick={() => setSelectedImage(item.src)}
            >
              <img
                src={item.src.src}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                width={800}
                height={600}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/70 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 text-center px-4">
                  <span className="font-heading text-xl font-bold text-foreground block mb-2">{item.category}</span>
                  <div className="w-10 h-1 bg-primary mx-auto mb-3" />
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-widest font-bold">Details Reveal</p>
                </div>
              </div>
              {/* Category badge */}
              <div className="absolute top-4 left-4 z-20">
                <span className="px-4 py-1.5 rounded-full text-[10px] font-heading font-bold tracking-widest bg-primary/90 text-primary-foreground uppercase shadow-lg">
                  {item.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Embed Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h3 className="font-heading text-3xl font-bold text-center mb-10 tracking-tight uppercase italic">
            WATCH US <span className="text-gradient">IN ACTION</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ y: -8 }}
              className="relative rounded-2xl overflow-hidden aspect-video bg-secondary border border-white/5 flex items-center justify-center group cursor-pointer shadow-2xl"
            >
              <img
                src={gallery2.src}
                alt="Car wash process video thumbnail"
                className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                width={800}
                height={600}
              />
              <div className="absolute inset-0 bg-background/20 group-hover:bg-background/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  whileHover={{ scale: 1.15, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-glow"
                >
                  <Play className="w-8 h-8 text-primary-foreground ml-1" />
                </motion.div>
              </div>
              <div className="absolute bottom-6 left-6 z-10">
                <span className="font-heading text-lg text-foreground uppercase tracking-wider bg-background/80 px-4 py-1 rounded-lg backdrop-blur-sm border border-white/5">Full Exterior Wash Process</span>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ y: -8 }}
              className="relative rounded-2xl overflow-hidden aspect-video bg-secondary border border-white/5 flex items-center justify-center group cursor-pointer shadow-2xl"
            >
              <img
                src={gallery4.src}
                alt="Interior detailing video thumbnail"
                className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                width={800}
                height={600}
              />
              <div className="absolute inset-0 bg-background/20 group-hover:bg-background/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                   whileHover={{ scale: 1.15, rotate: 90 }}
                   whileTap={{ scale: 0.9 }}
                   className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-glow"
                >
                  <Play className="w-8 h-8 text-primary-foreground ml-1" />
                </motion.div>
              </div>
              <div className="absolute bottom-6 left-6 z-10">
                <span className="font-heading text-lg text-foreground uppercase tracking-wider bg-background/80 px-4 py-1 rounded-lg backdrop-blur-sm border border-white/5">Interior Deep Clean Process</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-background/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-foreground hover:text-primary transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          <motion.img
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            src={selectedImage.src}
            alt="Gallery full view"
            className="max-w-full max-h-[85vh] rounded-xl object-contain"
          />
        </motion.div>
      )}
    </section>
  );
};

export default GallerySection;
