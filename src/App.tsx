/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import SkinAnalysis from "./pages/SkinAnalysis";
import ProductDetail from "./pages/ProductDetail";

// Placeholder for missing pages
const Story = () => (
  <Layout>
    <div className="py-24 px-6 md:px-12 max-w-[1280px] mx-auto min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="font-serif text-4xl mb-6 uppercase tracking-[0.2em] text-on-surface">Our Story</h1>
      <p className="font-serif text-on-surface-variant max-w-2xl leading-relaxed">
        Lumina was born from a desire to bridge the gap between high-end editorial beauty and clinically proven results. 
        Our journey began with a simple mission: to empower every individual to embrace their unique essence through 
        meticulously crafted formulas and cutting-edge technology.
      </p>
    </div>
  </Layout>
);

const Journal = () => (
  <Layout>
    <div className="py-24 px-6 md:px-12 max-w-[1280px] mx-auto min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="font-serif text-4xl mb-6 uppercase tracking-[0.2em] text-on-surface">Journal</h1>
      <p className="font-serif text-on-surface-variant max-w-2xl leading-relaxed">
        Discover the latest trends, expert advice, and behind-the-scenes stories from the world of Lumina. 
        Coming soon.
      </p>
    </div>
  </Layout>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/shop" element={<Layout><Shop /></Layout>} />
        <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
        <Route path="/analysis" element={<Layout><SkinAnalysis /></Layout>} />
        <Route path="/story" element={<Story />} />
        <Route path="/journal" element={<Journal />} />
      </Routes>
    </BrowserRouter>
  );
}
