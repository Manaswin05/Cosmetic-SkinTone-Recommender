import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Camera, Upload, Info, Sun, Sparkles, Target, UserCircle2, Loader2, RefreshCw, CheckCircle2, Palette, Eye } from "lucide-react";

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
  allShades: ShadeInfo[];
}

export default function SkinAnalysis() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SkinAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pollRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => { streamRef.current = stream; }, [stream]);

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (pollRef.current) clearInterval(pollRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const videoCallbackRef = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (!node || !streamRef.current) return;
    if (pollRef.current) clearInterval(pollRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    node.srcObject = streamRef.current;
    node.muted = true;
    node.playsInline = true;
    const playVideo = async () => {
      try {
        await node.play();
        pollRef.current = window.setInterval(() => {
          if (node.videoWidth > 0 && node.videoHeight > 0) {
            setCameraReady(true);
            if (pollRef.current) clearInterval(pollRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
          }
        }, 200);
        timeoutRef.current = window.setTimeout(() => {
          if (pollRef.current) clearInterval(pollRef.current);
          setCameraReady(true);
        }, 8000);
      } catch (err: any) {
        if (err?.name === "AbortError") {
          try {
            await new Promise(r => setTimeout(r, 300));
            if (node.srcObject) {
              await node.play();
              pollRef.current = window.setInterval(() => {
                if (node.videoWidth > 0 && node.videoHeight > 0) {
                  setCameraReady(true);
                  if (pollRef.current) clearInterval(pollRef.current);
                }
              }, 200);
              return;
            }
          } catch {}
        }
        setError("Camera failed to start. Please check browser permissions.");
        if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); setStream(null); setCameraReady(false); }
      }
    };
    playVideo();
  }, []);

  const startCamera = async () => {
    try {
      setError(null); setCameraReady(false);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } } });
      streamRef.current = mediaStream;
      setStream(mediaStream);
    } catch { setError("Unable to access camera. Please check permissions."); }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) { ctx.drawImage(video, 0, 0); setCapturedImage(canvas.toDataURL("image/jpeg")); stopCamera(); }
    }
  };

  const stopCamera = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (videoRef.current) videoRef.current.srcObject = null;
    if (stream) stream.getTracks().forEach(t => t.stop());
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    streamRef.current = null; setStream(null); setCameraReady(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { const reader = new FileReader(); reader.onload = (ev) => setCapturedImage(ev.target?.result as string); reader.readAsDataURL(file); }
  };

  const runAnalysis = async () => {
    if (!capturedImage) return;
    setIsAnalyzing(true); setError(null);
    try {
      const res = await fetch("/api/analyze-skin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: capturedImage }) });
      const text = await res.text();
      if (!text) throw new Error("Backend server is not running.");
      let data;
      try { data = JSON.parse(text); } catch { throw new Error("Invalid response from server."); }
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
    } catch (err: any) {
      if (err.message?.includes("Failed to fetch") || err.message?.includes("NetworkError")) {
        setError("Cannot connect to the analysis server.");
      } else { setError(err.message || "Analysis failed. Please try again."); }
    } finally { setIsAnalyzing(false); }
  };

  const resetAnalysis = () => { setCapturedImage(null); setResult(null); setError(null); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-[1280px] mx-auto px-4 md:px-12 py-6 md:py-20">
      {/* Hero Header */}
      <div className="text-center mb-5 md:mb-16 px-2">
        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-sans font-bold text-[10px] text-primary uppercase mb-2 tracking-[0.4em]">
          {result ? "Results Found" : "OpenCV Precision"}
        </motion.p>
        <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-serif italic text-3xl sm:text-5xl md:text-7xl text-on-surface mb-2 md:mb-8 tracking-tighter">
          {result ? "Your Origin Profile" : "Skin Tone Detection."}
        </motion.h1>
        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="font-serif italic text-sm md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed hidden sm:block">
          {result ? "Your unique biological signature, mapped through precise computer vision analysis." : "Advanced OpenCV skin detection — identifying your perfect cosmetic shade match."}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-16 items-start">
        <div className="lg:col-span-8 space-y-4 md:space-y-12">

          {/* ── INITIAL STATE (mobile: natural flow, desktop: aspect-ratio box) ── */}
          {!stream && !capturedImage && !result && (
            <div className="bg-surface rounded-[24px] md:rounded-[60px] border border-outline/50 shadow-2xl overflow-hidden">
              <div className="flex flex-col items-center justify-center p-6 md:p-16 md:aspect-[16/10] border-2 border-dashed border-outline rounded-[20px] md:rounded-[52px] m-3 md:m-8">
                <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 4 }}
                  className="w-16 h-16 md:w-28 md:h-28 rounded-full bg-surface-container flex items-center justify-center mb-4 md:mb-10 text-primary shadow-xl border border-white">
                  <UserCircle2 size={32} strokeWidth={0.5} className="md:hidden" />
                  <UserCircle2 size={56} strokeWidth={0.5} className="hidden md:block" />
                </motion.div>
                <h3 className="font-serif italic text-xl md:text-3xl text-on-surface mb-2 tracking-tighter">Enter Protocol</h3>
                <p className="font-serif italic text-on-surface-variant mb-5 leading-relaxed text-[13px] md:text-[16px] text-center max-w-sm">
                  Ensure soft, directional lighting. Position your face clearly for maximum fidelity.
                </p>
                <div className="flex flex-col w-full max-w-xs gap-3">
                  <button onClick={startCamera} className="bg-primary text-on-primary px-8 py-4 rounded-2xl font-sans font-bold text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-lg">
                    <Camera size={15} /> Live Frame
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} className="bg-white border border-outline text-on-surface px-8 py-4 rounded-2xl font-sans font-bold text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-surface transition-all">
                    <Upload size={15} /> Import Photo
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                </div>
              </div>
            </div>
          )}

          {/* ── CAMERA STREAM (fixed height on mobile) ── */}
          {stream && (
            <div className="relative h-[360px] sm:h-auto sm:aspect-[16/10] bg-black rounded-[24px] md:rounded-[60px] overflow-hidden shadow-2xl border border-outline/50">
              <video ref={videoCallbackRef} autoPlay playsInline muted style={{ backgroundColor: "#1a1a1a" }} className="w-full h-full object-cover" />
              {!cameraReady && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="mb-4 text-white opacity-60 mx-auto w-fit">
                      <Loader2 size={40} strokeWidth={1} />
                    </motion.div>
                    <p className="font-serif italic text-white text-base">Initializing camera...</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 border-[30px] md:border-[60px] border-black/60 flex items-center justify-center pointer-events-none">
                <div className="w-32 h-44 md:w-64 md:h-80 border border-white/30 rounded-[3rem] md:rounded-[6rem] border-dashed" />
              </div>
              <div className="absolute bottom-4 md:bottom-12 left-0 right-0 flex justify-center gap-3">
                <button onClick={capturePhoto} disabled={!cameraReady} className="bg-white text-primary px-6 md:px-12 py-3 md:py-5 rounded-2xl font-sans font-bold text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed">
                  Capture
                </button>
                <button onClick={stopCamera} className="bg-primary text-white px-6 md:px-12 py-3 md:py-5 rounded-2xl font-sans font-bold text-[10px] uppercase tracking-[0.2em]">
                  Exit
                </button>
              </div>
            </div>
          )}

          {/* ── PREVIEW (captured, not yet analyzed) ── */}
          {capturedImage && !result && (
            <div className="relative h-[360px] sm:h-auto sm:aspect-[16/10] rounded-[24px] md:rounded-[60px] overflow-hidden shadow-2xl border border-outline/50">
              <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-surface/80 backdrop-blur-md flex flex-col items-center justify-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="mb-6 text-primary opacity-40">
                    <Loader2 size={48} strokeWidth={1} />
                  </motion.div>
                  <p className="font-serif italic text-xl md:text-3xl text-on-surface tracking-tighter">Detecting Skin Tone...</p>
                  <p className="font-serif italic text-sm text-on-surface-variant mt-3">OpenCV analyzing facial skin regions</p>
                </div>
              )}
              {!isAnalyzing && (
                <div className="absolute bottom-4 md:bottom-12 left-0 right-0 flex justify-center gap-3">
                  <button onClick={runAnalysis} className="bg-primary text-on-primary px-8 md:px-12 py-3 md:py-5 rounded-2xl font-sans font-bold text-[10px] uppercase tracking-[0.2em] shadow-2xl">
                    Detect Skin Tone
                  </button>
                  <button onClick={() => setCapturedImage(null)} className="bg-white text-on-surface border border-outline px-8 md:px-12 py-3 md:py-5 rounded-2xl font-sans font-bold text-[10px] uppercase tracking-[0.2em]">
                    Retake
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── RESULTS (natural scroll on mobile) ── */}
          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-surface-bright rounded-[24px] md:rounded-[60px] border border-outline/50 shadow-2xl p-5 md:p-14">
              <div className="max-w-2xl mx-auto space-y-6 md:space-y-12">
                {/* Header */}
                <div className="flex items-end justify-between border-b border-outline pb-5 md:pb-10">
                  <div>
                    <p className="font-sans font-bold text-[10px] text-primary uppercase tracking-[0.4em] mb-2 text-left">OpenCV Detection</p>
                    <h2 className="font-serif italic text-3xl md:text-5xl text-on-surface tracking-tighter text-left leading-none uppercase">Results.</h2>
                  </div>
                  <div className="text-right">
                    <p className="font-sans font-bold text-[9px] text-on-surface-variant uppercase tracking-[0.3em] mb-1">Shade Code</p>
                    <span className="font-serif italic text-3xl md:text-5xl text-primary">{result.shadeMatch.code}</span>
                  </div>
                </div>

                {/* Detected Color */}
                <div className="flex items-center gap-4 bg-surface p-4 md:p-8 rounded-[20px] md:rounded-[32px] border border-outline/50 shadow-sm">
                  <div className="w-14 h-14 md:w-24 md:h-24 rounded-full shadow-xl border-4 border-white flex-shrink-0" style={{ backgroundColor: result.detectedColor.hex }} />
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-sans font-bold text-[9px] text-on-surface-variant/60 uppercase tracking-[0.3em] mb-1">Detected Skin Tone</p>
                    <p className="font-serif italic text-base md:text-2xl text-on-surface uppercase tracking-tight truncate">{result.shadeMatch.name}</p>
                    <p className="font-sans text-[11px] text-on-surface-variant mt-1 truncate">{result.detectedColor.hex} · {result.shadeMatch.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-sans font-bold text-[9px] text-on-surface-variant/60 uppercase tracking-[0.3em] mb-1">Confidence</p>
                    <p className="font-serif italic text-2xl md:text-3xl text-primary">{result.confidence}%</p>
                  </div>
                </div>

                {/* Skin Type & Undertone */}
                <div className="grid grid-cols-2 gap-3 md:gap-8">
                  <div className="bg-surface p-4 md:p-8 rounded-[20px] md:rounded-[32px] border border-outline/50 shadow-sm">
                    <p className="font-sans font-bold text-[9px] text-on-surface-variant/60 uppercase tracking-[0.3em] mb-2">Skin Category</p>
                    <p className="font-serif italic text-base md:text-2xl text-on-surface uppercase tracking-tight">{result.shadeMatch.category}</p>
                  </div>
                  <div className="bg-surface p-4 md:p-8 rounded-[20px] md:rounded-[32px] border border-outline/50 shadow-sm">
                    <p className="font-sans font-bold text-[9px] text-on-surface-variant/60 uppercase tracking-[0.3em] mb-2">Color Harmony</p>
                    <p className="font-serif italic text-base md:text-2xl text-on-surface uppercase tracking-tight">{result.undertone}</p>
                  </div>
                </div>

                {/* Shade Strip */}
                <div className="space-y-3">
                  <p className="font-sans font-bold text-[10px] text-on-surface-variant uppercase tracking-[0.4em] text-left">Shade Spectrum</p>
                  <div className="flex gap-1 items-end">
                    {result.allShades.map((shade) => {
                      const isMatch = shade.code === result.shadeMatch.code;
                      const isNearby = result.nearbyShades.some(n => n.code === shade.code);
                      return (
                        <div key={shade.code} className="flex flex-col items-center gap-1 flex-1">
                          {isMatch && (
                            <motion.div initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                              className="font-sans font-bold text-[7px] text-primary uppercase tracking-wider whitespace-nowrap">You</motion.div>
                          )}
                          <div className={`w-full rounded-md transition-all ${isMatch ? "h-10 ring-2 ring-primary ring-offset-1 shadow-lg" : isNearby ? "h-7 opacity-80" : "h-5 opacity-40"}`}
                            style={{ backgroundColor: shade.hex }} title={`${shade.name} (${shade.code})`} />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Nearby Shades */}
                <div className="space-y-3">
                  <p className="font-sans font-bold text-[10px] text-on-surface-variant uppercase tracking-[0.4em] text-left">Closest Matches</p>
                  <div className="flex flex-col gap-2 md:flex-row md:gap-4">
                    {result.nearbyShades.map((shade, i) => (
                      <div key={shade.code} className={`flex items-center gap-3 bg-surface p-3 md:p-5 rounded-2xl border ${i === 0 ? "border-primary/30" : "border-outline/30"}`}>
                        <div className="w-9 h-9 rounded-full shadow-md border-2 border-white flex-shrink-0" style={{ backgroundColor: shade.hex }} />
                        <div className="text-left min-w-0">
                          <p className="font-serif italic text-sm text-on-surface truncate">{shade.name}</p>
                          <p className="font-sans text-[10px] text-on-surface-variant truncate">{shade.code} · {shade.undertone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-4">
                  <p className="font-sans font-bold text-[10px] text-on-surface-variant uppercase tracking-[0.4em] text-left">The Protocol</p>
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="flex gap-4 group items-start">
                      <span className="font-serif italic text-3xl md:text-5xl text-primary/10 leading-none flex-shrink-0">0{i + 1}.</span>
                      <div className="text-left pt-1">
                        <p className="font-serif italic text-base md:text-2xl text-on-surface mb-1 tracking-tight uppercase leading-none">{rec.productType}</p>
                        <p className="font-serif italic text-sm text-on-surface-variant leading-relaxed opacity-80">{rec.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Restart */}
                <div className="pt-6 flex justify-center">
                  <button onClick={resetAnalysis} className="flex items-center gap-4 text-[11px] font-sans font-bold uppercase tracking-[0.4em] text-on-surface-variant hover:text-primary transition-all group">
                    <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
                    Restart Diagnosis
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 p-4 rounded-2xl flex items-center gap-3 text-red-800 font-serif text-sm border border-red-200">
              <Info size={16} className="flex-shrink-0" /> <span>{error}</span>
            </motion.div>
          )}

          {!result && !stream && !capturedImage && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
              {[
                { icon: <Eye size={16} />, title: "Face Detection", subtitle: "Haar cascade locates your face precisely" },
                { icon: <Palette size={16} />, title: "HSV Segmentation", subtitle: "Isolates true skin tone from cheeks & forehead" },
                { icon: <Target size={16} />, title: "K-Means Matching", subtitle: "Clusters dominant color, matches to shade DB" },
              ].map((feature, i) => (
                <div key={i} className="p-4 md:p-6 bg-surface rounded-2xl border border-outline/30 text-center">
                  <div className="w-9 h-9 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-3 text-primary">{feature.icon}</div>
                  <p className="font-sans font-bold text-[10px] text-primary uppercase tracking-[0.3em] mb-1">{feature.title}</p>
                  <p className="font-serif text-[12px] text-on-surface-variant italic leading-relaxed">{feature.subtitle}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Side Info Panel — hidden on mobile */}
        <div className="hidden lg:block lg:col-span-4 space-y-8">
          <div className="bg-surface-container-low p-8 border border-surface-container-high rounded-sm">
            <h2 className="font-serif text-2xl text-on-surface mb-10 uppercase tracking-tighter">The Protocol</h2>
            <div className="space-y-10">
              {[
                { icon: <Sun size={18} strokeWidth={1.5} />, title: "Natural Light", text: "Soft daylight ensures the most accurate capture of your natural pigmentation." },
                { icon: <Sparkles size={18} strokeWidth={1.5} />, title: "Purity", text: "A bare face reveals the underlying canvas for better treatment recommendations." },
                { icon: <CheckCircle2 size={18} strokeWidth={1.5} />, title: "Confidence", text: "OpenCV face detection with K-means skin tone clustering for precise shade matching." },
              ].map((item) => (
                <div key={item.title} className="flex gap-5">
                  <div className="text-primary mt-1 flex-shrink-0">{item.icon}</div>
                  <div>
                    <p className="font-sans font-bold text-[12px] text-on-surface uppercase tracking-widest mb-2">{item.title}</p>
                    <p className="font-serif italic text-[14px] text-on-surface-variant leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 p-6 bg-surface-container-lowest border border-outline-variant/30 italic font-serif text-[15px] text-on-surface-variant leading-relaxed">
              "True beauty radiance comes from understanding your unique biological signature."
            </div>
          </div>
          <div className="aspect-[3/4] relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 group">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaYUxSZuLWF-QFXV7hQOeRISGkN2sMAOwfSr_s19m2AEumdR_yeCmyMmO1gS3fMouurKx7EZpXVsHNe3XexF0D_vNi2EC9uXgC5NzdX1IieZ9h2nbawfIkNASQT_eAyjGblcJz6cPkUFw90idsXOkEDnNFKHVal-9oVHwFWH2BhtnsTen5L-5Cq3f_tkyUbLNhngQsfJRSb5oPnAy-WEHjvOdXRawtxc2K5T91MrY6Ip2RTbpagtCjuhh5JyNuNosjpuPH6I49WdCy"
              alt="Portrait" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white font-sans font-bold text-[10px] uppercase tracking-[0.4em]">Scan Reference</p>
            </div>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  );
}
