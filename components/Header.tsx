"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import MenuOverlay from "./MenuOverlay";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Navbar onOpenMenu={() => setIsMenuOpen(true)} />
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
