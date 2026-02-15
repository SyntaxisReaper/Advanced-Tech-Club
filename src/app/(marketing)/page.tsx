import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Trophy, Users } from "lucide-react";
import { HeroButtons } from "@/components/marketing/HeroButtons";
import { MotionFeatureCard } from "@/components/marketing/MotionFeatureCard";
import { HeroGlobe } from "@/components/marketing/HeroGlobe";
import { Leaderboard } from "@/components/marketing/Leaderboard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">


      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
                Build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D4EDD] to-[#5A189A]">Future</span> with Us
              </h1>
              <p className="mt-4 text-xl text-neutral-400 mb-10 mx-auto lg:mx-0 max-w-2xl">
                Join the Advanced Tech Club to master coding, compete in global hackathons, and connect with the next generation of innovators.
              </p>
              <HeroButtons />
            </div>

            {/* Right Visuals */}
            <div className="relative z-10 flex justify-center lg:justify-end w-full h-[600px] lg:h-auto items-center">
              <HeroGlobe />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <MotionFeatureCard
              icon={<Code className="h-10 w-10 text-[#9D4EDD]" />}
              title="Hands-on Workshops"
              description="Learn by doing. From AI/ML to Blockchain, we host weekly workshops led by industry experts and senior students."
              index={0}
            />
            <MotionFeatureCard
              icon={<Trophy className="h-10 w-10 text-[#5A189A]" />}
              title="CTFs & Competitions"
              description="Test your skills in our custom-built CTF platform. Solve challenges, earn points, and climb the leaderboard."
              index={1}
            />
            <MotionFeatureCard
              icon={<Users className="h-10 w-10 text-pink-500" />} // Pink keeps some variety or switch to accent? Let's keep one distinct color or maybe just white/violet
              title="Vibrant Community"
              description="Connect with like-minded peers. Collaborate on projects, share knowledge, and grow together."
              index={2}
            />
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="py-20 bg-neutral-900/30">
        <Leaderboard />
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to level up?</h2>
          <p className="text-neutral-400 mb-8 max-w-2xl mx-auto">
            Whether you're a complete beginner or a seasoned pro, there's a place for you here. Start your journey today.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-black hover:bg-neutral-200 font-bold px-8 rounded-full">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}


