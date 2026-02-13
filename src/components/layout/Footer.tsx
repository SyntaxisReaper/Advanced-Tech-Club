import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-transparent border-t border-neutral-800/50 relative z-10 backdrop-blur-[2px]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                            Advanced Tech Club
                        </Link>
                        <p className="mt-4 text-neutral-400 max-w-sm">
                            Empowering students to build the future through code, competitions, and collaboration. Join us to level up your skills.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-neutral-200 tracking-wider uppercase">Platform</h3>
                        <ul className="mt-4 space-y-3">
                            <li>
                                <Link href="/events" className="text-neutral-400 hover:text-indigo-400 transition-colors">
                                    Events
                                </Link>
                            </li>
                            <li>
                                <Link href="/competitions" className="text-neutral-400 hover:text-indigo-400 transition-colors">
                                    Competitions
                                </Link>
                            </li>
                            <li>
                                <Link href="/leaderboard" className="text-neutral-400 hover:text-indigo-400 transition-colors">
                                    Leaderboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-neutral-200 tracking-wider uppercase">Connect</h3>
                        <div className="mt-4 flex space-x-4">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-indigo-400 transition-colors">
                                <Github className="h-6 w-6" />
                                <span className="sr-only">GitHub</span>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-indigo-400 transition-colors">
                                <Twitter className="h-6 w-6" />
                                <span className="sr-only">Twitter</span>
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-indigo-400 transition-colors">
                                <Linkedin className="h-6 w-6" />
                                <span className="sr-only">LinkedIn</span>
                            </a>
                            <a href="mailto:contact@techclub.com" className="text-neutral-400 hover:text-indigo-400 transition-colors">
                                <Mail className="h-6 w-6" />
                                <span className="sr-only">Email</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500">
                    <p>&copy; {new Date().getFullYear()} Advanced Tech Club. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="/privacy" className="hover:text-neutral-300">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-neutral-300">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
