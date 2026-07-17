import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

// Transparent product/lifestyle cut-outs sit on a layered background:
// gradient -> drifting colour blobs -> dot grid -> spotlight behind the
// subject. `dark` = light background, so text/CTA switch to dark.
//
// `glow` is the spotlight/accent colour and should contrast the gradient
// rather than match it — that separation is what lifts the cut-out off
// the panel instead of letting it sink in.
//
// `blob` tints the big ambient corner wash and must stay in the gradient's
// own hue family. A contrasting `glow` works as a tight spotlight but goes
// muddy when spread over half the panel (amber on blue turns olive).
const slides = [
  {
    img: "/images/slide-shopping.png",
    eyebrow: "Deals for everyone",
    title: "Shop more,",
    titleRed: "save more",
    accent: "#ef4444",
    subtitle: "Top brands. Best prices. More value for every you.",
    cta: "Start shopping",
    href: "/products",
    // Brand blue (see the --color-blue-* remap in index.css).
    gradient: "linear-gradient(135deg, #002a4b 0%, #005fad 55%, #1174bf 100%)",
    glow: "#fbbf24",
    blob: "#38bdf8",
    dark: false,
    // This photo has extra transparent margin, so scale it up from the
    // bottom-right to make the couple read larger.
    zoom: "scale-[1.4] origin-bottom-right",
  },
  {
    img: "/images/slide-fashion.png",
    eyebrow: "Fashion & style",
    title: "Elegance for",
    titleRed: "every occasion",
    accent: "#fbbf24",
    subtitle: "New-season styles. Premium fabrics. Effortless elegance.",
    cta: "Shop fashion",
    href: "/products?category=clothing",
    zoom: "scale-[1.2] origin-bottom",
    // Jewel-toned plum: warm enough to flatter the emerald and champagne
    // gowns, which the old flat purple flattened out.
    gradient: "linear-gradient(135deg, #2e1065 0%, #701a75 50%, #9d174d 100%)",
    glow: "#fcd34d",
    blob: "#e879f9",
    dark: false,
  },
  {
    img: "/images/slide-electronics.png",
    eyebrow: "Latest tech",
    title: "Top gadgets,",
    titleRed: "best prices",
    accent: "#005fad",
    subtitle: "Latest tech. Unbeatable deals. Brands you trust.",
    cta: "Shop electronics",
    href: "/products?category=electronics",
    zoom: "scale-[1.15] origin-bottom",
    // Light background so the black devices stand out, but kept off pure
    // white at both ends — the devices need some slate to sit against.
    gradient: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 50%, #7c8ea3 100%)",
    glow: "#005fad",
    blob: "#60a5fa",
    dark: true,
  },
];

const ProductSlider = () => {
  return (
    <div className="w-full overflow-hidden rounded-2xl">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop={slides.length > 1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <div
              className="relative w-full h-56 md:h-96 overflow-hidden"
              style={{ background: s.gradient }}
            >
              {/* Drifting colour blobs — depth in the gradient itself */}
              <div
                className="hero-blob pointer-events-none absolute -left-[10%] -top-[30%] h-[130%] w-[55%] rounded-full blur-3xl"
                style={{
                  background: `radial-gradient(circle, ${s.blob}${
                    s.dark ? "40" : "59"
                  } 0%, transparent 70%)`,
                }}
              />
              {/* Light slides get a slate wash, not a white one — white on a
                  pale gradient reads as wash rather than depth. */}
              <div
                className="hero-blob pointer-events-none absolute -bottom-[40%] left-[25%] h-[120%] w-[50%] rounded-full blur-3xl"
                style={{
                  animationDelay: "-7s",
                  background: s.dark
                    ? "radial-gradient(circle, #47556933 0%, transparent 70%)"
                    : "radial-gradient(circle, #ffffff40 0%, transparent 70%)",
                }}
              />

              {/* Dot grid texture */}
              <div
                className={`hero-grid pointer-events-none absolute inset-0 ${
                  s.dark ? "text-gray-900/15" : "text-white/15"
                }`}
              />

              {/* Spotlight + ring behind the subject */}
              <div
                className="hero-glow pointer-events-none absolute -right-[6%] top-1/2 h-[135%] w-[62%] -translate-y-1/2 rounded-full blur-2xl"
                style={{
                  background: `radial-gradient(circle, ${s.glow}4d 0%, ${s.glow}1a 45%, transparent 70%)`,
                }}
              />
              <div
                className={`hero-glow pointer-events-none absolute right-[6%] top-1/2 aspect-square h-[105%] -translate-y-1/2 rounded-full border ${
                  s.dark ? "border-gray-900/10" : "border-white/20"
                }`}
              />

              {/* Text */}
              <div
                className={`relative z-10 flex h-full max-w-[52%] flex-col justify-center px-5 md:px-12 ${
                  s.dark ? "text-gray-900" : "text-white"
                }`}
              >
                <p
                  className={`hero-text text-[11px] font-semibold uppercase tracking-wider md:text-sm ${
                    s.dark ? "text-gray-600" : "text-white/80"
                  }`}
                >
                  {s.eyebrow}
                </p>
                <h2
                  className="hero-text mt-1 text-xl font-extrabold leading-[1.1] md:mt-2 md:text-5xl"
                  style={{ animationDelay: "0.1s" }}
                >
                  <span className="block">{s.title}</span>
                  {s.titleRed && (
                    <span className="block" style={{ color: s.accent }}>
                      {s.titleRed}
                    </span>
                  )}
                </h2>
                {s.subtitle && (
                  <p
                    style={{ animationDelay: "0.15s" }}
                    className={`hero-text mt-2 hidden text-sm leading-snug md:mt-4 md:block md:text-base ${
                      s.dark ? "text-gray-600" : "text-white/85"
                    }`}
                  >
                    {s.subtitle}
                  </p>
                )}
                <a
                  href={s.href}
                  style={{ animationDelay: "0.2s" }}
                  className={`hero-text mt-3 inline-flex w-fit items-center rounded-full px-4 py-2 text-sm font-semibold shadow-lg transition-transform hover:scale-105 md:mt-6 md:px-6 md:py-3 md:text-base ${
                    s.dark
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "bg-white text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {s.cta}
                </a>
              </div>

              {/* Transparent subject floats on the gradient. The wrapper owns
                  the entrance animation so it can't clobber `zoom`'s scale. */}
              <div
                className="hero-subject pointer-events-none absolute inset-y-0 right-0 w-[54%] md:right-4"
                style={{ animationDelay: "0.15s" }}
              >
                <img
                  src={s.img}
                  alt=""
                  aria-hidden="true"
                  className={`h-full w-full object-contain object-bottom drop-shadow-2xl ${
                    s.zoom || ""
                  }`}
                />
              </div>

              {/* Grounding fade so the cut-out sits in the panel */}
              <div
                className={`pointer-events-none absolute inset-x-0 bottom-0 h-1/4 ${
                  s.dark
                    ? "bg-gradient-to-t from-black/10 to-transparent"
                    : "bg-gradient-to-t from-black/25 to-transparent"
                }`}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
