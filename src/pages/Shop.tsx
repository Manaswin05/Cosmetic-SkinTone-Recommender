import { motion } from "motion/react";
import { Star, ChevronDown, ArrowLeft, ArrowRight, Sparkles, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const PRODUCTS = [
  {
    id: 1,
    name: "Radiance Serum Foundation",
    brand: "Lumina Beauty",
    price: "₹4,640",
    rating: 4.5,
    reviews: 128,
    isMatch: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAW3-jR6CPjhCyzJdHN1v6A_Dl4nJAr-YUK1rsNCXjgXxUOUYrwU--1k9PGJouVP9epzszi1k35_CA1KyzlDqJlEQI2Knp8NbQPAeX99xFkyV3PFQmE6qygzKpDPpHR94B0gtZofYOLCpbvB372p5Q8LPfAP3XqTl5F6et_MzY5-1iWb7uRGhImnLfQ2XcVZ9PdkCs4jG4-NaF52QcCgPwYpZVcna10tgG3spnJUZiggFvVybR5MgcMtTiauBF5HFaLkSMSdQAdmOL3",
  },
  {
    id: 2,
    name: "Velvet Matte Base",
    brand: "Lumina Beauty",
    price: "₹3,600",
    rating: 5,
    reviews: 340,
    isMatch: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1vxSYZe0imDvQ-ex1hsi-woTBmqQQM5cYIKCn7jRQv4Gl0VxG_e2Q5J1haJVPYlOw7Vci-3mB1rsDCgGSoFiKYiuFI-_XQYuwZVGBd3-3NVWYErU8rpZ10BvxBoT_hLCYCflrG3cI2GuKmSXSthDunjODS6w3SN7usej62tXAWQFnKXxCo2Hyb7DYmKdO7j5vAWblyr847qAmfPbqYHTiGV3ADmymQykBbFgZnGly0xYbzo1SjMkPKNF_e0N4dfXIzyBptkGmiRee",
  },
  {
    id: 3,
    name: "Dewy Glow Cushion",
    brand: "Silk & Stone",
    price: "₹5,760",
    rating: 4,
    reviews: 92,
    isMatch: false,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgEhf-EuJN-s-vB1hmBq3I-bt4QzQwllW2OCpEAN7obtC10Ba5yenFCz85jrCOIoYNfz5t9QHOa6822Wha1WvQlyu8WKdM4WYFwMOQ6ADKCvdbnTtQ3nLJ2QjaR5jdCTUicN-WS_QKroH2BRJVK9qBRNfVQSPHXedXMAdkmEXZ1z3Ihetl7tB2hCPTeW5deP-XWN-Av5v4Z2mD5qo4f8LlvwAjuhvVvqm8FEhPnwfq5Fon0pVyfCNStHB18bSnS5OcDGYjOEgDvKkt",
  },
  {
    id: 4,
    name: "Pure Skin Tint",
    brand: "Lumina Beauty",
    price: "₹3,040",
    rating: 5,
    reviews: 512,
    isMatch: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJkCyYLutp3nXSfldsuceX1vCNgL6fKkznZ57_tIGnVJRkb4avMeLPehcwpn09-fK67J0VlyNTmLzipCtKG7gXWV3vN_lPqX6CaX2-xq8RTZI4TRn89MV4NeGtjdi5VgMbH50Wq4OKND0cZ44qTPl3byYmSecmAQDiacwQPz78Gswm2t9c6Dz_5smBoSthpy62Zcgbh5AxVvskTShA-B6HVXrk_Mv1EvK8RCss605_Ssv5lX4Xpu5634vZpLfQHzuB4ZugDD9ltFXb",
  },
  {
    id: 5,
    name: "Essential Finish Balm",
    brand: "Aether Glow",
    price: "₹5,120",
    rating: 4,
    reviews: 115,
    isMatch: false,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGBqzz9onaD3LUz7Z8Il4eFVY3M6ZXlVj5e-23oIbarWdRhpP5FOAMySp-MolHbD1VrdxzEXFz4nxDAC4v_aji27CNrlgu750LMIPE2jlwfr9ue10_k1czv30y0NPnRG9IqrNJ-7v96NfkCP4Az5Azl05NOp5C8b173-ni28qxgtUqTYuQUDqdWt1WLVuIVgpc-ow6llUtRWF4F_PcRfzPErL3x1Y4Exm1nnvZNwzwmWqM6tk3XEBfmbpDCeBH-T2YNOEd-H84u5UQ",
  },
  {
    id: 6,
    name: "Ultra Definition HD",
    brand: "Silk & Stone",
    price: "₹6,400",
    rating: 5,
    reviews: 210,
    isMatch: false,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaJk_fA257wf5Mrar0mBK_nNtUUI9n5o4hCkkXhFxebQsNwk3O5wONuie6MSNn78PaTcBdXg6L2ksKBn_MWTqWjGVFHSh848gpkeuPh3LJa6rnZVymkbrOoE3dCq3-Z8UiB8zrEjv-f9lVvAsg5uK0qawyxdxWbTkqyGgz9LKUuy1hyeml8Td7xUDLRKKfkAjLvybFHGPFnZbwxo_T66zOgdfjiRP4oUmuOhgMiG7EaXH_INfzTF0I7sPRjLU-qYCJKXOqgWFl5pyh",
  },
];

export default function Shop() {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCoverage, setSelectedCoverage] = useState<string | null>(null);
  const [selectedFinish, setSelectedFinish] = useState<string | null>(null);
  const [cart, setCart] = useState<number[]>([]);
  const [showCartNotif, setShowCartNotif] = useState(false);

  const filteredProducts = PRODUCTS.filter((product) => {
    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    return brandMatch;
  });

  const addToCart = (productId: number) => {
    setCart([...cart, productId]);
    setShowCartNotif(true);
    setTimeout(() => setShowCartNotif(false), 2000);
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-12"
    >
      {/* Cart Notification */}
      {showCartNotif && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-8 right-8 bg-primary text-white px-6 py-4 rounded-2xl font-sans font-bold text-[11px] uppercase tracking-[0.3em] shadow-2xl z-50"
        >
          ✓ Added to Collection ({cart.length})
        </motion.div>
      )}

      {/* Search Result Banner */}
      <section className="mb-8 sm:mb-12 md:mb-16 bg-primary rounded-[20px] sm:rounded-[30px] md:rounded-[40px] p-5 sm:p-7 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center text-white shadow-2xl shadow-primary/20 relative overflow-hidden gap-4">
        <div className="z-10 flex items-center gap-4 sm:gap-6 md:gap-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20 shrink-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="font-sans font-bold text-[9px] sm:text-[10px] uppercase opacity-70 tracking-[0.3em] sm:tracking-[0.4em] mb-1 sm:mb-2 text-left">
              Current Signature
            </h2>
            <p className="font-serif italic text-xl sm:text-2xl md:text-4xl text-white tracking-tighter">
              Sand Medium <span className="opacity-50">—</span> <span className="italic font-normal">Optimal</span>
            </p>
          </div>
        </div>
        <div className="mt-8 md:mt-0 flex items-center gap-8 z-10">
          <div className="text-right">
            <p className="font-sans font-bold text-[9px] uppercase opacity-60 tracking-[0.3em] mb-1">Products Found</p>
            <p className="font-sans font-bold text-[13px] tracking-tight">{filteredProducts.length} Items</p>
          </div>
          <div className="text-right">
            <p className="font-sans font-bold text-[9px] uppercase opacity-60 tracking-[0.3em] mb-1">In Collection</p>
            <p className="font-sans font-bold text-[13px] tracking-tight">{cart.length} Items</p>
          </div>
        </div>
        
        {/* Abstract Shapes */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-primary-container/20 rounded-full blur-[60px]" />
      </section>

      <div className="flex flex-col md:flex-row gap-8 sm:gap-12 md:gap-16">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-72 flex-shrink-0 space-y-8 sm:space-y-12 md:space-y-16">
          <div className="bg-surface p-6 sm:p-8 md:p-10 rounded-[20px] sm:rounded-[30px] md:rounded-[40px] border border-outline/50">
            <div className="mb-12">
              <h3 className="font-sans font-bold text-[10px] uppercase tracking-[0.4em] text-primary mb-8">
                The Origins
              </h3>
              <div className="space-y-5">
                {["Lumina Beauty", "Silk & Stone", "Aether Glow"].map((brand) => (
                  <label key={brand} className="flex items-center gap-4 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBrands([...selectedBrands, brand]);
                        } else {
                          setSelectedBrands(selectedBrands.filter(b => b !== brand));
                        }
                      }}
                      className="w-4 h-4 rounded border-outline-variant cursor-pointer"
                    />
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 lg:gap-x-10 gap-y-10 sm:gap-y-14 lg:gap-y-20">
            {filteredProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="group relative flex flex-col">
                <div className="aspect-[3/4] rounded-[20px] sm:rounded-[32px] md:rounded-[48px] overflow-hidden bg-surface mb-4 sm:mb-6 md:mb-8 relative border border-outline/30 shadow-sm transition-all duration-700 hover:shadow-2xl hover:shadow-primary/5">
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
                  <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/20 to-transparent translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex gap-3">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product.id);
                      }}
                      className="flex-1 bg-primary text-white py-3 rounded-[16px] font-sans font-bold text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={14} />
                      Add
                    </button>
                    <div className="flex-1 bg-white text-primary py-3 rounded-[16px] font-sans font-bold text-[10px] uppercase tracking-[0.2em] text-center shadow-2xl">
                      View
                    </div>
                  </div>
                </div>
                <div className="px-1 sm:px-3 md:px-5">
                  <p className="font-serif italic text-[11px] sm:text-[13px] md:text-[14px] text-on-surface-variant mb-0.5 sm:mb-1 opacity-60">
                    {product.brand}
                  </p>
                  <h4 className="font-serif italic text-base sm:text-lg md:text-2xl text-on-surface mb-1.5 sm:mb-2 md:mb-3 group-hover:text-primary transition-colors leading-tight">
                    {product.name}
                  </h4>
                  <div className="flex justify-between items-center">
                    <span className="font-sans font-bold text-[12px] sm:text-[13px] md:text-[15px] text-primary tracking-tight">{product.price}</span>
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
