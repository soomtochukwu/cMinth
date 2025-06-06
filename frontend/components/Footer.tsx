import React from "react";
import { AnimatedBackground } from "./animated-background";

const Footer = () => {
  return (
    <div
      className="flex flex-row items-center justify-between p-6 h-40  text-white backdrop-blur-sm"
      style={{ zIndex: 1000, position: "relative" }}
    >
      <div>Mazi</div>
      <div>Lansa</div>
      <div>Robert</div>
      <div>Ruth</div>
      <div key={0.010101010101}>Judith</div>
    </div>
  );
};

export default Footer;
