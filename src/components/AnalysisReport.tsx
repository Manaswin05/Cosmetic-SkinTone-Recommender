import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { Download, ArrowLeft, Sparkles, RefreshCw } from "lucide-react";

interface ShadeInfo {
  code: string;
  name: string;
  hex: string;
  category: string;
  undertone: string;
  distance?: number;
}

interface SkinAnalysisResult {
  success: boolean;
  detectedColor: { rgb: [number, number, number]; hex: string };
  undertone: string;
  shadeMatch: {
    code: string;
    name: string;
    category: string;
    hex: string;
    undertone: string;
    description: string;
  };
  confidence: number;
  nearbyShades: ShadeInfo[];
  recommendations: { productType: string; reason: string }[];
  allShades: { code: string; name: string; hex: string; category: string; undertone: string }[];
}

interface AnalysisReportProps {
  result: SkinAnalysisResult;
  capturedImage: string;
  onBack: () => void;
}

export default function AnalysisReport({ result, capturedImage, onBack }: AnalysisReportProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!reportRef.current || isDownloading) return;
    setIsDownloading(true);

    try {
      const html2canvas = (await import("html2canvas")).default;
      const el = reportRef.current;
      const origOverflow = el.style.overflow;
      const origHeight = el.style.maxHeight;
      el.style.overflow = "visible";
      el.style.maxHeight = "none";

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#FFFFFF",
        logging: false,
        windowWidth: 900,
      });

      el.style.overflow = origOverflow;
      el.style.maxHeight = origHeight;

      const link = document.createElement("a");
      link.download = `skin-analysis-${result.shadeMatch.code}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="rpt-wrapper"
    >
      {/* Top Action Bar */}
      <div className="rpt-topbar">
        <button onClick={onBack} className="rpt-topbar-back">
          <ArrowLeft size={16} />
          <span>New Analysis</span>
        </button>
        <button onClick={handleDownload} disabled={isDownloading} className="rpt-topbar-download">
          {isDownloading ? (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <Sparkles size={14} />
              </motion.div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Download size={14} />
              <span>Download Report</span>
            </>
          )}
        </button>
      </div>

      {/* ═════════════ PDF REPORT BODY ═════════════ */}
      <div ref={reportRef} className="rpt-page">

        {/* ── Header / Branding ── */}
        <div className="rpt-header">
          <div className="rpt-header-left">
            <span className="rpt-brand-sub">Beauty Intelligence</span>
            <span className="rpt-brand">lumina.</span>
          </div>
          <div className="rpt-header-right">
            <span className="rpt-header-label">AI Skin Tone Analysis Report</span>
            <span className="rpt-header-date">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        </div>

        <div className="rpt-divider" />

        {/* ── Hero: Portrait + Results Summary ── */}
        <div className="rpt-hero">
          <div className="rpt-hero-portrait">
            <img src={capturedImage} alt="Your photo" className="rpt-hero-img" />
          </div>
          <div className="rpt-hero-details">
            <p className="rpt-hero-subtitle">OpenCV Detection</p>
            <h1 className="rpt-hero-title">Your Origin Profile</h1>
            <p className="rpt-hero-desc">
              Your unique biological signature, mapped through precise computer vision analysis.
            </p>

            {/* Detected Color + Code */}
            <div className="rpt-detected-row">
              <div className="rpt-detected-swatch" style={{ backgroundColor: result.detectedColor.hex }} />
              <div className="rpt-detected-info">
                <span className="rpt-detected-label">Detected Skin Tone</span>
                <span className="rpt-detected-name">{result.shadeMatch.name}</span>
                <span className="rpt-detected-meta">{result.detectedColor.hex} · {result.shadeMatch.description}</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="rpt-stats-grid">
              <div className="rpt-stat">
                <span className="rpt-stat-label">Shade Code</span>
                <span className="rpt-stat-value">{result.shadeMatch.code}</span>
              </div>
              <div className="rpt-stat">
                <span className="rpt-stat-label">Category</span>
                <span className="rpt-stat-value">{result.shadeMatch.category}</span>
              </div>
              <div className="rpt-stat">
                <span className="rpt-stat-label">Undertone</span>
                <span className="rpt-stat-value">{result.undertone}</span>
              </div>
              <div className="rpt-stat">
                <span className="rpt-stat-label">Confidence</span>
                <span className="rpt-stat-value rpt-stat-accent">{result.confidence}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rpt-divider" />

        {/* ── SHADE SPECTRUM — Full Width, Centered ── */}
        <div className="rpt-spectrum-section">
          <h2 className="rpt-section-title-big">Shade Spectrum</h2>
          <p className="rpt-section-subtitle">Your position across the complete shade range</p>

          <div className="rpt-spectrum-strip">
            {result.allShades.map((shade) => {
              const isMatch = shade.code === result.shadeMatch.code;
              const isNearby = result.nearbyShades.some(n => n.code === shade.code);
              return (
                <div key={shade.code} className="rpt-spectrum-item">
                  {isMatch && (
                    <span className="rpt-spectrum-you">YOU</span>
                  )}
                  <div
                    className={`rpt-spectrum-bar ${isMatch ? "rpt-spectrum-match" : isNearby ? "rpt-spectrum-nearby" : "rpt-spectrum-default"}`}
                    style={{ backgroundColor: shade.hex }}
                  />
                  {isMatch && (
                    <span className="rpt-spectrum-code">{shade.name}<br />({shade.code})</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="rpt-divider" />

        {/* ── Closest Matches ── */}
        <div className="rpt-section">
          <h2 className="rpt-section-title">Closest Matches</h2>
          <div className="rpt-matches-grid">
            {result.nearbyShades.map((shade, i) => (
              <div key={shade.code} className={`rpt-match-card ${i === 0 ? "rpt-match-primary" : ""}`}>
                <div className="rpt-match-swatch" style={{ backgroundColor: shade.hex }} />
                <div className="rpt-match-info">
                  <span className="rpt-match-name">{shade.name}</span>
                  <span className="rpt-match-meta">{shade.code} · {shade.undertone}</span>
                  {shade.distance !== undefined && (
                    <span className="rpt-match-distance">ΔE {shade.distance}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rpt-divider" />

        {/* ── The Protocol / Recommendations ── */}
        <div className="rpt-section">
          <h2 className="rpt-section-title">The Protocol</h2>
          <p className="rpt-section-subtitle">Recommended products for your skin profile</p>
          <div className="rpt-recs-list">
            {result.recommendations.map((rec, i) => (
              <div key={i} className="rpt-rec-row">
                <span className="rpt-rec-number">0{i + 1}.</span>
                <div className="rpt-rec-info">
                  <span className="rpt-rec-product">{rec.productType}</span>
                  <span className="rpt-rec-reason">{rec.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="rpt-divider" />
        <div className="rpt-footer">
          <div className="rpt-footer-brand">
            <span className="rpt-footer-logo">lumina.</span>
            <span className="rpt-footer-sub">AI-Powered Skin Analysis</span>
          </div>
          <p className="rpt-footer-note">
            This analysis is generated using AI-powered computer vision (OpenCV). Results are for guidance only and may vary based on lighting and image quality.
          </p>
        </div>
      </div>

      {/* Mobile FAB */}
      <button onClick={handleDownload} disabled={isDownloading} className="rpt-fab">
        <Download size={20} />
      </button>
    </motion.div>
  );
}
