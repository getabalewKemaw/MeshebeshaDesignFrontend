'use client';

const videos = [
  { id: 'IA7dIUJnOfg', title: 'Showcase 1' },
  { id: 'iZXvjDQprVM', title: 'Showcase 2' },
  { id: '654KwzJW0lg', title: 'Showcase 3' },
  { id: 'qbL9vRFqCQ4', title: 'Showcase 4' },
  { id: '0UFua0AFRfo', title: 'Showcase 5' },
  { id: 'YRSTP-g0zpA', title: 'Showcase 6' },
  { id: 'TKiSTXRwGdY', title: 'Showcase 7' },
];

export default function SocialShowcaseSection() {
  // Duplicate for infinite scroll effect
  const duplicatedVideos = [...videos, ...videos, ...videos];

  return (
    <section 
      className="w-full py-24 relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        backgroundImage: 'url("/ui/Artboard 2.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay for branding and contrast */}
      <div className="absolute inset-0 bg-[#310101]/75 backdrop-blur-[1px]"></div>

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Title Section */}
        <div className="text-center mb-16 px-4 animate-reveal-up">
          <h2
            className="text-4xl md:text-6xl font-bold uppercase tracking-[0.2em] text-white inline-block border-b-4 border-white/30 pb-4 px-12"
            style={{ fontFamily: 'Fredoka One, cursive' }}
          >
            Our Social Pulse
          </h2>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-[1px] w-12 bg-white/40"></div>
            <p className="text-white/90 text-sm md:text-lg font-medium tracking-[0.3em] uppercase" style={{ fontFamily: 'Abhaya Libre, serif' }}>
               Trendsetting • Authentic • Meshebesha 
            </p>
            <div className="h-[1px] w-12 bg-white/40"></div>
          </div>
        </div>

        {/* Infinite Marquee Slider */}
        <div className="w-full relative py-10 overflow-hidden group">
          <div 
            className="animate-social-marquee gap-8"
          >
            {duplicatedVideos.map((video, index) => (
              <div 
                key={`${video.id}-${index}`}
                className="flex-shrink-0 w-[240px] md:w-[320px] aspect-[9/16] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2 border-white/10 hover:border-white/50 transition-all duration-500 bg-black relative group/item"
              >
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&loop=1&playlist=${video.id}&controls=0&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  style={{ transform: 'scale(1.02)' }}
                ></iframe>
                
                {/* Decorative Frame Overlays */}
                <div className="absolute inset-0 pointer-events-none border-[12px] border-black/10 rounded-[2rem]"></div>
                <div className="absolute inset-0 pointer-events-none ring-1 ring-white/20 rounded-[2rem]"></div>
              </div>
            ))}
          </div>
          
          {/* Side Gradients for Smooth Fading */}
          <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[#310101] via-[#310101]/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[#310101] via-[#310101]/80 to-transparent z-10 pointer-events-none"></div>
        </div>
      </div>

      <style jsx>{`
        .bg-gradient-to-r {
            background: linear-gradient(to right, #310101 0%, rgba(49, 1, 1, 0.8) 50%, transparent 100%);
        }
        .bg-gradient-to-l {
            background: linear-gradient(to left, #310101 0%, rgba(49, 1, 1, 0.8) 50%, transparent 100%);
        }
        
        .animate-social-marquee {
          display: flex;
          width: max-content;
          animation: social-marquee 60s linear infinite;
        }

        .animate-social-marquee:hover {
          animation-play-state: paused;
        }

        @keyframes social-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
      `}</style>
    </section>
  );
}
