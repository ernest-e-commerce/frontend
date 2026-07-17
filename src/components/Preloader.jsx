import React from "react";

// Minimal CSS loader (equalizer bars — see `.loader` in index.css).
const Preloader = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
      <div className="loader" role="status" aria-label="Loading">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
};

export default Preloader;
