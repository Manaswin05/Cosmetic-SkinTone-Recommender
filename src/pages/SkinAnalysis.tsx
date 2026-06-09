import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
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

  // Keep streamRef in sync
  useEffect(() => {
    streamRef.current = stream;
  }, [stream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      if (pollRef.current) clearInterval(pollRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Callback ref: fires the moment the <video> element mounts in the DOM
  // This solves the AnimatePresence timing issue — the video element doesn't
  // exist until AnimatePresence finishes the exit animation of the previous view.
  const videoCallbackRef = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;

    if (!node || !streamRef.current) return;

    console.log("Video element mounted, attaching stream", streamRef.current.getTracks());

    // Clear any previous polling
    if (pollRef.current) clearInterval(pollRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    node.srcObject = streamRef.current;
    node.muted = true;
    node.playsInline = true;

    const playVideo = async () => {
      try {
        await node.play();
        console.log("Video play() called successfully");

        // Poll for video dimensions to confirm it's actually rendering
        pollRef.current = window.setInterval(() => {
          if (node.videoWidth > 0 && node.videoHeight > 0) {
            console.log("✓ Video is rendering!", node.videoWidth, "x", node.videoHeight);
            setCameraReady(true);
            if (pollRef.current) clearInterval(pollRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
          }
        }, 200);

        // Timeout after 8 seconds
        timeoutRef.current = window.setTimeout(() => {
          if (pollRef.current) clearInterval(pollRef.current);
          console.warn("Video dimensions still 0 after 8s — forcing display");
          setCameraReady(true);
        }, 8000);
      } catch (err: any) {
        console.warn("Video play failed:", err?.name, err?.message);
        // AbortError is transient — retry once after a short delay
        if (err?.name === "AbortError") {
          console.log("Retrying play() after AbortError...");
          try {
            await new Promise(r => setTimeout(r, 300));
            if (node.srcObject) {
              await node.play();
              console.log("Retry play() succeeded");
              pollRef.current = window.setInterval(() => {
                if (node.videoWidth > 0 && node.videoHeight > 0) {
                  console.log("✓ Video is rendering after retry!", node.videoWidth, "x", node.videoHeight);
                  setCameraReady(true);
                  if (pollRef.current) clearInterval(pollRef.current);
                }
              }, 200);
              return;
            }
          } catch (retryErr) {
            console.error("Retry play() also failed:", retryErr);
          }
        }
        setError("Camera failed to start. Please check browser permissions and try again.");
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
          setStream(null);
          setCameraReady(false);
        }
      }
    };

    playVideo();
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      setCameraReady(false);

      console.log("Requesting camera access...");
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      console.log("Camera access granted", mediaStream.getTracks());

      // Set stream immediately — React will render the video element,
      // and the callback ref (videoCallbackRef) will fire when it mounts.
      streamRef.current = mediaStream;
      setStream(mediaStream);
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Unable to access camera. Please check permissions.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Mirror the captured image to match the mirrored live preview
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0);
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
        setCapturedImage(canvas.toDataURL("image/jpeg", 0.95));
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (videoRef.current) videoRef.current.srcObject = null;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    streamRef.current = null;
    setStream(null);
    setCameraReady(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setCapturedImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!capturedImage) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze-skin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: capturedImage }),
      });

      // Check if backend returned an empty response (not running)
      const text = await res.text();
      if (!text) {
        throw new Error("Backend server is not running. Please start the backend with: cd backend && python app.py");
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid response from server. Make sure the backend is running on port 5000.");
      }

      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
    } catch (err: any) {
      if (err.message?.includes("Failed to fetch") || err.message?.includes("NetworkError")) {
        setError("Cannot connect to the analysis server. Please ensure the backend is running (cd backend && python app.py).");
      } else {
        setError(err.message || "Analysis failed. Please try again with a clearer photo.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => { setCapturedImage(null); setResult(null); setError(null); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 py-10 md:py-20">
      {/* Hero Header */}
      <div className="text-center mb-8 md:mb-16 px-2 sm:px-4">
        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-sans font-bold text-[10px] text-primary uppercase mb-3 md:mb-4 tracking-[0.4em]">
          {result ? "Results Found" : "OpenCV Precision"}
        </motion.p>
        <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-serif italic text-4xl sm:text-5xl md:text-7xl text-on-surface mb-4 md:mb-8 tracking-tighter">
          {result ? "Your Origin Profile" : "Skin Tone Detection."}
        </motion.h1>
        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="font-serif italic text-base sm:text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          {result
            ? "Your unique biological signature, mapped through precise computer vision analysis."
            : "Advanced OpenCV skin detection — identifying your perfect cosmetic shade match."}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-start">
        {/* Interaction Area */}
        <div className="lg:col-span-8 space-y-8 md:space-y-12">
          <div className="relative aspect-[3/4] sm:aspect-[4/3] md:aspect-[16/10] bg-surface rounded-[24px] sm:rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl border border-outline/50 group">
            <AnimatePresence mode="sync">
              {/* Initial State */}
              {!stream && !capturedImage && !result && (
                <motion.div key="initial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 m-3 sm:m-5 md:m-8 border-2 border-dashed border-outline rounded-[20px] sm:rounded-[30px] md:rounded-[40px]">
                  <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 4 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-full bg-surface-container flex items-center justify-center mb-6 sm:mb-8 md:mb-10 text-primary shadow-xl border border-white">
                    <UserCircle2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14" strokeWidth={0.5} />
                  </motion.div>
                  <div className="text-center max-w-md">
                    <h3 className="font-serif italic text-xl sm:text-2xl md:text-3xl text-on-surface mb-3 md:mb-4 tracking-tighter">Enter Protocol</h3>
                    <p className="font-serif italic text-on-surface-variant mb-6 sm:mb-8 md:mb-12 leading-relaxed text-sm sm:text-[15px] md:text-[16px]">
                      Ensure soft, directional lighting. Position your face clearly within the digital sight for maximum fidelity.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center">
                      <button onClick={startCamera} className="bg-primary text-on-primary px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-sans font-bold text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.3em] flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-lg">
                        <Camera size={14} className="sm:w-4 sm:h-4" /> Live Frame
                      </button>
                      <button onClick={() => fileInputRef.current?.click()} className="bg-white border border-outline text-on-surface px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-sans font-bold text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-surface transition-all">
                        <Upload size={14} className="sm:w-4 sm:h-4" /> Import Data
                      </button>
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Camera Stream */}
              {stream && (
                <motion.div key="camera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#000]">
                  <video
                    ref={videoCallbackRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ backgroundColor: '#1a1a1a', transform: 'scaleX(-1)' }}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Loading overlay while camera initializes */}
                  {!cameraReady && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                      <div className="text-center">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="mb-4 text-white opacity-60 mx-auto w-fit">
                          <Loader2 size={48} strokeWidth={1} />
                        </motion.div>
                        <p className="font-serif italic text-white text-lg">Initializing camera...</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 border-[20px] sm:border-[40px] md:border-[60px] border-[#000]/60 flex items-center justify-center pointer-events-none">
                    <div className="w-40 h-52 sm:w-52 sm:h-68 md:w-64 md:h-80 border border-white/30 rounded-[4rem] sm:rounded-[5rem] md:rounded-[6rem] border-dashed" />
                  </div>
                  <div className="absolute bottom-4 sm:bottom-8 md:bottom-12 left-0 right-0 flex justify-center gap-3 sm:gap-4 md:gap-6 px-4">
                    <button onClick={capturePhoto} disabled={!cameraReady} className="bg-white text-primary px-6 sm:px-8 md:px-12 py-3.5 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-sans font-bold text-[10px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.3em] shadow-2xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed">
                      Capture Origin
                    </button>
                    <button onClick={stopCamera} className="bg-primary text-white px-6 sm:px-8 md:px-12 py-3.5 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-sans font-bold text-[10px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.3em] backdrop-blur-md">
                      Exit
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Preview (captured, not yet analyzed) */}
              {capturedImage && !result && (
                <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col">
                  <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-surface/80 backdrop-blur-md flex flex-col items-center justify-center">
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="mb-8 text-primary opacity-40">
                        <Loader2 size={64} strokeWidth={1} />
                      </motion.div>
                      <p className="font-serif italic text-3xl text-on-surface tracking-tighter">Detecting Skin Tone...</p>
                      <p className="font-serif italic text-sm text-on-surface-variant mt-4">OpenCV analyzing facial skin regions</p>
                    </div>
                  )}
                  {!isAnalyzing && (
                    <div className="absolute bottom-4 sm:bottom-8 md:bottom-12 left-0 right-0 flex justify-center gap-3 sm:gap-4 md:gap-6 px-4">
                      <button onClick={runAnalysis} className="bg-primary text-on-primary px-6 sm:px-8 md:px-12 py-3.5 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-sans font-bold text-[10px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.3em] shadow-2xl">
                        Detect Skin Tone
                      </button>
                      <button onClick={() => setCapturedImage(null)} className="bg-white text-on-surface border border-outline px-6 sm:px-8 md:px-12 py-3.5 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-sans font-bold text-[10px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.3em]">
                        Retake
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Results */}
              {result && (
                <motion.div key="results" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-surface-bright p-5 sm:p-8 md:p-14 overflow-y-auto hide-scrollbar">
                  <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 md:space-y-12">
                    {/* Header with shade code */}
                    <div className="flex items-end justify-between border-b border-outline pb-6 sm:pb-8 md:pb-10">
                      <div>
                        <p className="font-sans font-bold text-[9px] sm:text-[10px] text-primary uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-2 sm:mb-4 text-left">OpenCV Detection</p>
                        <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-on-surface tracking-tighter text-left leading-none uppercase">Results.</h2>
                      </div>
                      <div className="text-right">
                        <p className="font-sans font-bold text-[9px] sm:text-[10px] text-on-surface-variant uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-1 sm:mb-2">Shade Code</p>
                        <span className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-primary">{result.shadeMatch.code}</span>
                      </div>
                    </div>

                    {/* Detected Color Swatch */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8 bg-surface p-5 sm:p-6 md:p-8 rounded-[20px] sm:rounded-[28px] md:rounded-[32px] border border-outline/50 shadow-sm">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full shadow-xl border-4 border-white shrink-0" style={{ backgroundColor: result.detectedColor.hex }} />
                      <div className="flex-1 text-center sm:text-left">
                        <p className="font-sans font-bold text-[9px] sm:text-[10px] text-on-surface-variant/60 uppercase tracking-[0.3em] mb-1 sm:mb-2">Detected Skin Tone</p>
                        <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-on-surface uppercase tracking-tight">{result.shadeMatch.name}</p>
                        <p className="font-sans text-[11px] sm:text-[12px] text-on-surface-variant mt-1">{result.detectedColor.hex} · {result.shadeMatch.description}</p>
                      </div>
                      <div className="text-center sm:text-right">
                        <p className="font-sans font-bold text-[9px] sm:text-[10px] text-on-surface-variant/60 uppercase tracking-[0.3em] mb-1">Confidence</p>
                        <p className="font-serif italic text-2xl sm:text-3xl text-primary">{result.confidence}%</p>
                      </div>
                    </div>

                    {/* Skin Type & Undertone */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:gap-8">
                      <div className="bg-surface p-4 sm:p-6 md:p-8 rounded-[16px] sm:rounded-[24px] md:rounded-[32px] border border-outline/50 shadow-sm">
                        <p className="font-sans font-bold text-[9px] sm:text-[10px] text-on-surface-variant/60 uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-2 sm:mb-4">Skin Category</p>
                        <p className="font-serif italic text-base sm:text-xl md:text-2xl text-on-surface uppercase tracking-tight">{result.shadeMatch.category}</p>
                      </div>
                      <div className="bg-surface p-4 sm:p-6 md:p-8 rounded-[16px] sm:rounded-[24px] md:rounded-[32px] border border-outline/50 shadow-sm">
                        <p className="font-sans font-bold text-[9px] sm:text-[10px] text-on-surface-variant/60 uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-2 sm:mb-4">Color Harmony</p>
                        <p className="font-serif italic text-base sm:text-xl md:text-2xl text-on-surface uppercase tracking-tight">{result.undertone}</p>
                      </div>
                    </div>

                    {/* Shade Strip - all shades with matched highlighted */}
                    <div className="space-y-4">
                      <p className="font-sans font-bold text-[10px] text-on-surface-variant uppercase tracking-[0.4em] text-left">Shade Spectrum</p>
                      <div className="flex gap-1.5 items-end">
                        {result.allShades.map((shade) => {
                          const isMatch = shade.code === result.shadeMatch.code;
                          const isNearby = result.nearbyShades.some(n => n.code === shade.code);
                          return (
                            <div key={shade.code} className="flex flex-col items-center gap-2 flex-1">
                              {isMatch && (
                                <motion.div initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                                  className="font-sans font-bold text-[8px] text-primary uppercase tracking-wider whitespace-nowrap">
                                  You
                                </motion.div>
                              )}
                              <div
                                className={`w-full rounded-lg transition-all ${isMatch ? "h-14 ring-2 ring-primary ring-offset-2 shadow-lg" : isNearby ? "h-10 opacity-80" : "h-8 opacity-40"}`}
                                style={{ backgroundColor: shade.hex }}
                                title={`${shade.name} (${shade.code})`}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Nearby Shades */}
                    <div className="space-y-4">
                      <p className="font-sans font-bold text-[10px] text-on-surface-variant uppercase tracking-[0.4em] text-left">Closest Matches</p>
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        {result.nearbyShades.map((shade, i) => (
                          <div key={shade.code} className={`flex-1 flex items-center gap-3 sm:gap-4 bg-surface p-3 sm:p-5 rounded-xl sm:rounded-2xl border ${i === 0 ? "border-primary/30" : "border-outline/30"}`}>
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-md border-2 border-white shrink-0" style={{ backgroundColor: shade.hex }} />
                            <div className="text-left">
                              <p className="font-serif italic text-xs sm:text-sm text-on-surface">{shade.name}</p>
                              <p className="font-sans text-[9px] sm:text-[10px] text-on-surface-variant">{shade.code} · {shade.undertone}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-4 sm:space-y-6 md:space-y-8">
                      <p className="font-sans font-bold text-[10px] text-on-surface-variant uppercase tracking-[0.4em] text-left">The Protocol</p>
                      <div className="space-y-4 sm:space-y-6">
                        {result.recommendations.map((rec, i) => (
                          <div key={i} className="flex gap-4 sm:gap-6 md:gap-8 group items-start">
                            <span className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-primary/10 group-hover:text-primary/30 transition-colors leading-none">0{i + 1}.</span>
                            <div className="text-left pt-1">
                              <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-on-surface mb-1 sm:mb-2 tracking-tight group-hover:text-primary transition-colors uppercase leading-none">{rec.productType}</p>
                              <p className="font-serif italic text-xs sm:text-sm text-on-surface-variant leading-relaxed opacity-80">{rec.reason}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Restart */}
                    <div className="pt-12 flex justify-center">
                      <button onClick={resetAnalysis} className="flex items-center gap-4 text-[11px] font-sans font-bold uppercase tracking-[0.4em] text-on-surface-variant hover:text-primary transition-all group">
                        <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
                        Restart Diagnosis
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>


          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 p-4 rounded-2xl flex items-center gap-3 text-red-800 font-serif text-sm border border-red-200">
              <Info size={16} /> {error}
            </motion.div>
          )}

          {!result && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                { icon: <Eye size={18} />, title: "Face Detection", subtitle: "Haar cascade locates your face precisely" },
                { icon: <Palette size={18} />, title: "HSV Segmentation", subtitle: "Isolates true skin tone from cheeks & forehead" },
                { icon: <Target size={18} />, title: "K-Means Matching", subtitle: "Clusters dominant color, matches to shade DB" },
              ].map((feature, i) => (
                <div key={i} className="p-4 sm:p-6 bg-surface rounded-xl sm:rounded-2xl border border-outline/30 text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-3 sm:mb-4 text-primary">{feature.icon}</div>
                  <p className="font-sans font-bold text-[10px] text-primary uppercase tracking-[0.3em] mb-1.5 sm:mb-2">{feature.title}</p>
                  <p className="font-serif text-[12px] sm:text-[13px] text-on-surface-variant italic leading-relaxed">{feature.subtitle}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Side Info Panel */}
        <div className="lg:col-span-4 space-y-6 sm:space-y-8">
          <div className="bg-surface-container-low p-5 sm:p-6 md:p-8 border border-surface-container-high rounded-sm">
            <h2 className="font-serif text-2xl text-on-surface mb-10 flex items-center gap-3 uppercase tracking-tighter">The Protocol</h2>
            <div className="space-y-10">
              <div className="flex gap-5">
                <Sun className="text-primary mt-1" size={20} strokeWidth={1.5} />
                <div>
                  <p className="font-sans font-bold text-[12px] text-on-surface uppercase tracking-widest mb-2">Natural Light</p>
                  <p className="font-serif italic text-[14px] text-on-surface-variant leading-relaxed">Soft daylight ensures the most accurate capture of your natural pigmentation.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <Sparkles className="text-primary mt-1" size={20} strokeWidth={1.5} />
                <div>
                  <p className="font-sans font-bold text-[12px] text-on-surface uppercase tracking-widest mb-2">Purity</p>
                  <p className="font-serif italic text-[14px] text-on-surface-variant leading-relaxed">A bare face reveals the underlying canvas for better treatment recommendations.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <CheckCircle2 className="text-primary mt-1" size={20} strokeWidth={1.5} />
                <div>
                  <p className="font-sans font-bold text-[12px] text-on-surface uppercase tracking-widest mb-2">Confidence</p>
                  <p className="font-serif italic text-[14px] text-on-surface-variant leading-relaxed">OpenCV face detection with K-means skin tone clustering for precise shade matching.</p>
                </div>
              </div>
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
