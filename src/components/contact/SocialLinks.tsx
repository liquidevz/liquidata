"use client";
import React from "react";
import { LinkPreview } from "@/components/ui/link-preview";

export function SocialLinks() {
  return (
    <div className="flex justify-center items-center min-h-[40rem] px-4 relative">
      {/* Decorative glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="text-gray-300 text-2xl sm:text-3xl md:text-4xl lg:text-5xl max-w-6xl text-center leading-tight tracking-tight font-medium px-4 relative z-10">
        <span className="text-white">Follow us on{" "}</span>
        <LinkPreview
          url="https://instagram.com/liquidata"
          className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-purple-600 hover:from-pink-400 hover:via-purple-400 hover:to-purple-500 transition-all duration-300"
        >
          Instagram
        </LinkPreview>{" "}
        <span className="text-white">for daily updates, connect with us on{" "}</span>
        <LinkPreview
          url="https://twitter.com/liquidata"
          className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 hover:from-cyan-300 hover:via-blue-400 hover:to-blue-500 transition-all duration-300"
        >
          Twitter
        </LinkPreview>{" "}
        <span className="text-white">for the latest news, and join our community on{" "}</span>
        <LinkPreview
          url="https://discord.gg/liquidata"
          className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600 hover:from-indigo-400 hover:via-purple-400 hover:to-purple-500 transition-all duration-300"
        >
          Discord
        </LinkPreview>{" "}
        <span className="text-white">to chat with fellow users.</span>
      </div>
    </div>
  );
}