import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, ArrowLeft, ArrowRight, Sparkles, SlidersHorizontal, X } from "lucide-react";
import { Link } from "react-router-dom";

const PRODUCTS = [
  {
    id: 1,
    name: "Radiance Serum Foundation",
    brand: "Lumina Beauty",
    price: "$58",
    rating: 4.5,
    reviews: 128,
    isMatch: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAW3-jR6CPjhCyzJdHN1v6A_Dl4nJAr-YUK1rsNCXjgXxUOUYrwU--1k9PGJouVP9epzszi1k35_CA1KyzlDqJlEQI2Knp8NbQPAeX99xFkyV3PFQmE6qygzKpDPpHR94B0gtZofYOLCpbvB372p5Q8LPfAP3XqTl5F6et_MzY5-1iWb7uRGhImnLfQ2XcVZ9PdkCs4jG4-NaF52QcCgPwYpZVcna10tgG3spnJUZiggFvVybR5MgcMtTiauBF5HFaLkSMSdQAdmOL3",
  },
  {
    id: 2,
    name: "Velvet Matte Base",
    brand: "Lumina Beauty",
    price: "$45",
    rating: 5,
    reviews: 340,
    isMatch: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1vxSYZe0imDvQ-ex1hsi-woTBmqQQM5cYIKCn7jRQv4Gl0VxG_e2Q5J1haJVPYlOw7Vci-3mB1rsDCgGSoFiKYiuFI-_XQYuwZVGBd3-3NVWYErU8rpZ10BvxBoT_hLCYCflrG3cI2GuKmSXSthDunjODS6w3SN7usej62tXAWQFnKXxCo2Hyb7DYmKdO7j5vAWblyr847qAmfPbqYHTiGV3ADmymQykBbFgZnGly0xYbzo1SjMkPKNF_e0N4dfXIzyBptkGmiRee",
  },
  {
    id: 3,
    name: "Dewy Glow Cushion",
    brand: "Silk & Stone",
    price: "$72",
    rating: 4,
    reviews: 92,
    isMatch: false,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgEhf-EuJN-s-vB1hmBq3I-bt4QzQwllW2OCpEAN7obtC10Ba5yenFCz85jrCOIoYNfz5t9QHOa6822Wha1WvQlyu8WKdM4WYFwMOQ6ADKCvdbnTtQ3nLJ2QjaR5jdCTUicN-WS_QKroH2BRJVK9qBRNfVQSPHXedXMAdkmEXZ1z3Ihetl7tB2hCPTeW5deP-XWN-Av5v4Z2mD5qo4f8LlvwAjuhvVvqm8FEhPnwfq5Fon0pVyfCNStHB18bSnS5OcDGYjOEgDvKkt",
  },
  {
    id: 4,
    name: "Pure Skin Tint",
    brand: "Lumina Beauty",
    price: "$38",
    rating: 5,
    reviews: 512,
    isMatch: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJkCyYLutp3nXSfldsuceX1vCNgL6fKkznZ57_tIGnVJRkb4avMeLPehcwpn09-fK67J0VlyNTmLzipCtKG7gXWV3vN_lPqX6CaX2-xq8RTZI4TRn89MV4NeGtjdi5VgMbH50Wq4OKND0cZ44qTPl3byYmSecmAQDiacwQPz78Gswm2t9c6Dz_5smBoSthpy62Zcgbh5AxVvskTShA-B6HVXrk_Mv1EvK8RCss605_Ssv5lX4Xpu5634vZpLfQHzuB4ZugDD9ltFXb",
  },
  {
    id: 5,
    name: "Essential Finish Balm",
    brand: "Aether Glow",
    price: "$64",
    rating: 4,
    reviews: 115,
    isMatch: false,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGBqzz9onaD3LUz7Z8Il4eFVY3M6ZXlVj5e-23oIbarWdRhpP5FOAMySp-MolHbD1VrdxzEXFz4nxDAC4v_aji27CNrlgu750LMIPE2jlwfr9ue10_k1czv30y0NPnRG9IqrNJ-7v96NfkCP4Az5Azl05NOp5C8b173-ni28qxgtUqTYuQUDqdWt1WLVuIVgpc-ow6llUtRWF4F_PcRfzPErL3x1Y4Exm1nnvZNwzwmWqM6tk3XEBfmbpDCeBH-T2YNOEd-H84u5UQ",
  },
  {
    id: 6,
    name: "Ultra Definition HD",
    brand: "Silk & Stone",
    price: "$80",
    rating: 5,
    reviews: 210,
    isMatch: false,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaJk_fA257wf5Mrar0mBK_nNtUUI9n5o4hCkkXhFxebQsNwk3O5wONuie6MSNn78PaTcBdXg6L2ksKBn_MWTqWjGVFHSh848gpkeuPh3LJa6rnZVymkbrOoE3dCq3-Z8UiB8zrEjv-f9lVvAsg5uK0qawyxdxWbTkqyGgz9LKUuy1hyeml8Td7xUDLRKKfkAjLvybFHGPFnZbwxo_T66zOgdfjiRP4oUmuOhgMiG7EaXH_INfzTF0I7sPRjLU-qYCJKXOqgWFl5pyh",
  },
];

export default function Shop() {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-[1280px] mx-auto px-4 md:px-12 py-8 md:py-12"
    >
      {/* Search Result Banner */}
      <section className="mb-10 md:mb-16 bg-primary rounded-[28px] md:rounded-[40px] p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center text-white shadow-2xl shadow-primary/20 relative overflow-hidden gap-6">
        <div className="z-10 flex items-center gap-5 md:gap-8">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20 flex-shrink-0">
            <Sparkles size={22} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="font-sans font-bold text-[10px] uppercase opacity-70 tracking-[0.4em] mb-1 text-left">
              Current Signature
            </h2>
            <p className="font-serif italic text-2xl md:text-4xl text-white tracking-tighter">
              Sand Medium <span className="opacity-50">—</span> <span className="italic font-normal">Optimal</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6 z-10 w-full md:w-auto justify-between md:justify-end">
          <div>
            <p className="font-sans font-bold text-[9px] uppercase opacity-60 tracking-[0.3em] mb-1">Stock Status</p>
            <p className="font-sans font-bold text-[13px] tracking-tight">42 Curations</p>
          </div>
          <button className="bg-white text-primary px-6 py-3 md:px-8 md:py-4 rounded-2xl font-sans font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg hover:translate-y-px transition-all">
            Sort: Priority
          </button>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-primary-container/20 rounded-full blur-[60px]" />
      </section>

      {/* Mobile filter toggle */}
      <div className="md:hidden mb-6">
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className="flex items-center gap-3 px-5 py-3 border border-outline rounded-2xl font-sans font-bold text-[11px] uppercase tracking-[0.2em] text-on-surface-variant w-full justify-center"
        >
          <SlidersHorizontal size={15} />
          {filtersOpen ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-10 md:gap-16">
        {/* Sidebar Filters */}
        <AnimatePresence>
          {(filtersOpen || true) && (
            <motion.aside
              key="filters"
              initial={false}
              className={`w-full md:w-72 flex-shrink-0 space-y-10 md:space-y-16 ${filtersOpen ? "block" : "hidden md:block"}`}
            >
              <div className="bg-surface p-6 md:p-10 rounded-[28px] md:rounded-[40px] border border-outline/50">
                <div className="mb-8 md:mb-12">
                  <h3 className="font-sans font-bold text-[10px] uppercase tracking-[0.4em] text-primary mb-6 md:mb-8">
                    The Origins
                  </h3>
                  <div className="space-y-4 md:space-y-5">
                    {["Lumina Beauty", "Silk & Stone", "Aether Glow"].map((brand) => (
                      <label key={brand} className="flex items-center gap-4 cursor-pointer group">
                        <div className="w-2 h-2 rounded-full border border-outline-variant group-hover:bg-primary group-hover:border-primary transition-all flex-shrink-0"></div>
                        <span className="font-serif italic text-[15px] md:text-[16px] text-on-surface-variant group-hover:text-primary transition-colors">
                          {brand}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-8 md:mb-12">
                  <h3 className="font-sans font-bold text-[10px] uppercase tracking-[0.4em] text-primary mb-6 md:mb-8">
                    Saturation
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {["Sheer", "Medium", "Full"].map((cov) => (
                      <button
                        key={cov}
                        className={`px-4 py-2 rounded-xl text-[10px] font-sans font-bold uppercase tracking-[0.2em] transition-all shadow-sm ${
                          cov === "Medium" ? "bg-primary text-white" : "bg-white text-on-surface-variant border border-outline hover:border-primary"
                        }`}
                      >
                        {cov}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-sans font-bold text-[10px] uppercase tracking-[0.4em] text-primary mb-6 md:mb-8">
                    The Path
                  </h3>
                  <div className="space-y-4 md:space-y-5">
                    {["Matte", "Dewy", "Natural Satin"].map((finish) => (
                      <label key={finish} className="flex items-center gap-4 cursor-pointer group">
                        <div className="w-2 h-2 rounded-full border border-outline-variant flex-shrink-0">
                          {finish === "Dewy" && <div className="w-full h-full bg-secondary rounded-full"></div>}
                        </div>
                        <span className="font-serif italic text-[15px] md:text-[16px] text-on-surface-variant group-hover:text-secondary transition-colors">
                          {finish}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 rounded-[28px] md:rounded-[40px] p-6 md:p-8 border border-primary/10">
                <p className="font-serif italic text-[13px] text-primary leading-relaxed">"Nature does not hurry, yet everything is accomplished."</p>
                <p className="text-[9px] font-sans font-bold uppercase tracking-[0.3em] mt-4 text-primary/60">— Origin Guide</p>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <section className="flex-1 min-w-0">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-10 gap-y-10 md:gap-y-20">
            {PRODUCTS.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="group relative flex flex-col">
                <div className="aspect-[3/4] rounded-[28px] md:rounded-[48px] overflow-hidden bg-surface mb-4 md:mb-8 relative border border-outline/30 shadow-sm transition-all duration-700 hover:shadow-2xl hover:shadow-primary/5">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  {product.isMatch && (
                    <div className="absolute top-3 left-3 md:top-6 md:left-6 bg-secondary text-white px-3 py-1 md:px-5 md:py-2 rounded-full font-sans font-bold text-[8px] md:text-[9px] uppercase tracking-[0.2em] shadow-xl">
                      Origin Match
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-8 bg-gradient-to-t from-black/20 to-transparent translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hidden md:block">
                    <div className="bg-white text-primary w-full py-4 rounded-[20px] font-sans font-bold text-[10px] uppercase tracking-[0.2em] text-center shadow-2xl">
                      View Protocol
                    </div>
                  </div>
                </div>
                <div className="px-1 md:px-5">
                  <p className="font-serif italic text-[12px] md:text-[14px] text-on-surface-variant mb-1 opacity-60">
                    {product.brand}
                  </p>
                  <h4 className="font-serif italic text-base md:text-2xl text-on-surface mb-2 group-hover:text-primary transition-colors leading-tight">
                    {product.name}
                  </h4>
                  <div className="flex justify-between items-center">
                    <span className="font-sans font-bold text-[13px] md:text-[15px] text-primary tracking-tight">{product.price}</span>
                    <div className="flex items-center gap-1 text-secondary/30">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={9}
                          fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                          stroke={i < Math.floor(product.rating) ? "none" : "currentColor"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-16 md:mt-32 flex justify-center items-center gap-8 md:gap-12 border-t border-outline/30 py-10 md:py-16">
            <button className="text-on-surface-variant/40 hover:text-primary transition-colors">
              <ArrowLeft size={18} />
            </button>
            <div className="flex gap-6 md:gap-10">
              <span className="font-serif italic text-xl md:text-2xl text-primary border-b border-primary pb-1">1</span>
              <span className="font-serif italic text-xl md:text-2xl text-on-surface-variant/30 hover:text-primary cursor-pointer transition-all">2</span>
              <span className="font-serif italic text-xl md:text-2xl text-on-surface-variant/30 hover:text-primary cursor-pointer transition-all">3</span>
            </div>
            <button className="text-on-surface-variant/40 hover:text-primary transition-colors">
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
      {/* Search Result Banner */}
      <section className="mb-16 bg-primary rounded-[40px] p-10 flex flex-col md:flex-row justify-between items-center text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
        <div className="z-10 flex items-center gap-8">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20">
            <Sparkles size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="font-sans font-bold text-[10px] uppercase opacity-70 tracking-[0.4em] mb-2 text-left">
              Current Signature
            </h2>
            <p className="font-serif italic text-4xl text-white tracking-tighter">
              Sand Medium <span className="opacity-50">—</span> <span className="italic font-normal">Optimal</span>
            </p>
          </div>
        </div>
        <div className="mt-8 md:mt-0 flex items-center gap-8 z-10">
          <div className="text-right">
            <p className="font-sans font-bold text-[9px] uppercase opacity-60 tracking-[0.3em] mb-1">Stock Status</p>
            <p className="font-sans font-bold text-[13px] tracking-tight">42 Curations</p>
          </div>
          <button className="bg-white text-primary px-8 py-4 rounded-2xl font-sans font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg hover:translate-y-px transition-all">
            Sort: Priority
          </button>
        </div>
        
        {/* Abstract Shapes */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-primary-container/20 rounded-full blur-[60px]" />
      </section>

      <div className="flex flex-col md:flex-row gap-16">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-72 flex-shrink-0 space-y-16">
          <div className="bg-surface p-10 rounded-[40px] border border-outline/50">
            <div className="mb-12">
              <h3 className="font-sans font-bold text-[10px] uppercase tracking-[0.4em] text-primary mb-8">
                The Origins
              </h3>
              <div className="space-y-5">
                {["Lumina Beauty", "Silk & Stone", "Aether Glow"].map((brand) => (
                  <label key={brand} className="flex items-center gap-4 cursor-pointer group">
                    <div className="w-2 h-2 rounded-full border border-outline-variant group-hover:bg-primary group-hover:border-primary transition-all"></div>
                    <span className="font-serif italic text-[16px] text-on-surface-variant group-hover:text-primary transition-colors">
                      {brand}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h3 className="font-sans font-bold text-[10px] uppercase tracking-[0.4em] text-primary mb-8">
                Saturation
              </h3>
              <div className="flex flex-wrap gap-3">
                {["Sheer", "Medium", "Full"].map((cov) => (
                  <button
                    key={cov}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-sans font-bold uppercase tracking-[0.2em] transition-all shadow-sm ${
                      cov === "Medium" ? "bg-primary text-white" : "bg-white text-on-surface-variant border border-outline hover:border-primary"
                    }`}
                  >
                    {cov}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-sans font-bold text-[10px] uppercase tracking-[0.4em] text-primary mb-8">
                The Path
              </h3>
              <div className="space-y-5">
                {["Matte", "Dewy", "Natural Satin"].map((finish) => (
                  <label key={finish} className="flex items-center gap-4 cursor-pointer group">
                    <div className={`w-2 h-2 rounded-full border border-outline-variant flex items-center justify-center`}>
                      {finish === "Dewy" && <div className="w-full h-full bg-secondary rounded-full shadow-lg shadow-secondary/50Scale(1.5)"></div>}
                    </div>
                    <span className="font-serif italic text-[16px] text-on-surface-variant group-hover:text-secondary transition-colors">
                      {finish}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-primary/5 rounded-[40px] p-8 mt-auto border border-primary/10">
            <p className="font-serif italic text-[13px] text-primary leading-relaxed">"Nature does not hurry, yet everything is accomplished."</p>
            <p className="text-[9px] font-sans font-bold uppercase tracking-[0.3em] mt-4 text-primary/60">— Origin Guide</p>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
            {PRODUCTS.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="group relative flex flex-col">
                <div className="aspect-[3/4] rounded-[48px] overflow-hidden bg-surface mb-8 relative border border-outline/30 shadow-sm transition-all duration-700 hover:shadow-2xl hover:shadow-primary/5">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  {product.isMatch && (
                    <div className="absolute top-6 left-6 bg-secondary text-white px-5 py-2 rounded-full font-sans font-bold text-[9px] uppercase tracking-[0.3em] shadow-xl backdrop-blur-sm">
                      Origin Match
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/20 to-transparent translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="bg-white text-primary w-full py-4 rounded-[20px] font-sans font-bold text-[10px] uppercase tracking-[0.2em] text-center shadow-2xl">
                      View Protocol
                    </div>
                  </div>
                </div>
                <div className="px-5">
                  <p className="font-serif italic text-[14px] text-on-surface-variant mb-1 opacity-60">
                    {product.brand}
                  </p>
                  <h4 className="font-serif italic text-2xl text-on-surface mb-3 group-hover:text-primary transition-colors leading-tight">
                    {product.name}
                  </h4>
                  <div className="flex justify-between items-center">
                    <span className="font-sans font-bold text-[15px] text-primary tracking-tight">{product.price}</span>
                    <div className="flex items-center gap-1.5 text-secondary/30">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={10}
                          fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                          stroke={i < Math.floor(product.rating) ? "none" : "currentColor"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-32 flex justify-center items-center gap-12 border-t border-outline/30 py-16">
            <button className="text-on-surface-variant/40 hover:text-primary transition-colors">
              <ArrowLeft size={18} />
            </button>
            <div className="flex gap-10">
              <span className="font-serif italic text-2xl text-primary border-b border-primary pb-1">1</span>
              <span className="font-serif italic text-2xl text-on-surface-variant/30 hover:text-primary cursor-pointer transition-all">2</span>
              <span className="font-serif italic text-2xl text-on-surface-variant/30 hover:text-primary cursor-pointer transition-all">3</span>
            </div>
            <button className="text-on-surface-variant/40 hover:text-primary transition-colors">
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
