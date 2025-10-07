// components/Slider.jsx
import { useRef, useEffect, useState } from "react";
import { IoExpand } from "react-icons/io5";

const sliderData = [
  { tekst: "Veliki set tegova", slika: "slika3" },
  { tekst: "Set tegova za precizna merenja", slika: "004" },
  { tekst: "Kamionske vage", slika: "spojena12134543" },
  { tekst: "Mesoreznica", slika: "probamesoreznica41544" },
  { tekst: "Precizna vaga", slika: "preciznavaga123" },
  { tekst: "Proizvodi u ponudi", slika: "slicka" },
  { tekst: "Stočna vaga", slika: "stocarskavaga" },
  { tekst: "Platformska vaga", slika: "home/platformskavaga" },
  { tekst: "Paletna vaga", slika: "home/paletarka1" },
  { tekst: "Paletna vaga", slika: "home/paletarka2" },
  { tekst: "Kamionska vaga", slika: "home/kamionskavaga1" },
  { tekst: "Mehanička vaga", slika: "home/mehanickavaga1" },
];
const trackImages = [...sliderData, ...sliderData];

function Spinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-300 rounded-full animate-spin animate-reverse"></div>
      </div>
    </div>
  );
}

export default function Slider({ onImageClick }) {
  const containerRef = useRef();
  const [loaded, setLoaded] = useState(Array(trackImages.length).fill(false));
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const container = containerRef.current;
    let frame;
    let speed = 0.9;
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

  const handleImgLoad = (idx) =>
    setLoaded((state) => {
      const newState = [...state];
      newState[idx] = true;
      return newState;
    });

  return (
    <div
      className="relative select-none overflow-x-hidden mt-4 mb-6 mx-auto w-full h-[clamp(18rem,28vw,26rem)] max-w-[1920px]"
      ref={containerRef}
    >
      <div
        className="flex items-center h-full"
        style={{ minWidth: "max-content" }}
      >
        {trackImages.map((item, idx) => (
          <div
            key={idx}
            className="
              relative flex-shrink-0 mx-3 group
              w-72 h-full
              sm:w-96 md:w-[28rem] lg:w-[32rem] xl:w-[36rem]
              rounded-2xl overflow-hidden shadow-lg bg-gray-100
              cursor-pointer transition-all duration-300
            "
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() =>
              onImageClick({
                src: `/imgs/${item.slika}.jpg`,
                text: item.tekst,
              })
            }
          >
            {!loaded[idx] && (
              <>
                <Spinner />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white/70 to-blue-50 animate-pulse blur-lg z-0" />
              </>
            )}
            <img
              src={`/imgs/${item.slika}.jpg`}
              alt={item.tekst}
              draggable={false}
              onLoad={() => handleImgLoad(idx)}
              loading="lazy"
              className={`
                w-full h-full object-cover transition-all duration-500
                ${
                  hoveredIndex === idx
                    ? "scale-110 brightness-110 contrast-105"
                    : "scale-100 brightness-100 contrast-100"
                }
                ${!loaded[idx] ? "blur-md opacity-70" : "opacity-100"}
              `}
            />
            {/* Expand Icon */}
            <div
              className={`
                absolute top-4 right-4 z-20
                bg-white/90 backdrop-blur-md rounded-full p-2
                shadow-lg transition-all duration-300
                ${
                  hoveredIndex === idx
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-50 translate-y-2"
                }
              `}
            >
              <IoExpand className="w-5 h-5 text-gray-700" />
            </div>
            <div
              className={`
                absolute left-1/2 -translate-x-1/2
                backdrop-blur-md px-5 py-2 rounded-full shadow-lg
                font-semibold text-center max-w-[95%] z-10
                text-xs sm:text-base md:text-lg
                transition-all duration-500 ease-out
                ${
                  hoveredIndex === idx
                    ? "bottom-8 bg-blue-600 text-white scale-110 shadow-2xl"
                    : "bottom-5 bg-white/90 text-blue-600 scale-100 shadow-lg"
                }
              `}
            >
              {item.tekst}
            </div>
            <div
              className={`
                absolute inset-0 pointer-events-none transition-all duration-500
                ${
                  hoveredIndex === idx
                    ? "bg-gradient-to-t from-blue-900/30 via-blue-600/10 to-transparent"
                    : "bg-gradient-to-t from-black/20 via-transparent to-transparent"
                }
              `}
            />
            <div
              className={`
                absolute inset-0 rounded-2xl pointer-events-none transition-all duration-500
                ${
                  hoveredIndex === idx
                    ? "ring-4 ring-blue-400/50 ring-offset-2 ring-offset-transparent shadow-2xl shadow-blue-500/25"
                    : ""
                }
              `}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
