import { motion } from "motion/react";
import { Star, Camera, Plus, ChevronRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const SHADES = [
  { name: "Light 01", color: "#F5E1D0" },
  { name: "Light 02 Neutral", color: "#EED6C1", active: true },
  { name: "Light 03", color: "#E5C7AE" },
  { name: "Medium 01", color: "#D9B596" },
  { name: "Medium 02", color: "#C8A180" },
  { name: "Medium 03", color: "#B68D6A" },
  { name: "Deep 01", color: "#9B7354" },
  { name: "Deep 02", color: "#7D5C43" },
];

const RECOMMENDED = [
  {
    name: "Radiance Primer",
    price: "$42.00",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBia4VLgixQ0vbOvV89z1nBlxsMrXWr5HkgsG-He4WddikPivu2UVhJOgNwhqhTr6ivaZY1_93kT_toQvyPYsD64r1Zvv3D_aU8IHxP5N8T-zpJWCxonX2GywBhp8aSauZYDqzYK0yzxzgHvQoB7dul9zn_RTKcZWBSWMSz-RuTQN-9FDw_nc-dtVCEfxdY4sMhWwfCtAQl4OFLuAvpUQ1Y0chOGyDKGABaJCtrEb2DG4A8hOPGd8nxcrRIxucVec9eryIrYy7V1scV",
  },
  {
    name: "Seamless Blender Brush",
    price: "$34.00",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfmmiwgtCiQ2Us4iqTEfKYt2xaCAIGSl-Hv8qJySSJ0OjNbB2gV5RxaJs5Hbu_ZUwtuHLbZAhIUGiptZtV6jd4XnjVENBluvqdsoVZm_uO4bCyG1PyP0FuDlEK37fZTgaG1vbq3YijtpS7niZGxJDDPim7hS_HKfQIEHZBgJgM67gTpnkx3hneBS2ftveZ7YCqFizAf_Tf5TsorNRn8WjznnLRYo-yOzKh7IhMKDq196VmjCZvUPVY9bsB-JGvUhZa5KGW1aLGH90W",
  },
  {
    name: "Dewy Setting Mist",
    price: "$28.00",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFaxhuOkuQZxnRw9HEdxs7g7zuAlXPGVh3U3L7ngoQFtiokmIw0JaXYYnhVCtE3scJllafzWLS2G2FsQYUsfrAYZLOwPXPRew3G_Qf10WWdXHQn1P8KNlfU6XTAq91zT8AW15JfCUtOAWTYr1AUary9OinFTZm27UxyzXOP7XNeJ4SrXQGfu4rCPmVEsxrqU7wBsuJgDYiJ9GmrUkltJAwTS-5d742QLN1o3DpP28fa3zblubTRhvx8PlCjmBQw_RCZzKuc1JbP92e",
  },
];

export default function ProductDetail() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-[1280px] mx-auto px-4 md:px-12 py-8 md:py-16"
    >
      <nav className="mb-8 md:mb-12 flex items-center gap-2 md:gap-3 font-sans font-bold text-[10px] text-outline uppercase tracking-[0.2em] flex-wrap">
        <Link to="/shop" className="hover:text-on-surface">Shop</Link>
        <ChevronRight size={12} strokeWidth={3} className="text-outline-variant" />
        <Link to="/shop" className="hover:text-on-surface">Face</Link>
        <ChevronRight size={12} strokeWidth={3} className="text-outline-variant" />
        <span className="text-on-surface">Silk Veil Foundation</span>
      </nav>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
        {/* Images */}
        <div className="lg:col-span-7 flex flex-col gap-4 md:gap-10">
          <div className="aspect-[4/5] bg-surface rounded-[40px] md:rounded-[60px] overflow-hidden group relative shadow-2xl border border-outline/30">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcUoNjdAhB03J26AvRAGAdzKQGTDzqKYqhkqaSTyEYkL0h9T00L0t-W4BFxKazxohEhWreYq57mYoQIGieKs91-97pp2tlOtxPiBeMLUHPzwlQWu9UYSkKpvziHwGbhOeZViojWFr4VP5BqxgK7tUrinvA7urf8W3xbWrJkkwiv8i2Eoe6Z7ImBH7h4hX6mZEPDD9_OQr825S_xTrGC4DDelx3uPsk_SR2e4OxUJV8NRWRfoVLZ4-HxE25eVreYB-ZKOIYI5EZGx5U"
              alt="Silk Veil Foundation"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute top-6 left-6 bg-primary text-white border border-white/20 px-5 py-2 rounded-full font-sans font-bold text-[10px] uppercase tracking-[0.3em] shadow-2xl">
              Bestseller
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 md:gap-6">
            {[
              "https://lh3.googleusercontent.com/aida-public/AB6AXuBRdFM8QY-BzWjFAkkF5WOo_hNKIBRvvRjnMjJsjxc9eS6fTXeIkO148LtrxvyGL3YppfRy6ZSAvv3raYXvMN5mkuBM92AiuVHnpfpinlWAiSH55roVs_BVAr3Dck0QNFvYwquqNx_do6yASlQkKJp800iLnsoyJmMNifGUReR-R_-JdwcKtpVXx0IPu_ybVy0PG5PZ8YFT2UkTi3QpNROJYyaqQG6AZxi8QXWwRhMFU5IZ1Jp45zRlfcUaYcOmMOm2lJeGcgmIqnkr",
              "https://lh3.googleusercontent.com/aida-public/AB6AXuC2RQWsImZD-0S4pQ2cofzKsmEgRfXNQ2eDJguta-NKU7kXDbkbd0P65IzlwPAO4kPQG2HqD8rV6_YtI4GFSXrsVGjTi6WwAC654xBg3LOcunZn2zU8LOfVZf5lAnDNZwvvRcZU1C0RXWCCqxRtO2QXh97EKI_c43EiP01uU_A0awMrFUnm4Ot-ci4vUambC-sCgj6XlfjAtzRB4cNCjEmj5_lTgwWxOBcJBC0UWOk_R5cnxJfgYWk0Y78b6ieE4uL4Qrg4X56JRfO5",
              "https://lh3.googleusercontent.com/aida-public/AB6AXuDuyjF5HaYzvGgVWKSA0ZcR8PFeJ6ErD_olN5Ce2UgKlTbFwF9iLCUP_RgqkgLW7gL-sT58iLRwWrS8prBbcuyt7xJv244C75V-YNWOzrN2CB4BpgT_Iup7XS54g8UIkRMVscNQwJ0nhVU5W-kO_4HrPMkHmjd805_lbw-n6nFXD0lvynLt3Z5GFlCDAmcMEwvDY7NtBLR_pYZ-c0HsafeRzdEsIkSe8MjgR15Ln3Sw_3kD5hCPsNh-jsCDJ3F69beGSCi7srW5pbaa",
              "https://lh3.googleusercontent.com/aida-public/AB6AXuCy2C7AZbMi3gKBf50FClOgYueBt_5RaFtdu99prd5kbNIEdunhgCBm-jrtj4ZIuJbo8hP2A5fo8q6aftybDmiFXkypT2ugMTwnnDK86x505kVL8JbwoPSlzxZ_N-_1p1V-9ZYWgWpqyFkFrLaO_4vdJKiKu5kj6qhg3M50zTwx-fFxfhSLWiUOQIjyJAlr3fNk-xOZSWk6IMxSyxLb8VIlKybb323lpIZfsQWAELw48zxJ0q7IK9alRVvRVSVgnaEKREDjDiQgPdZ8",
            ].map((img, i) => (
              <div
                key={i}
                className={`aspect-square bg-surface rounded-[16px] md:rounded-[24px] overflow-hidden cursor-pointer transition-all duration-300 border border-outline/30 shadow-sm ${
                  i === 0 ? "ring-2 ring-primary ring-offset-2 scale-105" : "opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:col-span-5 flex flex-col gap-8 md:gap-12 lg:sticky lg:top-32 h-fit">
          <div>
            <span className="font-sans font-bold text-[10px] text-primary uppercase tracking-[0.4em] mb-3 block text-left">
              The Signature
            </span>
            <h1 className="font-serif italic text-4xl md:text-6xl text-on-surface mb-3 leading-[0.9] tracking-tighter text-left uppercase">
              Silk Veil.
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex text-secondary items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill={i < 4 ? "currentColor" : "none"} stroke={i < 4 ? "none" : "currentColor"} />
                ))}
              </div>
              <span className="font-sans font-bold text-[10px] text-on-surface-variant/40 uppercase tracking-[0.3em]">
                (128 Rituals)
              </span>
            </div>
            <p className="font-serif italic text-3xl md:text-4xl text-primary tracking-tighter">$68.00</p>
          </div>

          <p className="font-serif italic text-base md:text-xl text-on-surface-variant leading-relaxed text-left opacity-80">
            A weightless, breathable formula that melts into the skin for a second-skin finish, celebrated for its biological harmony.
          </p>

          <div className="flex flex-col gap-6 md:gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-end mb-3">
                <span className="font-sans font-bold text-[10px] uppercase tracking-[0.3em] text-on-surface">
                  Selecting Tones:{" "}
                  <span className="text-on-surface-variant/60 font-medium">Light 02</span>
                </span>
                <button className="font-sans font-bold text-[10px] text-primary underline underline-offset-8 uppercase tracking-[0.2em]">
                  Shade Map
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {SHADES.map((shade) => (
                  <button
                    key={shade.name}
                    className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all ${
                      shade.active ? "ring-2 ring-primary ring-offset-4 scale-110 shadow-xl" : "hover:scale-110"
                    }`}
                    title={shade.name}
                  >
                    <div
                      className="w-full h-full rounded-full border border-black/5 shadow-inner"
                      style={{ backgroundColor: shade.color }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <Link
              to="/analysis"
              className="flex items-center justify-center gap-4 w-full py-5 rounded-[20px] bg-white border border-outline text-on-surface font-sans font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-surface transition-all duration-300 shadow-sm"
            >
              <Camera size={16} strokeWidth={1.5} />
              Protocol Analysis
            </Link>

            <button className="w-full py-5 md:py-7 rounded-[20px] md:rounded-[24px] bg-primary text-white font-sans font-bold text-[11px] uppercase tracking-[0.4em] hover:opacity-90 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-primary/20">
              <ShoppingBag size={16} strokeWidth={1.5} />
              Add to Collection
            </button>
          </div>

          <div className="border-t border-outline/30 divide-y divide-outline/20">
            {["Biology", "Application Protocol", "Sourcing"].map((item) => (
              <button key={item} className="flex justify-between items-center w-full py-6 md:py-8 group text-left">
                <span className="font-sans font-bold text-[10px] uppercase tracking-[0.3em] text-on-surface-variant group-hover:text-primary transition-colors">
                  {item}
                </span>
                <Plus
                  size={16}
                  className="text-on-surface-variant/30 group-hover:text-primary transition-all group-hover:rotate-90"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended */}
      <section className="mt-20 md:mt-40 py-12 md:py-24 px-4 md:px-12 bg-surface-bright rounded-[48px] md:rounded-[80px] border border-outline/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-primary/5 pointer-events-none" />
        <div className="max-w-[800px] mx-auto text-center mb-12 md:mb-20 relative z-10">
          <span className="font-sans font-bold text-[10px] text-primary uppercase tracking-[0.5em] mb-6 block">
            The Symbiosis
          </span>
          <h2 className="font-serif italic text-4xl md:text-6xl text-on-surface mb-6 tracking-tighter leading-none">
            Mapping your Routine.
          </h2>
          <p className="font-serif italic text-base md:text-xl text-on-surface-variant leading-relaxed">
            Based on your biological analysis, we've identified{" "}
            <strong className="text-primary italic">Neutral Tones</strong> as your baseline.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 relative z-10">
          {RECOMMENDED.map((item) => (
            <div key={item.name} className="group cursor-pointer">
              <div className="aspect-[3/4] rounded-[28px] md:rounded-[40px] bg-surface mb-6 md:mb-10 overflow-hidden relative shadow-lg border border-white/40">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-md px-8 py-3 rounded-xl font-sans font-bold text-[9px] uppercase tracking-widest text-primary">
                    Explore
                  </div>
                </div>
              </div>
              <h3 className="font-serif italic text-xl md:text-2xl text-on-surface mb-2 group-hover:text-primary transition-colors uppercase leading-none">
                {item.name}
              </h3>
              <p className="text-primary font-sans font-bold text-[13px] tracking-tight">{item.price}</p>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
