import { useContext, useState } from "react";
import { CartContext } from "../../contexts/shop/cart/CartContext";
import { SnackbarContext } from "../../contexts/snackbar/SnackbarContext";
import { Link } from "react-router-dom";
import ProgressiveImage from "../UI/ProgressiveImage";
import { Terminal } from "lucide-react";
import { motion as Motion } from "framer-motion";

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const { showSnackbar } = useContext(SnackbarContext);
  const [isHovered, setIsHovered] = useState(false);

  // Proveri da li je cena skrivena
  const hasHiddenPrice = product.hiddenPrice && !product.price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    showSnackbar(`${product.name} je dodat u korpu!`, "success");
  };

  // Funkcija za prikaz cene - koristi price ili hiddenPrice
  const getDisplayPrice = () => {
    if (product.price) return product.price;
    if (product.hiddenPrice) return product.hiddenPrice;
    return 0;
  };

  return (
    <Link
      to={`/prodavnica/proizvod/${product.id}`}
      className="group bg-white/80 backdrop-blur rounded-2xl border shadow-xl
        transition-transform hover:scale-105 hover:shadow-2xl hover:border-bluegreen
        flex flex-col items-center py-6 px-3 sm:px-5 relative overflow-hidden min-h-[340px] sm:min-h-[410px] w-full"
      style={{
        borderColor: "#CBCFBB",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Popust badge - prikaži samo ako cena nije skrivena */}
      {!hasHiddenPrice &&
        product.originalPrice &&
        product.originalPrice > getDisplayPrice() && (
          <span
            className={`absolute top-4 left-4 sm:top-6 sm:left-7 bg-green-100 text-green-800 px-3 py-1 rounded-xl font-bold text-xs sm:text-sm shadow ${
              isHovered ? "animate-bounce" : ""
            } z-20`}
          >
            -{product.discountPercent}% POPUST
          </span>
        )}

      {/* Software Badge - gornji desni ugao */}
      {product.isSoftware && (
        <Motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.1 
          }}
          whileHover={{ 
            scale: 1.1, 
            rotate: 5,
            transition: { duration: 0.2 }
          }}
          className="absolute top-4 right-4 sm:top-6 sm:right-7 z-20"
        >
          <div 
            className="relative group cursor-pointer"
            title="Softverski proizvod"
          >
            {/* Glow efekat u pozadini */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#6EAEA2] to-[#253869] rounded-full opacity-50 blur-md group-hover:opacity-70 transition-opacity animate-pulse"></div>
            
            {/* Glavni badge sa glassmorphism */}
            <div
              className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center backdrop-blur-md border-2 shadow-lg transition-all"
              style={{
                background: "linear-gradient(135deg, rgba(110, 174, 162, 0.9) 0%, rgba(37, 56, 105, 0.8) 100%)",
                backdropFilter: "blur(10px)",
                borderColor: "rgba(255, 255, 255, 0.3)",
                boxShadow: "0 4px 20px rgba(110, 174, 162, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3)"
              }}
            >
              <Terminal 
                size={18} 
                className="text-white drop-shadow-md sm:w-5 sm:h-5" 
                strokeWidth={2.5}
              />
            </div>
            
            {/* Tooltip na hover */}
            <div className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-[#253869] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap backdrop-blur-sm border border-[#6EAEA2]/30">
                Softver
                <div className="absolute bottom-full right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-[#253869]"></div>
              </div>
            </div>
          </div>
        </Motion.div>
      )}

      {/* Badge za skrivenu cenu ili običnu cenu gore desno */}
      {hasHiddenPrice ? (
        <span className="absolute top-32 sm:top-40 right-4 sm:right-7 bg-chestnut/80 text-white px-3 sm:px-4 py-1 rounded-xl font-bold text-sm sm:text-base shadow z-10">
          Cena na upit
        </span>
      ) : (
        <span className="absolute top-32 sm:top-40 right-4 sm:right-7 bg-bluegreen text-white px-3 sm:px-4 py-1 rounded-xl font-bold text-base sm:text-lg shadow animate-pop z-10">
          {Number(getDisplayPrice()).toLocaleString("sr-RS")} RSD
        </span>
      )}

      <ProgressiveImage
        src={product.imgUrl}
        alt={product.name}
        className="h-32 w-32 sm:h-40 sm:w-40 object-cover rounded-xl shadow-lg mb-4 group-hover:scale-105 group-hover:shadow-2xl transition"
        style={{ aspectRatio: "1/1", background: "#E5E5E5" }}
      />
      <h3 className="font-bold text-base sm:text-xl text-midnight mb-1 text-center">
        {product.name}
      </h3>
      <p className="text-sheen mb-2 text-center font-semibold text-sm sm:text-base">
        {product.category}
      </p>

      {/* Cene: pre i posle popusta - samo ako cena nije skrivena */}
      {!hasHiddenPrice &&
        product.originalPrice &&
        product.originalPrice > getDisplayPrice() && (
          <div className="mb-2 sm:mb-3 flex items-center justify-center gap-2 animate-fadein-down">
            <span className="line-through text-rust font-semibold text-lg opacity-60">
              {Number(product.originalPrice).toLocaleString("sr-RS")} RSD
            </span>
          </div>
        )}

      {/* Tekst za skrivenu cenu umesto precrtane cene */}
      {hasHiddenPrice && (
        <div className="mb-2 sm:mb-3 flex items-center justify-center gap-2">
          <span className="text-rust/60 font-semibold text-base italic">
            Kontaktirajte nas za cenu
          </span>
        </div>
      )}

      {/* Ocena */}
      <div className="mb-2 sm:mb-3 flex items-center justify-center gap-1">
        <span className="text-yellow-400 text-lg sm:text-xl">★</span>
        <span className="text-charcoal font-semibold text-base sm:text-lg">
          {product.rating ? product.rating.toFixed(1) : "5.0"}
        </span>
      </div>

      {/* Dugme - ostaje "Dodaj u korpu" za sve proizvode */}
      <button
        onClick={handleAddToCart}
        className="mt-2 sm:mt-4 px-4 sm:px-6 py-2 sm:py-3 w-full rounded-full font-semibold shadow-lg
          bg-gradient-to-tr from-bluegreen to-midnight text-white
          hover:from-midnight hover:to-bluegreen hover:shadow-2xl
          transition-all group-hover:-translate-y-1 group-hover:scale-105
          active:scale-95 focus:ring-2 focus:ring-sheen text-sm sm:text-base animate-fadein"
      >
        Dodaj u korpu
      </button>
    </Link>
  );
}
