import { motion, AnimatePresence } from "motion/react";
import { Star, Camera, Plus, ChevronRight, ShoppingBag, Minus, Check, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const SHADES = [
  { name: "Light 01", color: "#F5E1D0", overlay: "rgba(245,225,208,0.18)" },
  { name: "Light 02", color: "#EED6C1", overlay: "rgba(238,214,193,0.15)" },
  { name: "Light 03", color: "#E5C7AE", overlay: "rgba(229,199,174,0.18)" },
  { name: "Medium 01", color: "#D9B596", overlay: "rgba(217,181,150,0.22)" },
  { name: "Medium 02", color: "#C8A180", overlay: "rgba(200,161,128,0.25)" },
  { name: "Medium 03", color: "#B68D6A", overlay: "rgba(182,141,106,0.30)" },
  { name: "Deep 01", color: "#9B7354", overlay: "rgba(155,115,84,0.35)" },
  { name: "Deep 02", color: "#7D5C43", overlay: "rgba(125,92,67,0.40)" },
];

const GALLERY_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAcUoNjdAhB03J26AvRAGAdzKQGTDzqKYqhkqaSTyEYkL0h9T00L0t-W4BFxKazxohEhWreYq57mYoQIGieKs91-97pp2tlOtxPiBeMLUHPzwlQWu9UYSkKpvziHwGbhOeZViojWFr4VP5BqxgK7tUrinvA7urf8W3xbWrJkkwiv8i2Eoe6Z7ImBH7h4hX6mZEPDD9_OQr825S_xTrGC4DDelx3uPsk_SR2e4OxUJV8NRWRfoVLZ4-HxE25eVreYB-ZKOIYI5EZGx5U",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBRdFM8QY-BzWjFAkkF5WOo_hNKIBRvvRjnMjJsjxc9eS6fTXeIkO148LtrxvyGL3YppfRy6ZSAvv3raYXvMN5mkuBM92AiuVHnpfpinlWAiSH55roVs_BVAr3Dck0QNFvYwquqNx_do6yASlQkKJp800iLnsoyJmMNifGUReR-R_-JdwcKtpVXx0IPu_ybVy0PG5PZ8YFT2UkTi3QpNROJYyaqQG6AZxi8QXWwRhMFU5IZ1Jp45zRlfcUaYcOmMOm2lJeGcgmIqnkr",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC2RQWsImZD-0S4pQ2cofzKsmEgRfXNQ2eDJguta-NKU7kXDbkbd0P65IzlwPAO4kPQG2HqD8rV6_YtI4GFSXrsVGjTi6WwAC654xBg3LOcunZn2zU8LOfVZf5lAnDNZwvvRcZU1C0RXWCCqxRtO2QXh97EKI_c43EiP01uU_A0awMrFUnm4Ot-ci4vUambC-sCgj6XlfjAtzRB4cNCjEmj5_lTgwWxOBcJBC0UWOk_R5cnxJfgYWk0Y78b6ieE4uL4Qrg4X56JRfO5",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDuyjF5HaYzvGgVWKSA0ZcR8PFeJ6ErD_olN5Ce2UgKlTbFwF9iLCUP_RgqkgLW7gL-sT58iLRwWrS8prBbcuyt7xJv244C75V-YNWOzrN2CB4BpgT_Iup7XS54g8UIkRMVscNQwJ0nhVU5W-kO_4HrPMkHmjd805_lbw-n6nFXD0lvynLt3Z5GFlCDAmcMEwvDY7NtBLR_pYZ-c0HsafeRzdEsIkSe8MjgR15Ln3Sw_3kD5hCPsNh-jsCDJ3F69beGSCi7srW5pbaa",
];

const ACCORDION_CONTENT: Record<string, string> = {
  Biology:
    "Enriched with Hyaluronic Acid, Squalane, and Vitamin E — our formula mimics the skin's natural lipid barrier. Dermatologically tested for all skin types, including sensitive and acne-prone skin. Non-comedogenic, paraben-free, and cruelty-free.",
  "Application Protocol":
    "Apply 1–2 pumps to clean, moisturized skin. Blend outward from the center of the face using fingertips or a damp beauty sponge. Build coverage gradually for a flawless, second-skin finish. Set with a light mist for all-day wear.",
  Sourcing:
    "Our pigments are responsibly sourced from mineral-rich regions. Every ingredient is traceable, sustainably harvested, and produced under fair-trade conditions. We offset 100% of our carbon footprint across the entire supply chain.",
};

const RECOMMENDED = [
  {
    name: "Radiance Primer",
    price: "₹3,360",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBia4VLgixQ0vbOvV89z1nBlxsMrXWr5HkgsG-He4WddikPivu2UVhJOgNwhqhTr6ivaZY1_93kT_toQvyPYsD64r1Zvv3D_aU8IHxP5N8T-zpJWCxonX2GywBhp8aSauZYDqzYK0yzxzgHvQoB7dul9zn_RTKcZWBSWMSz-RuTQN-9FDw_nc-dtVCEfxdY4sMhWwfCtAQl4OFLuAvpUQ1Y0chOGyDKGABaJCtrEb2DG4A8hOPGd8nxcrRIxucVec9eryIrYy7V1scV",
  },
  {
    name: "Seamless Blender Brush",
    price: "₹2,720",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfmmiwgtCiQ2Us4iqTEfKYt2xaCAIGSl-Hv8qJySSJ0OjNbB2gV5RxaJs5Hbu_ZUwtuHLbZAhIUGiptZtV6jd4XnjVENBluvqdsoVZm_uO4bCyG1PyP0FuDlEK37fZTgaG1vbq3YijtpS7niZGxJDDPim7hS_HKfQIEHZBgJgM67gTpnkx3hneBS2ftveZ7YCqFizAf_Tf5TsorNRn8WjznnLRYo-yOzKh7IhMKDq196VmjCZvUPVY9bsB-JGvUhZa5KGW1aLGH90W",
  },
  {
    name: "Dewy Setting Mist",
    price: "₹2,240",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFaxhuOkuQZxnRw9HEdxs7g7zuAlXPGVh3U3L7ngoQFtiokmIw0JaXYYnhVCtE3scJllafzWLS2G2FsQYUsfrAYZLOwPXPRew3G_Qf10WWdXHQn1P8KNlfU6XTAq91zT8AW15JfCUtOAWTYr1AUary9OinFTZm27UxyzXOP7XNeJ4SrXQGfu4rCPmVEsxrqU7wBsuJgDYiJ9GmrUkltJAwTS-5d742QLN1o3DpP28fa3zblubTRhvx8PlCjmBQw_RCZzKuc1JbP92e",
  },
];

export default function ProductDetail() {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [selectedShade, setSelectedShade] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const shade = SHADES[selectedShade];

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleImgError = (idx: number) => {
    setImgErrors((prev) => ({ ...prev, [idx]: true }));
  };

  // Fallback color block for broken images
  const FallbackThumb = ({ idx }: { idx: number }) => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-container to-outline/30">
      <span className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant/50 font-bold">
        View {idx + 1}
      </span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-12 md:py-16"
    >
      {/* Breadcrumb */}
      <nav className="mb-6 sm:mb-8 md:mb-12 flex items-center gap-2 sm:gap-3 font-sans font-bold text-[9px] sm:text-[10px] text-outline uppercase tracking-[0.2em]">
        <Link to="/shop" className="hover:text-on-surface transition-colors">Shop</Link>
        <ChevronRight size={12} strokeWidth={3} className="text-outline-variant" />
        <Link to="/shop" className="hover:text-on-surface transition-colors">Face</Link>
        <ChevronRight size={12} strokeWidth={3} className="text-outline-variant" />
        <span className="text-on-surface">Silk Veil Foundation</span>
      </nav>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 md:gap-16">
        {/* Left: Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Main image with shade overlay */}
          <div className="aspect-[4/5] bg-surface rounded-[28px] sm:rounded-[40px] md:rounded-[60px] overflow-hidden group relative shadow-2xl border border-outline/30">
            <img
              src={GALLERY_IMAGES[activeImage]}
              alt="Silk Veil Foundation"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              onError={() => handleImgError(activeImage)}
            />
            {/* Shade-reactive overlay */}
            <motion.div
              key={selectedShade}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 pointer-events-none mix-blend-multiply"
              style={{ backgroundColor: shade.overlay }}
            />
            {/* Shade color band at bottom */}
            <motion.div
              key={`band-${selectedShade}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute bottom-0 left-0 right-0 h-1.5 origin-left"
              style={{ backgroundColor: shade.color }}
            />
            <div className="absolute top-4 sm:top-6 md:top-8 left-4 sm:left-6 md:left-8 bg-primary text-white border border-white/20 px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-full font-sans font-bold text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] shadow-2xl">
              Bestseller
            </div>
            {/* Current shade badge */}
            <motion.div
              key={`badge-${selectedShade}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 flex items-center gap-2 sm:gap-3 bg-white/90 backdrop-blur-md px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl shadow-lg border border-outline/20"
            >
              <div className="w-5 h-5 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: shade.color }} />
              <span className="font-sans font-bold text-[10px] uppercase tracking-[0.2em] text-on-surface">{shade.name}</span>
            </motion.div>
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {GALLERY_IMAGES.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`aspect-square rounded-[10px] sm:rounded-[14px] md:rounded-[20px] overflow-hidden cursor-pointer transition-all duration-300 border relative ${
                  i === activeImage
                    ? "ring-2 ring-primary ring-offset-2 scale-[1.03] shadow-lg border-primary/40"
                    : "border-outline/30 opacity-60 hover:opacity-100 hover:shadow-md"
                }`}
              >
                {imgErrors[i] ? (
                  <FallbackThumb idx={i} />
                ) : (
                  <img
                    src={img}
                    alt={`View ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => handleImgError(i)}
                  />
                )}
                {/* Shade tint on thumbnails too */}
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-multiply transition-colors duration-500"
                  style={{ backgroundColor: shade.overlay }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="lg:col-span-5 flex flex-col gap-10 sticky top-32 h-fit">
          <div>
            <span className="font-sans font-bold text-[10px] text-primary uppercase tracking-[0.4em] mb-4 block">
              The Signature
            </span>
            <h1 className="font-serif italic text-3xl sm:text-4xl md:text-6xl text-on-surface mb-3 sm:mb-4 leading-[0.9] tracking-tighter uppercase">
              Silk Veil.
            </h1>
            <div className="flex items-center gap-6 mb-5">
              <div className="flex text-secondary items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill={i < 4 ? "currentColor" : "none"} stroke={i < 4 ? "none" : "currentColor"} />
                ))}
              </div>
              <span className="font-sans font-bold text-[10px] text-on-surface-variant/40 uppercase tracking-[0.3em]">
                (128 Rituals)
              </span>
            </div>
            <p className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-primary tracking-tighter">₹5,440</p>
          </div>

          <p className="font-serif italic text-base sm:text-lg md:text-xl text-on-surface-variant leading-relaxed opacity-80">
            A weightless, breathable formula that melts into the skin for a second-skin finish, celebrated for its biological harmony.
          </p>

          {/* Shade Selector */}
          <div className="space-y-5">
            <div className="flex justify-between items-end">
              <span className="font-sans font-bold text-[10px] uppercase tracking-[0.3em] text-on-surface">
                Selecting Tones:{" "}
                <motion.span
                  key={shade.name}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-primary font-medium inline-block"
                >
                  {shade.name}
                </motion.span>
              </span>
              <button className="font-sans font-bold text-[10px] text-primary underline underline-offset-8 uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
                Shade Map
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {SHADES.map((s, i) => (
                <button
                  key={s.name}
                  onClick={() => setSelectedShade(i)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                    i === selectedShade
                      ? "ring-2 ring-primary ring-offset-4 scale-110 shadow-xl"
                      : "hover:scale-110 hover:shadow-md"
                  }`}
                  title={s.name}
                >
                  <div
                    className="w-full h-full rounded-full border border-black/5 shadow-inner flex items-center justify-center"
                    style={{ backgroundColor: s.color }}
                  >
                    {i === selectedShade && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <Check size={14} strokeWidth={3} className="text-white drop-shadow-md" />
                      </motion.div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            {/* Shade preview strip */}
            <motion.div
              layout
              className="h-2 rounded-full overflow-hidden"
              style={{ background: `linear-gradient(90deg, ${SHADES.map((s) => s.color).join(", ")})` }}
            >
              <motion.div
                className="h-full bg-white/60 rounded-full"
                animate={{ marginLeft: `${(selectedShade / (SHADES.length - 1)) * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ width: "12%" }}
              />
            </motion.div>
          </div>

          {/* Quantity + Actions */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 bg-surface rounded-2xl p-4 border border-outline/30">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant hover:text-primary"
              >
                <Minus size={16} />
              </button>
              <span className="flex-1 text-center font-sans font-bold text-[14px]">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant hover:text-primary"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="flex gap-3">
              <motion.button
                onClick={handleAddToCart}
                whileTap={{ scale: 0.97 }}
                className="flex-1 py-6 rounded-[24px] bg-primary text-white font-sans font-bold text-[11px] uppercase tracking-[0.4em] hover:opacity-90 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-primary/20"
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                {addedToCart ? "Added ✓" : `Add ${quantity} to Collection`}
              </motion.button>
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className={`p-6 rounded-[24px] border transition-all duration-300 ${
                  wishlisted
                    ? "bg-red-50 border-red-200 text-red-500"
                    : "bg-white border-outline text-on-surface-variant hover:text-primary hover:border-primary"
                }`}
              >
                <Heart size={20} fill={wishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            <Link
              to="/analysis"
              className="flex items-center justify-center gap-6 w-full py-5 rounded-[24px] bg-white border border-outline text-on-surface font-sans font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-surface hover:border-primary transition-all duration-300 shadow-sm"
            >
              <Camera size={18} strokeWidth={1.5} />
              Protocol Analysis
            </Link>

            <AnimatePresence>
              {addedToCart && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-secondary/10 border border-secondary text-secondary px-4 py-3 rounded-xl font-sans font-bold text-[10px] uppercase tracking-[0.2em] text-center"
                >
                  ✓ {shade.name} × {quantity} added to your collection
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Accordion */}
          <div className="border-t border-outline/30 mt-2 divide-y divide-outline/20">
            {Object.keys(ACCORDION_CONTENT).map((item) => (
              <div key={item}>
                <button
                  onClick={() => setExpandedSection(expandedSection === item ? null : item)}
                  className="flex justify-between items-center w-full py-7 group text-left"
                >
                  <span className="font-sans font-bold text-[10px] uppercase tracking-[0.3em] text-on-surface-variant group-hover:text-primary transition-colors">
                    {item}
                  </span>
                  <motion.div
                    animate={{ rotate: expandedSection === item ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Plus size={16} className="text-on-surface-variant/30 group-hover:text-primary transition-all" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedSection === item && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-7 font-serif italic text-[15px] text-on-surface-variant leading-relaxed">
                        {ACCORDION_CONTENT[item]}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Section */}
      <section className="mt-16 sm:mt-24 md:mt-40 py-12 sm:py-16 md:py-24 px-5 sm:px-8 md:px-12 bg-surface-bright rounded-[28px] sm:rounded-[48px] md:rounded-[80px] border border-outline/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-primary/5 pointer-events-none" />
        <div className="max-w-[800px] mx-auto text-center mb-10 sm:mb-14 md:mb-20 relative z-10">
          <span className="font-sans font-bold text-[10px] text-primary uppercase tracking-[0.4em] sm:tracking-[0.5em] mb-6 sm:mb-8 md:mb-10 block">
            The Symbiosis
          </span>
          <h2 className="font-serif italic text-3xl sm:text-4xl md:text-6xl text-on-surface mb-4 sm:mb-6 md:mb-8 tracking-tighter leading-none">
            Mapping your Routine.
          </h2>
          <p className="font-serif italic text-base sm:text-lg md:text-xl text-on-surface-variant leading-relaxed">
            Based on your biological analysis, we've identified{" "}
            <strong className="text-primary italic">Neutral Tones</strong> as your baseline. These curations maintain
            your skin's natural homeostasis.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 md:gap-12 relative z-10">
          {RECOMMENDED.map((item) => (
            <div key={item.name} className="group cursor-pointer">
              <div className="aspect-[3/4] rounded-[16px] sm:rounded-[28px] md:rounded-[40px] bg-surface mb-4 sm:mb-6 md:mb-10 overflow-hidden relative shadow-lg border border-white/40">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-md px-8 py-3 rounded-xl font-sans font-bold text-[9px] uppercase tracking-widest text-primary">
                    Explore
                  </div>
                </div>
              </div>
              <h3 className="font-serif italic text-base sm:text-lg md:text-2xl text-on-surface mb-1.5 sm:mb-2 md:mb-3 group-hover:text-primary transition-colors uppercase leading-none">
                {item.name}
              </h3>
              <p className="text-primary font-sans font-bold text-[11px] sm:text-[12px] md:text-[13px] tracking-tight">{item.price}</p>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
