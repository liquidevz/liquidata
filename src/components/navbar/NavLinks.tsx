import React from "react";
import { NavLink } from "./NavLink";

export const NavLinks = () => {
  return (
    <ul className="flex gap-3 text-zinc-400 md:gap-9">
      <li>
        <NavLink href="/case-studies">Case Studies</NavLink>
      </li>
      <li>
        <NavLink href="/blog">Blog</NavLink>
      </li>
      <li>
        <NavLink href="/#features">Features</NavLink>
      </li>
      <li>
        <NavLink href="/#pricing">Pricing</NavLink>
      </li>
      <li>
        <NavLink href="/contact">Contact</NavLink>
      </li>
    </ul>
  );
};
