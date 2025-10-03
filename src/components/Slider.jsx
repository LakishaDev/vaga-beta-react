import React, { useRef, useEffect, useState } from "react";

const sliderData = [
  { tekst: "Veliki set tegova", slika: "slika3" },
  { tekst: "Set tegova za precizna merenja", slika: "004" },
  { tekst: "Kamionske vage", slika: "spojena12134543" },
  { tekst: "Mesoreznica", slika: "probamesoreznica41544" },
  { tekst: "Precizna vaga", slika: "preciznavaga123" },
  { tekst: "Proizvodi u ponudi", slika: "slicka" },
  { tekst: "Stocna vaga", slika: "stocarskavaga" }
];
const trackImages = [...sliderData, ...sliderData];

function Spinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg className="animate-spin h-10 w-10 text-blue-500" viewBox="0 0 24 24">
        <circle className="opacity-40" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-85" fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
    </div>
  );
}

export default function Slider() {
  const containerRef = useRef();
  const [loaded, setLoaded] = useState(Array(trackImages.length).fill(false));

  useEffect(() => {
    const container = containerRef.current;
    let frame;
    let speed = 0.5;
    function animate() {
      if (!container) return;
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += speed;
      }
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleImgLoad = idx =>
    setLoaded(state => {
      const newState = [...state];
      newState[idx] = true;
      return newState;
    });

  return (
    <div
      className="infinite-scroll-container mt-7 mb-1 max-w-full mx-auto"
      style={{ height: "13rem", position: "relative" }}
      ref={containerRef}
    >
      <div className="infinite-scroll-track" style={{ height: "100%" }}>
        {trackImages.map((item, idx) => (
          <div
            key={idx}
            className="relative flex-shrink-0 w-72 h-48 rounded-xl overflow-hidden shadow-lg bg-gray-100 group"
            style={{ minWidth: "18rem" }}
          >
            {/* Loader */}
            {!loaded[idx] && (
              <>
                <Spinner />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 animate-pulse rounded-xl blur-md" />
              </>
            )}
            <img
              src={`/imgs/${item.slika}.jpg`}
              alt={item.tekst}
              className={`w-full h-full object-cover transition group-hover:scale-105 ${!loaded[idx] ? "blur-lg" : ""}`}
              draggable={false}
              onLoad={() => handleImgLoad(idx)}
              loading="lazy"
            />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/80 px-4 py-1 rounded-full shadow text-blue-700 font-semibold text-base group-hover:bg-blue-500 group-hover:text-white transition w-max">
              {item.tekst}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
