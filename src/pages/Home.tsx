import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const TRENDING_PRODUCTS = [
  {
    id: 1,
    category: "Radiance",
    name: "Luminous Silk Serum",
    price: "₹6,720",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqX86c-iYEffBF-l0aQxrv38rcoRx13we9gHYb8kvEM9bu0MRkZrhcbZhLcN4Dyf1laIPjHQI73oFAd67wTKUCyFSv4y1KjxTPkDRbr9V7FOY3Jrg02ksA4g1LwVB3wxeRPAgwbaRNyu3lO5HghZBdAOhaMldUbHN4bBJf7BvoAf4EgDUcJCIZm-kFCq-P2H9qT28stL6jhFICh2qd5tVvKVDJkqfAesHhKsWno1ejzIkWi2125NWBhK43dxMaq65Nly2Dmq9xiEdn",
  },
  {
    id: 2,
    category: "Complexion",
    name: "Velvet Touch Powder",
    price: "₹4,960",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLK5p1SK760iKQBEDJJ6vYUQRJq9EW9PEShgMkWtpdsmrOnR7_IUYw4awGftht1g3xLhaD89kDDm68CDeeEqzt4xl_GET84Ghiz9DFDpLKrCdB6oS-2pHCSbrMVSmLpp0CXeY8JulsSV1Wwkb3jMww6VaIkf0MEjv8ghcyj7HjtiPPN2DNq0JvdYg5ieKZr_2C_B5-hKeXUhI0QxFGtBknkwmFADh33sgfq-utu4vDHiwjea7JFnW0o_cCqQYVZ55RBH8fgXQMYAM4",
  },
  {
    id: 3,
    category: "Lips",
    name: "Matte Essence Lipstick",
    price: "₹3,040",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbEfAD_x-v0jUe7vJHYOHyjTbQfvuj2JdNr6YVuEkv0ZEAuUKxp1mnTfGUfe52M0MDM68m2Eo9lcshDDU87OgujI5Jh3B_G-6VBycXrA1fz7_Turs-PjqVhjRcm-o9YSR7NRFdDmR011lCZkR7-ecPwVQ4a_C1EfixGcDzBAkjUbLLq91KuBWmN4L-hzZ6ERpkvhZTPAaNNpYc2yRrvoonjFYIDurpon8oAMfD1EacDmmldR0Pq5ctZ5wvbZ4_IOzRL4gAvXOLWqzv",
  },
  {
    id: 4,
    category: "Skincare",
    name: "Midnight Dew Cream",
    price: "₹7,600",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0t_5TUPpChjQbQFnFsdW9b9jPSG2P_rmkQ1dg4JbCmEB8a22cdh5xnXTwfwFxVSUDeP5oozLOq5P7vmuKkgtxDeDPmXXHJ7jh3lSIjx1ioyDJkyzX8DpMRDhQzeRsZa2xV1qUoDTYu6H8PhllDvaDnWZ5J-LHDF5xkTmTkkx2Nmd8BXggb2FCGoOgc9B_4-rkupkfAfklMR0JC97nlLh4KOyfqU09heKIqjSHE3NW5NiBLiBLgoIJC_RDQnl5XDXcf_aYXdl6PtIr",
  },
];

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hero Section */}
      <section className="relative min-h-[100svh] sm:min-h-0 sm:h-[870px] w-full flex items-center overflow-hidden bg-surface">
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNbTL4XhqTJqyynV6eaCCJsI3kxWRvFqJs3IbW09Tskc9XkkrNMSzHO_sjiQwAH8liuCxiyq7SZnnxQKmpXVM7MqFgkDj4N5WG6xh490isz2zHu4VB8O218N_mgv8GJNNzWCempQyMA5LGDDjiUDTjwgxphPw9ckrP2TQhYvO2Ru3Q85wPyoR6EPv_DD_qTTJ0OsU9No6XJgo-aIUECXVqBoJoiVQuE_MBVI722u4wfcpoTqHIHqy3ozgj26DSF7ABNODPiDAvPpPl"
            alt="Skin textures"
            className="w-full h-full object-cover opacity-60 mix-blend-multiply transition-transform duration-[20s] hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-bright/90 via-surface-bright/40 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 w-full">
          <div className="max-w-2xl bg-surface-bright/30 backdrop-blur-sm p-6 sm:p-8 md:p-12 rounded-[28px] sm:rounded-[36px] md:rounded-[48px] border border-white/20">
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-sans font-bold text-[10px] text-primary uppercase mb-3 sm:mb-4 md:mb-6 tracking-[0.3em] sm:tracking-[0.4em]"
            >
              The Origin Collection
            </motion.p>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-serif italic text-4xl sm:text-5xl md:text-8xl text-on-surface mb-6 sm:mb-8 md:mb-10 leading-[0.9] tracking-tighter"
            >
              Nurtured by <br/> Nature.
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-serif italic text-base sm:text-lg md:text-xl text-on-surface-variant mb-6 sm:mb-8 md:mb-12 max-w-lg leading-relaxed"
            >
              "In every walk with nature one receives far more than he seeks."
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <Link
                to="/analysis"
                className="bg-primary text-on-primary px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-sans font-bold uppercase tracking-widest text-[10px] sm:text-[11px] hover:opacity-90 transition-all shadow-xl shadow-primary/10 text-center"
              >
                Start AI Analysis
              </Link>
              <Link
                to="/shop"
                className="bg-white border border-outline text-on-surface px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-sans font-bold uppercase tracking-widest text-[10px] sm:text-[11px] hover:bg-surface-container transition-all text-center"
              >
                Shop Collection
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trending Now */}
      <section className="py-16 sm:py-24 md:py-32 max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 sm:mb-16 px-2 sm:px-4 gap-4">
          <div>
            <span className="font-sans font-bold text-[10px] text-primary uppercase tracking-[0.4em] mb-3 block">Curated</span>
            <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-on-surface">Trending Essentials</h2>
          </div>
          <div className="flex gap-4">
            <button className="p-4 border border-outline rounded-2xl hover:bg-surface transition-colors">
              <ChevronLeft size={18} />
            </button>
            <button className="p-4 border border-outline rounded-2xl hover:bg-surface transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-10">
          {TRENDING_PRODUCTS.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="group">
              <div className="aspect-[4/5] bg-surface rounded-[20px] sm:rounded-[28px] md:rounded-[40px] overflow-hidden mb-4 sm:mb-6 md:mb-8 relative border border-outline/50 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-primary/5">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-md text-primary px-8 py-3 rounded-xl font-sans font-bold text-[10px] uppercase tracking-widest">
                    Quick View
                  </div>
                </div>
              </div>
              <div className="px-1 sm:px-2 md:px-4">
                <p className="font-sans text-[9px] sm:text-[10px] font-bold text-on-surface-variant uppercase mb-1 sm:mb-2 tracking-[0.2em] opacity-60">
                  {product.category}
                </p>
                <h3 className="font-serif italic text-sm sm:text-base md:text-xl text-on-surface mb-1 sm:mb-2">{product.name}</h3>
                <p className="font-sans font-bold text-[11px] sm:text-[13px] text-primary">{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Brands */}
      <section className="bg-surface py-24">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-on-surface uppercase tracking-tighter">Our Origins</h2>
            <div className="h-1.5 w-6 bg-primary mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12 items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-1000">
            <div className="flex justify-center font-serif text-lg sm:text-2xl md:text-3xl text-primary tracking-widest italic">
              E L É V E
            </div>
            <div className="flex justify-center font-serif text-lg sm:text-2xl md:text-3xl text-primary italic tracking-widest">
              AURELIA
            </div>
            <div className="flex justify-center font-serif text-lg sm:text-2xl md:text-3xl text-primary font-bold uppercase tracking-tight">NOIR</div>
            <div className="flex justify-center font-serif text-lg sm:text-2xl md:text-3xl text-primary tracking-tighter uppercase font-medium">
              Solis
            </div>
          </div>
        </div>
      </section>

      {/* Featured In / Press */}
      <section className="py-16 sm:py-24 border-y border-outline bg-surface-bright">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 text-center overflow-hidden">
          <p className="font-sans font-bold text-[10px] text-on-surface-variant/40 uppercase tracking-[0.5em] mb-8 sm:mb-12">
            Global Recognition
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 sm:gap-x-14 md:gap-x-20 gap-y-6 sm:gap-y-12 opacity-30">
            {["Vogue", "Harper's Bazaar", "Elle", "Vanity Fair", "Allure"].map((press) => (
              <span key={press} className="font-serif italic text-xl sm:text-2xl md:text-3xl text-on-surface select-none transform hover:scale-110 transition-transform">
                {press}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-24 md:py-32 bg-surface-bright">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 md:gap-24 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-[28px] sm:rounded-[40px] md:rounded-[60px] overflow-hidden border border-outline/30 shadow-2xl">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuARME9Etlp4IvkFwzEtdwOD9ZEKk0q8rgRhYDk9gZRt-13zTS0q2x32Kpwvs7n0-ypcbOgpmvARU0LbXj5kWvASx5jA0xNdEzsHPRnKPl3GGfr_uifWhvs7mV3P7ayugggvEhP65SakIJVUGbXIaX6IBL4LWkwqqLTZt3dvgB69nJTvy-_7vE0z22VwXqt7Mn7QyXSJ_2a2Zqm1p-vLnHeIyArS93L6kyXErIe3JKYgmMdR19Jo1Ff92b3K_JHznTDrS8XEMXkl_grM"
                alt="Natural skin glow"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-primary-container/20 backdrop-blur-xl border border-white/20 p-4 rounded-[48px] hidden xl:block shadow-2xl">
              <div className="w-full h-full rounded-[36px] overflow-hidden border border-white/40">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAXd89C6koz7tz3Ow8hIqghZgU8BmkRDqIb0dlfOZ_9xJOchxBcu5IGHJtSW7tXIGXnpeP3PVtynRWpU3gF8Xm1idmSmZVG1MdXk-gGp5Mckajp6QeKzFUioN3C41kARBdkKzcKQHlbbKqiVU7luOw4-GMUyJwMP0g6025rjF0BtCUPbo1ESOIJERYJ8jlq-g6D3fTSjwd00RQFtigM9CJw33sHe82TUfXTUJwizWrD5I31KNOy0WNwkbGY1QraD1W7aVm3TuVOpwZ"
                  alt="Product texture"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="lg:pl-12">
            <span className="font-sans font-bold text-[10px] text-primary uppercase tracking-[0.4em] block mb-8">
              Our Ethos
            </span>
            <h2 className="font-serif italic text-3xl sm:text-4xl md:text-6xl text-on-surface mb-6 sm:mb-8 md:mb-10 leading-[0.9] tracking-tighter">
              Guided by the Earth, <br/> Perfected by Humans.
            </h2>
            <p className="font-serif italic text-base sm:text-lg md:text-xl text-on-surface-variant mb-8 sm:mb-10 md:mb-12 leading-relaxed">
              "In nature, nothing is perfect and everything is perfect. Trees can be contorted, bent in weird ways, and they're still beautiful."
            </p>
            <div className="bg-surface rounded-3xl p-8 border border-outline/50 mb-12">
              <ul className="space-y-6">
                {[
                  "Sustainable Extraction Protocols",
                  "Biological-First Formulation",
                  "Carbon-Neutral Logistics",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-6 font-sans font-bold text-[11px] uppercase tracking-[0.2em] text-on-surface">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/story"
              className="inline-block border-b-2 border-primary pb-3 font-sans font-bold text-[11px] uppercase tracking-[0.3em] text-primary hover:opacity-70 transition-all"
            >
              Discover the Origin
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
