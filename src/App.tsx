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

import OurStory from "./pages/OurStory";
import Journal from "./pages/Journal";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/shop" element={<Layout><Shop /></Layout>} />
        <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
        <Route path="/analysis" element={<Layout><SkinAnalysis /></Layout>} />
        <Route path="/story" element={<Layout><OurStory /></Layout>} />
        <Route path="/journal" element={<Layout><Journal /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
