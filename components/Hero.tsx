import Button from "@/components/ui/Button";
import { heroBg } from "@/utils";

const Hero = () => {
  return (
    <section
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center text-right"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Shared background overlay for depth */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Hero Text Section */}
      <div className="relative z-10  -mr-40 max-w-2xl text-right px-6 mt-24 md:mt-40  md:mr-20">
        <h1 className="text-xl md:text-3xl font-semibold text-white drop-shadow-lg">
          ALL YOU NEED IS HERE
        </h1>

        <h2 className="mt-3 -mr-70 text-9xl md:text-9xl font-extrabold text-white leading-tight tracking-tight">
          MASHABESHA DESIGN
        </h2>

        <h2 className="mt-3 -mr-130 text-6xl md:text-4xl font-extrabold text-white leading-tight tracking-tight">
          Discover unique Ethiopian traditional clothing designed for every
          occasion — weddings, holidays, festivals, and more.
        </h2>

        <div className="mt-8 flex justify-end">
          <Button className="bg-zinc-950 border-zinc-600 text-white px-8 py-3 text-lg rounded-xl hover:[transform:translateY(-.335rem)] hover:shadow-xl transition">
            Shop Now <span className="text-slate-300/85 ml-2">─ explore</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
