import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Trophy, Users, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-neutral-950">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            Build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Future</span> with Us
          </h1>
          <p className="mt-4 text-xl text-neutral-400 max-w-2xl mx-auto mb-10">
            Join the Advanced Tech Club to master coding, compete in global hackathons, and connect with the next generation of innovators.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8">
                Join the Club <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/events">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white">
                Explore Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Code className="h-10 w-10 text-indigo-500" />}
              title="Hands-on Workshops"
              description="Learn by doing. From AI/ML to Blockchain, we host weekly workshops led by industry experts and senior students."
            />
            <FeatureCard
              icon={<Trophy className="h-10 w-10 text-purple-500" />}
              title="CTFs & Competitions"
              description="Test your skills in our custom-built CTF platform. Solve challenges, earn points, and climb the leaderboard."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-pink-500" />}
              title="Vibrant Community"
              description="Connect with like-minded peers. Collaborate on projects, share knowledge, and grow together."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-neutral-950 border-t border-neutral-800">
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

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-indigo-500/50 transition-colors duration-300">
      <div className="mb-4 p-3 bg-neutral-900 rounded-lg w-fit">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-neutral-400">{description}</p>
    </div>
  );
}
