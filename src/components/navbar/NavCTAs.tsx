import React from "react";
import { SplashButton } from "../buttons/SplashButton";
import { GhostButton } from "../buttons/GhostButton";
import { useRouter } from "next/router";

export const NavCTAs = () => {
  const router = useRouter();
  return (
    <div className="flex items-center gap-2">
      <SplashButton
        onClick={() => window.open("https://help.liquidata.dev", "_blank")}
        className="px-4 py-1 text-base text-zinc-100" 
      >
        Helpdesk
      </SplashButton>
    </div>
  );
};
