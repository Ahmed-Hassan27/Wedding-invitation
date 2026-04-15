import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Heart, Music, VolumeX} from 'lucide-react';

// --- 1. مكون بتلات الورد المتساقطة (🌸 Petals) ---
const FloatingPetals = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[5]">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: -100 }}
          animate={{ 
            opacity: [0, 0.6, 0], 
            y: [0, window.innerHeight + 200], 
            // توزيع عشوائي للورد على عرض الشاشة بالكامل
            x: [Math.random() * window.innerWidth, (Math.random() - 0.5) * 300],
            rotate: 360 
          }}
          transition={{ 
            duration: 10 + Math.random() * 10, 
            repeat: Infinity, 
            delay: Math.random() * 10,
            ease: "linear"
          }}
          className="absolute text-pink-200/40 text-2xl"
        >
          🌸
        </motion.div>
      ))}
    </div>
  );
};

const CountdownTimer = ({ isArabic }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date("2026-05-15T20:30:00");
    const interval = setInterval(() => {
      const now = new Date();
      const difference = target - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const labels = isArabic 
    ? { days: "أيام", hours: "ساعات", minutes: "دقائق", seconds: "ثواني" }
    : { days: "DAYS", hours: "HOURS", minutes: "MINS", seconds: "SECS" };

  return (
    <div className="flex justify-center gap-4 my-12">
      {Object.entries(timeLeft).map(([unit, value], i) => (
        <div key={i} className="flex flex-col items-center">
          <span className="text-3xl font-light text-[#B08D57] font-serif">{value.toString().padStart(2, '0')}</span>
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-sans">{labels[unit]}</span>
        </div>
      ))}
    </div>
  );
};

export default function WeddingInvitation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isArabic, setIsArabic] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  
  const handleOpen = () => {
    setIsOpen(true);
    if (audioRef.current) {
        audioRef.current.play().catch(() => console.log("Music play blocked"));
        setIsPlaying(true);
    }
  };

  const toggleMusic = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={`relative min-h-screen bg-[#FDFBF9] text-[#5A4B41] font-serif overflow-x-hidden ${isArabic ? 'text-right' : 'text-center'}`}>
      
      <audio ref={audioRef} src="/music.mp3" loop />

      {/* ✅ 2. أزرار التحكم - تتحرك يمين وشمال حسب اللغة بنعومة */}
      <motion.div 
        layout // يضمن حركة ناعمة عند تغيير الموقع
        initial={false}
        animate={{ 
          // لو عربي تروح للشمال، لو إنجليزي تروح لليمين
          left: isArabic ? "20px" : "auto", 
          right: isArabic ? "auto" : "20px" 
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="fixed top-5 z-[100] flex flex-col gap-3"
      >
        <button onClick={toggleMusic} className="bg-white/90 p-3 rounded-full shadow-md text-[#B08D57] hover:bg-white transition-all">
          {isPlaying ? <Music size={18} className="animate-pulse" /> : <VolumeX size={18} />}
        </button>
        <button onClick={() => setIsArabic(!isArabic)} className="bg-white/90 p-3 rounded-full shadow-md text-[#B08D57] font-bold text-[10px] font-sans">
          {isArabic ? "EN" : "AR"}
        </button>
      </motion.div>

      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
            onClick={handleOpen}
            className="fixed inset-0 z-50 bg-[#FDFBF9] flex flex-col items-center justify-center cursor-pointer overflow-hidden text-center"
          >
            <div className="absolute inset-10 border border-[#D4AF37]/20 pointer-events-none" />
            <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-[#D4AF37]/30 m-4" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-[#D4AF37]/30 m-4" />

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 2 }}>
              <h1 className="text-8xl font-light tracking-tighter text-[#5A4B41]">
                M <span className="text-[#D4AF37] font-serif">&</span> S
              </h1>
              <motion.p animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="mt-16 text-[10px] tracking-[0.5em] text-[#D4AF37] uppercase font-sans">
                {isArabic ? "اضغط للفتح" : "Click to Open"}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* إضافة الورد هنا ليظهر بعد الفتح فقط */}
      {isOpen && <FloatingPetals />}

      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="relative max-w-lg mx-auto pt-24 pb-32 px-8 text-center"
      >
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="text-[10px] tracking-[0.6em] uppercase text-gray-400 mb-12 font-sans text-center w-full">
            {isArabic ? "فرحة محمود وسلمى" : "The Wedding of"}
          </p>
          
          <h2 className="text-6xl font-light mb-4 text-[#5A4B41]">{isArabic ? "محمود" : "Mahmoud"}</h2>
          <div className="flex items-center justify-center gap-4 my-6">
            <div className="h-[1px] w-12 bg-[#D4AF37]/40" />
            <Heart size={18} className="text-[#D4AF37]" fill="#D4AF37" />
            <div className="h-[1px] w-12 bg-[#D4AF37]/40" />
          </div>
          <h2 className="text-6xl font-light text-[#5A4B41]">{isArabic ? "سلمى" : "Salma"}</h2>

          <div className="mt-16 space-y-6 text-base text-gray-600 leading-loose">
            <p className="italic font-serif">
              {isArabic 
                ? "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً"
                : "And of His signs is that He created for you from yourselves mates that you may find tranquility in them"}
            </p>
          </div>

          <div className="mt-20">
            <div className="flex justify-center gap-10 items-center mb-8">
              <div className={isArabic ? 'text-right' : 'text-left'}>
                <p className="text-xl font-bold">{isArabic ? "الجمعة" : "FRIDAY"}</p>
                <p className="text-[12px] text-gray-400 font-sans">{isArabic ? "١٥ مايو ٢٠٢٦" : "MAY 15, 2026"}</p>
              </div>
              <div className="text-6xl font-light text-[#D4AF37] font-serif">15</div>
              <div className={isArabic ? 'text-left' : 'text-right'}>
                <p className="text-xl font-bold">{isArabic ? "٨:٣٠ مساءً" : "8:30 PM"}</p>
                <p className="text-[12px] text-gray-400 font-sans">{isArabic ? "المساء" : "EVENING"}</p>
              </div>
            </div>
            <CountdownTimer isArabic={isArabic} />
          </div>

          <div className="mt-32 p-8 border border-[#D4AF37]/20 rounded-t-full">
            <MapPin size={24} className="mx-auto mb-4 text-[#D4AF37]" strokeWidth={1} />
            <h3 className="text-xl font-bold mb-1">{isArabic ? "قاعة الفتح - المشير" : "Al-Fath Hall"}</h3>
            <p className="text-xs text-gray-400 mb-8 italic">{isArabic ? "التجمع الخامس، القاهرة" : "New Cairo, Egypt"}</p>
            <a
                href="https://maps.app.goo.gl/Cfzd3MiFqsrCkbnZ8?g_st=aw" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#5A4B41] text-white px-10 py-3 rounded-full text-[10px] tracking-widest shadow-xl hover:bg-[#D4AF37] transition-colors font-sans"
            >
              {isArabic ? "موقع القاعة" : "VIEW LOCATION"}
            </a>
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}