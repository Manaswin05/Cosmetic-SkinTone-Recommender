import React from "react";
import { motion } from "motion/react";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";

export default function OurStory() {
  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface">
      {/* HERO SECTION */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/10 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1615280825886-fa817c0a06cc?q=80&w=2574&auto=format&fit=crop"
          alt="Creative process"
          className="absolute inset-0 w-full h-full object-cover grayscale-[30%] opacity-80"
        />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-serif text-white uppercase tracking-[0.2em] mb-6"
          >
            The Lumina Vision
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-white/90 font-light tracking-wide max-w-2xl mx-auto leading-relaxed"
          >
            Bridging the gap between cutting-edge artificial intelligence and the nuanced art of editorial beauty.
          </motion.p>
        </div>
      </section>

      {/* FOUNDER STORY */}
      <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-start justify-between mb-24 mt-12">
          {/* Left: Heading */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            <span className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase mb-6 block">Meet the Creator</span>
            <h2 className="text-5xl md:text-6xl font-serif text-slate-900 leading-[1.1]">Manaswin<br />Sripatnala.</h2>
          </motion.div>

          {/* Right: Text */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:w-1/2 max-w-lg md:pt-4"
          >
            <p className="text-slate-600 mb-6 leading-relaxed font-light text-lg">
              Lumina Beauty was born from an intersection of passions: computer vision and aesthetic design. Recognizing that the cosmetic industry often relied on subjective color matching, I set out to build an objective, data-driven solution.
            </p>
            <p className="text-slate-600 leading-relaxed font-light text-lg">
              By utilizing OpenCV and advanced skin-tone analysis algorithms, Lumina creates a mathematically precise harmony between a user's biological undertones and cosmetic shades, presented in a highly clinical, yet beautifully editorial format.
            </p>
          </motion.div>
        </div>

        {/* SOCIAL CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-32">
          {/* GitHub Card */}
          <motion.a 
            href="https://github.com/Manaswin05" 
            target="_blank" 
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="group block p-10 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-500 relative"
          >
            <div className="absolute top-8 right-8 text-slate-300 group-hover:text-slate-900 transition-colors duration-500">
              <ExternalLink size={20} />
            </div>
            <div className="mb-12 text-slate-900 group-hover:-translate-y-1 transition-transform duration-500">
              <Github size={32} />
            </div>
            <h3 className="text-3xl font-serif text-slate-900 mb-3">GitHub</h3>
            <span className="block text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-8">@Manaswin05</span>
            <p className="text-slate-600 font-light leading-relaxed">
              Open-source projects, experiments, and the code behind our vision.
            </p>
          </motion.a>

          {/* LinkedIn Card */}
          <motion.a 
            href="https://linkedin.com/in/manaswin-sripatnala" 
            target="_blank" 
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="group block p-10 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-500 relative"
          >
            <div className="absolute top-8 right-8 text-slate-300 group-hover:text-slate-900 transition-colors duration-500">
              <ExternalLink size={20} />
            </div>
            <div className="mb-12 text-slate-900 group-hover:-translate-y-1 transition-transform duration-500">
              <Linkedin size={32} />
            </div>
            <h3 className="text-3xl font-serif text-slate-900 mb-3">LinkedIn</h3>
            <span className="block text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-8">/in/manaswin-sripatnala</span>
            <p className="text-slate-600 font-light leading-relaxed">
              Professional journey — updates, milestones, and opportunities to connect.
            </p>
          </motion.a>
        </div>

        {/* FOOTER CALL TO ACTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center pb-8"
        >
          <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-6 block">Get In Touch</span>
          <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-8 italic">Want to collaborate or just say hi?</h2>
          <p className="text-slate-600 font-light">
            Connect with me on <a href="https://linkedin.com/in/manaswin-sripatnala" target="_blank" rel="noopener noreferrer" className="text-slate-900 border-b border-slate-300 hover:border-slate-900 transition-colors pb-1">LinkedIn</a> — I'd love to hear from you.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
