import React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function Journal() {
  const articles = [
    {
      title: "The Science of Undertones",
      category: "Education",
      date: "May 12, 2026",
      image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=2674&auto=format&fit=crop",
      excerpt: "Why warm, cool, and neutral are just the beginning of understanding your biological color signature.",
    },
    {
      title: "Algorithms Meets Aesthetics",
      category: "Technology",
      date: "April 28, 2026",
      image: "https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=2671&auto=format&fit=crop",
      excerpt: "How OpenCV and computer vision are replacing the department store makeup counter.",
    },
    {
      title: "The Perfect Shade Match",
      category: "Editorial",
      date: "April 15, 2026",
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2670&auto=format&fit=crop",
      excerpt: "Our curated list of the most universally adaptable foundation formulations of the year.",
    },
    {
      title: "Lighting & Color Accuracy",
      category: "Photography",
      date: "March 30, 2026",
      image: "https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=2574&auto=format&fit=crop",
      excerpt: "Why the light you take your selfie in matters more than the camera you use.",
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-on-surface pb-24">
      {/* MAGAZINE HEADER */}
      <div className="pt-32 pb-16 px-6 text-center border-b border-slate-200 mb-16">
        <span className="text-xs font-bold tracking-[0.3em] text-slate-500 uppercase mb-4 block">The Lumina Issue</span>
        <h1 className="text-5xl md:text-7xl font-serif text-slate-900 uppercase tracking-widest">Journal</h1>
        <div className="w-24 h-[1px] bg-slate-900 mx-auto mt-8" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* FEATURED ARTICLE */}
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-24 items-center group cursor-pointer"
        >
          <div className="w-full lg:w-3/5 overflow-hidden rounded-xl aspect-video lg:aspect-[4/3] relative">
            <img 
              src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=2574&auto=format&fit=crop" 
              alt="Featured" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase text-slate-900">
              Featured
            </div>
          </div>
          
          <div className="w-full lg:w-2/5 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4 text-xs font-semibold tracking-widest uppercase text-slate-500">
              <span>Innovation</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>May 20, 2026</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6 leading-tight group-hover:text-slate-600 transition-colors">
              The Future of Personalized Beauty Profiles
            </h2>
            
            <p className="text-slate-600 mb-8 leading-relaxed font-light text-lg">
              We are entering an era where beauty is no longer defined by generic categories, but by mathematically precise individual profiles. Discover how AI is rewriting the rules of the aesthetic industry.
            </p>
            
            <a 
              href="/catalogue.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-slate-900 border-b border-transparent hover:border-slate-900 self-start pb-1 transition-all group/link"
            >
              <span>Read Full Article</span>
              <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.article>

        {/* LATEST POSTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-16">
          {articles.map((article, idx) => (
            <motion.article 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group cursor-pointer flex flex-col"
            >
              <div className="overflow-hidden rounded-xl aspect-[4/5] mb-6 relative">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              <div className="flex items-center gap-3 mb-3 text-[10px] font-bold tracking-widest uppercase text-slate-500">
                <span className="text-slate-800">{article.category}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span>{article.date}</span>
              </div>
              
              <h3 className="text-xl font-serif text-slate-900 mb-3 leading-snug group-hover:text-slate-600 transition-colors">
                {article.title}
              </h3>
              
              <p className="text-sm text-slate-600 leading-relaxed font-light mb-4 flex-1">
                {article.excerpt}
              </p>

              <a 
                href="/catalogue.pdf" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-slate-900 mt-2 hover:opacity-70 transition-opacity"
              >
                <span>Read</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
