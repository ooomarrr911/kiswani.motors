import React from 'react';
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ChevronDown, Zap, Shield, Gauge, Star, ArrowRight, Menu, X, Play } from "lucide-react";

// ─── DATA ───────────────────────────────────────────────────────────────────

const BMW_MODELS = [
  { id: 1, name: "M5 Competition", year: "2025", hp: "717", speed: "3.4s", tag: "The Ultimate Driving Machine", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/2025_BMW_M5_%28G90%29%2C_front_8.28.23.jpg/1280px-2025_BMW_M5_%28G90%29%2C_front_8.28.23.jpg" },
  { id: 2, name: "7 Series", year: "2025", hp: "536", speed: "4.1s", tag: "Luxury Redefined", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/2023_BMW_7_Series_%28G70%29_sedan%2C_front_8.6.22.jpg/1280px-2023_BMW_7_Series_%28G70%29_sedan%2C_front_8.6.22.jpg" },
  { id: 3, name: "XM Label", year: "2025", hp: "748", speed: "3.8s", tag: "Electrified Dominance", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/2023_BMW_XM_%28G09%29_SUV%2C_front_8.6.22.jpg/1280px-2023_BMW_XM_%28G09%29_SUV%2C_front_8.6.22.jpg" },
];

const MERC_MODELS = [
  { id: 1, name: "AMG GT 63 S", year: "2025", hp: "831", speed: "2.9s", tag: "Driving Performance", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/2024_Mercedes-AMG_GT_63_S_E_Performance%2C_front_9.3.23.jpg/1280px-2024_Mercedes-AMG_GT_63_S_E_Performance%2C_front_9.3.23.jpg" },
  { id: 2, name: "S-Class Maybach", year: "2025", hp: "550", speed: "4.4s", tag: "The Pinnacle of Luxury", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/2021_Mercedes-Maybach_S580_%28Z223%29%2C_front_10.14.21.jpg/1280px-2021_Mercedes-Maybach_S580_%28Z223%29%2C_front_10.14.21.jpg" },
  { id: 3, name: "EQS 580 AMG", year: "2025", hp: "751", speed: "3.4s", tag: "Electric Prestige", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/2022_Mercedes-AMG_EQS_53_4MATIC%2B%2C_front_10.22.22.jpg/1280px-2022_Mercedes-AMG_EQS_53_4MATIC%2B%2C_front_10.22.22.jpg" },
];

// ─── CUSTOM CURSOR ───────────────────────────────────────────────────────────

function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const trailX = useSpring(cursorX, { stiffness: 60, damping: 18 });
  const trailY = useSpring(cursorY, { stiffness: 60, damping: 18 });
  const glowX = useSpring(cursorX, { stiffness: 30, damping: 14 });
  const glowY = useSpring(cursorY, { stiffness: 30, damping: 14 });
  const [isHovering, setIsHovering] = useState(false);
  const [particles, setParticles] = useState([]);
  const particleId = useRef(0);

  useEffect(() => {
    const move = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      particleId.current += 1;
      const id = particleId.current;
      setParticles((prev) => [
        ...prev.slice(-18),
        { id, x: e.clientX, y: e.clientY, ts: Date.now() },
      ]);
    };
    const over = (e) => {
      if (e.target.closest("button,a,[data-hover]")) setIsHovering(true);
    };
    const out = () => setIsHovering(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout", out);
    };
  }, [cursorX, cursorY]);

  useEffect(() => {
    const id = setInterval(() => {
      setParticles((p) => p.filter((pt) => Date.now() - pt.ts < 600));
    }, 100);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {particles.map((p, i) => {
        const age = (Date.now() - p.ts) / 600;
        const opacity = Math.max(0, (1 - age) * 0.4);
        const size = Math.max(2, 8 * (1 - age));
        return (
          <div
            key={p.id}
            style={{
              position: "fixed",
              left: p.x - size / 2,
              top: p.y - size / 2,
              width: size,
              height: size,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(59,130,246,${opacity * 1.5}), rgba(99,179,237,${opacity * 0.5}))`,
              pointerEvents: "none",
              zIndex: 9998,
              boxShadow: `0 0 ${size * 2}px rgba(59,130,246,${opacity})`,
            }}
          />
        );
      })}
      <motion.div
        style={{
          position: "fixed",
          left: glowX,
          top: glowY,
          x: "-50%",
          y: "-50%",
          width: isHovering ? 60 : 40,
          height: isHovering ? 60 : 40,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%)",
          border: "1px solid rgba(59,130,246,0.3)",
          pointerEvents: "none",
          zIndex: 9999,
        }}
        animate={{ scale: isHovering ? 1.4 : 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        style={{
          position: "fixed",
          left: trailX,
          top: trailY,
          x: "-50%",
          y: "-50%",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#3b82f6",
          pointerEvents: "none",
          zIndex: 10000,
          boxShadow: "0 0 12px 4px rgba(59,130,246,0.8)",
        }}
      />
    </>
  );
}

// ─── NOISE OVERLAY ───────────────────────────────────────────────────────────

function NoiseOverlay() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

// ─── WATERMARK ───────────────────────────────────────────────────────────────

function Watermark() {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%) rotate(-35deg)",
        zIndex: 50,
        pointerEvents: "none",
        opacity: 0.5,
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "clamp(2.5rem, 6vw, 5rem)",
        fontWeight: 900,
        letterSpacing: "0.25em",
        color: "#e2e8f0",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        userSelect: "none",
        textShadow: "0 0 60px rgba(59,130,246,0.25)",
      }}
    >
      OMAR ALKISWANI
    </div>
  );
}

// ─── 3D CAR CARD ──────────────────────────────────────────────────────────────

function CarCard({ model, brand, index }) {
  const cardRef = useRef(null);
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width;
    const cy = (e.clientY - rect.top) / rect.height;
    setRot({ x: (cy - 0.5) * -20, y: (cx - 0.5) * 20 });
    setGlowPos({ x: cx * 100, y: cy * 100 });
  };

  const isBMW = brand === "BMW";
  const accentColor = isBMW ? "#3b82f6" : "#60a5fa";

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setRot({ x: 0, y: 0 }); }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      animate={{
        rotateX: rot.x,
        rotateY: rot.y,
        scale: hovered ? 1.03 : 1,
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
        cursor: "none",
        position: "relative",
        borderRadius: "1.5rem",
        overflow: "hidden",
        background: "linear-gradient(135deg, rgba(10,10,20,0.95) 0%, rgba(5,5,15,0.98) 100%)",
        border: `1px solid ${hovered ? accentColor + "60" : "rgba(255,255,255,0.07)"}`,
        boxShadow: hovered
          ? `0 0 40px ${accentColor}30, 0 25px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)`
          : "0 10px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
    >
      {/* Glow follow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "1.5rem",
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, ${accentColor}18 0%, transparent 60%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Car image area */}
      <div
        style={{
          position: "relative",
          height: 220,
          overflow: "hidden",
          background: `linear-gradient(135deg, #05050f 0%, #0a0a1a 100%)`,
        }}
      >
        {/* Grid overlay */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.06, zIndex: 1 }}>
          <defs>
            <pattern id={`grid-${model.id}-${brand}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={accentColor} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${model.id}-${brand})`} />
        </svg>

        {/* Actual car image with parallax */}
        <motion.img
          src={model.img}
          alt={model.name}
          animate={{
            scale: hovered ? 1.08 : 1.02,
            x: rot.y * 3,
            y: rot.x * 1.5,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            opacity: 0.9,
            zIndex: 0,
          }}
        />

        {/* Gradient overlay bottom */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60%",
          background: `linear-gradient(to top, rgba(5,5,15,0.95) 0%, rgba(5,5,15,0.4) 60%, transparent 100%)`,
          zIndex: 2,
        }} />

        {/* Side vignette */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(3,3,8,0.6) 100%)`,
          zIndex: 2,
        }} />

        {/* Brand badge top-left */}
        <div style={{
          position: "absolute",
          top: 14,
          left: 14,
          zIndex: 3,
          background: "rgba(3,3,8,0.75)",
          border: `1px solid ${accentColor}40`,
          borderRadius: "0.5rem",
          padding: "0.3rem 0.7rem",
          backdropFilter: "blur(8px)",
        }}>
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "0.8rem",
            fontWeight: 900,
            color: accentColor,
            letterSpacing: "0.1em",
          }}>
            {brand}
          </span>
        </div>

        {/* Glow dot */}
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.3, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{
            position: "absolute",
            bottom: 14,
            right: 14,
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: accentColor,
            boxShadow: `0 0 10px ${accentColor}`,
            zIndex: 3,
          }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: "1.5rem", position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
          <div>
            <p style={{ fontFamily: "monospace", fontSize: "0.65rem", color: accentColor, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>
              {model.year} · {brand}
            </p>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", fontWeight: 700, color: "#f1f5f9", lineHeight: 1.1 }}>
              {model.name}
            </h3>
          </div>
          <motion.div
            animate={{ rotate: hovered ? 45 : 0 }}
            style={{ color: accentColor, opacity: 0.7, marginTop: 4 }}
          >
            <ArrowRight size={20} />
          </motion.div>
        </div>

        <p style={{ fontSize: "0.78rem", color: "#64748b", fontStyle: "italic", marginBottom: "1.25rem", fontFamily: "Georgia, serif" }}>
          "{model.tag}"
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
          {[
            { icon: <Zap size={12} />, val: model.hp, label: "HP" },
            { icon: <Gauge size={12} />, val: model.speed, label: "0-60" },
            { icon: <Star size={12} />, val: "S+", label: "TIER" },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "0.75rem",
                padding: "0.6rem 0.5rem",
                textAlign: "center",
              }}
            >
              <div style={{ color: accentColor, marginBottom: 3, display: "flex", justifyContent: "center" }}>{stat.icon}</div>
              <div style={{ fontFamily: "monospace", fontSize: "0.85rem", fontWeight: 700, color: "#e2e8f0" }}>{stat.val}</div>
              <div style={{ fontSize: "0.55rem", color: "#475569", letterSpacing: "0.12em", marginTop: 1 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <motion.button
          data-hover
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            marginTop: "1.25rem",
            width: "100%",
            padding: "0.75rem",
            background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)`,
            border: `1px solid ${accentColor}50`,
            borderRadius: "0.75rem",
            color: accentColor,
            fontFamily: "monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            cursor: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          <Play size={12} fill="currentColor" />
          Configure
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── SECTION HEADER ──────────────────────────────────────────────────────────

function SectionHeader({ brand, sub, index }) {
  const isBMW = brand === "BMW";
  return (
    <motion.div
      initial={{ opacity: 0, x: isBMW ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{ marginBottom: "3rem" }}
    >
      <p style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "#3b82f6", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
        ── {String(index).padStart(2, "0")} / 02 ──
      </p>
      <h2 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "clamp(3rem, 8vw, 7rem)",
        fontWeight: 900,
        lineHeight: 0.9,
        letterSpacing: "-0.03em",
        color: "transparent",
        WebkitTextStroke: "1px rgba(255,255,255,0.15)",
        position: "relative",
      }}>
        {brand}
        <span style={{
          position: "absolute",
          left: 0,
          top: 0,
          color: "#f1f5f9",
          WebkitTextStroke: "0px",
          clipPath: "inset(0 60% 0 0)",
          transition: "clip-path 1s ease",
        }}>
          {brand}
        </span>
      </h2>
      <p style={{ marginTop: "1rem", color: "#64748b", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1rem", maxWidth: 400 }}>
        {sub}
      </p>
    </motion.div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero({ onScroll }) {
  return (
    <section style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      padding: "2rem",
    }}>
      {/* Background geometry */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <svg style={{ width: "100%", height: "100%", opacity: 0.04 }} viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
          </defs>
          {[...Array(8)].map((_, i) => (
            <circle key={i} cx={600} cy={400} r={80 + i * 70} fill="none" stroke="#3b82f6" strokeWidth="0.5" />
          ))}
          <line x1="0" y1="400" x2="1200" y2="400" stroke="#3b82f6" strokeWidth="0.5" />
          <line x1="600" y1="0" x2="600" y2="800" stroke="#3b82f6" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Glowing orb */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: "40vw",
          height: "40vw",
          maxWidth: 600,
          maxHeight: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 900 }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "#3b82f6", letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: "2rem" }}
        >
          ◆ Luxury Automotive Experience ◆
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(3.5rem, 10vw, 9rem)",
            fontWeight: 900,
            lineHeight: 0.88,
            letterSpacing: "-0.04em",
            color: "#f8fafc",
            marginBottom: "2rem",
          }}
        >
          DRIVE THE
          <br />
          <span style={{
            color: "transparent",
            WebkitTextStroke: "2px #3b82f6",
            filter: "drop-shadow(0 0 30px rgba(59,130,246,0.6))",
          }}>
            FUTURE
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          style={{ color: "#64748b", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "clamp(0.95rem, 2vw, 1.2rem)", maxWidth: 500, margin: "0 auto 3rem" }}
        >
          Where old money elegance meets the raw power of tomorrow's engineering.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
        >
          <motion.button
            data-hover
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59,130,246,0.5)" }}
            whileTap={{ scale: 0.97 }}
            onClick={onScroll}
            style={{
              padding: "0.9rem 2.5rem",
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              border: "none",
              borderRadius: "100px",
              color: "#fff",
              fontFamily: "monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: "none",
              boxShadow: "0 0 20px rgba(59,130,246,0.3)",
            }}
          >
            Explore Collection
          </motion.button>
          <motion.button
            data-hover
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "0.9rem 2.5rem",
              background: "transparent",
              border: "1px solid rgba(59,130,246,0.4)",
              borderRadius: "100px",
              color: "#94a3b8",
              fontFamily: "monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: "none",
            }}
          >
            Watch Film
          </motion.button>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        style={{ position: "absolute", bottom: "3rem", color: "#3b82f6", cursor: "none" }}
        onClick={onScroll}
        data-hover
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "1.25rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        background: scrolled ? "rgba(3,3,8,0.85)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(59,130,246,0.1)" : "none",
        transition: "background 0.4s, border 0.4s",
      }}
    >
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.3rem", fontWeight: 700, color: "#f1f5f9", letterSpacing: "0.05em" }}>
        KISWANI<span style={{ color: "#3b82f6" }}>.</span>MOTOR
      </div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        {["BMW", "Mercedes", "About", "Contact"].map((item) => (
          <a
            key={item}
            data-hover
            href="#"
            style={{
              fontFamily: "monospace",
              fontSize: "0.65rem",
              color: "#64748b",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              textDecoration: "none",
              cursor: "none",
              display: "none",
            }}
            className="desktop-nav-link"
          >
            {item}
          </a>
        ))}
        <motion.div
          whileHover={{ color: "#3b82f6" }}
          style={{ color: "#64748b", cursor: "none" }}
          data-hover
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.div>
      </div>
    </motion.nav>
  );
}

// ─── STATS BAR ───────────────────────────────────────────────────────────────

function StatsBar() {
  const stats = [
    { val: "200+", label: "Models Available" },
    { val: "15", label: "Years Experience" },
    { val: "98%", label: "Client Satisfaction" },
    { val: "∞", label: "Drive Pleasure" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "1px",
        background: "rgba(59,130,246,0.1)",
        border: "1px solid rgba(59,130,246,0.1)",
        borderRadius: "1rem",
        overflow: "hidden",
        margin: "4rem 0",
      }}
    >
      {stats.map((s, i) => (
        <div
          key={i}
          style={{
            padding: "2rem",
            background: "rgba(3,3,8,0.9)",
            textAlign: "center",
          }}
        >
          <div style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 900,
            color: "#3b82f6",
            filter: "drop-shadow(0 0 10px rgba(59,130,246,0.5))",
            lineHeight: 1,
          }}>
            {s.val}
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "#475569", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "0.5rem" }}>
            {s.label}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

// ─── DIVIDER ─────────────────────────────────────────────────────────────────

function Divider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", margin: "1.5rem 0" }}>
      <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(59,130,246,0.3))" }} />
      <span style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "#3b82f6", letterSpacing: "0.25em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, rgba(59,130,246,0.3))" }} />
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const showroomRef = useRef(null);

  const scrollToShowroom = useCallback(() => {
    showroomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div style={{
      background: "#030308",
      minHeight: "100vh",
      color: "#f1f5f9",
      cursor: "none",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #030308; cursor: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #030308; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #1d4ed8, #3b82f6); border-radius: 2px; }
        @media (min-width: 768px) {
          .desktop-nav-link { display: block !important; }
          .cards-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
      `}</style>

      <CustomCursor />
      <NoiseOverlay />
      <Watermark />
      <Nav />

      <Hero onScroll={scrollToShowroom} />

      <main ref={showroomRef} style={{ maxWidth: 1400, margin: "0 auto", padding: "0 1.5rem 8rem" }}>

        <StatsBar />

        {/* BMW Section */}
        <section style={{ marginBottom: "7rem" }}>
          <SectionHeader
            brand="BMW"
            sub="Bavarian precision engineering — where performance becomes an art form."
            index={1}
          />
          <Divider label="Bavarian Excellence" />
          <div
            className="cards-grid"
            style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}
          >
            {BMW_MODELS.map((model, i) => (
              <CarCard key={model.id} model={model} brand="BMW" index={i} />
            ))}
          </div>
        </section>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          style={{
            height: "1px",
            background: "linear-gradient(to right, transparent, #3b82f6, transparent)",
            margin: "4rem 0",
          }}
        />

        {/* Mercedes Section */}
        <section>
          <SectionHeader
            brand="MERCEDES"
            sub="Stuttgart's finest — where German luxury transcends expectation."
            index={2}
          />
          <Divider label="Stuttgart Mastery" />
          <div
            className="cards-grid"
            style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}
          >
            {MERC_MODELS.map((model, i) => (
              <CarCard key={model.id} model={model} brand="MERCEDES" index={i} />
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(59,130,246,0.1)",
        padding: "3rem 2rem",
        textAlign: "center",
      }}>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "0.5rem" }}>
          KISWANI<span style={{ color: "#3b82f6" }}>.</span>MOTOR
        </div>
        <p style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "#334155", letterSpacing: "0.2em", textTransform: "uppercase" }}>
          © 2025 · Crafted with Precision · All Rights Reserved
        </p>
      </footer>
    </div>
  );
}
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
