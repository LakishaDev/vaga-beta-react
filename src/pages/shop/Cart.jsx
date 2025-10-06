// src/pages/shop/Cart.jsx
// Stranica korpe u prodavnici
// Prikazuje proizvode u korpi, omogućava izmenu količine, uklanjanje proizvoda i čišćenje korpe
// Takođe prikazuje ukupnu cenu i dugme za plaćanje
// Koristi CartContext za upravljanje stanjem korpe
// Koristi React ikone za prikaz ikonica
// Koristi Modal komponentu za potvrdu akcija
// Koristi ProgressiveImage komponentu za učitavanje slika proizvoda
// Funkcija formatPrice formatira cenu u lokalnom formatu
// Animacije su dodate za poboljšanje korisničkog iskustva
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../../contexts/shop/cart/CartContext";
import { Link } from "react-router-dom";
import {
  FaTrashAlt,
  FaCheckCircle,
  FaShoppingCart,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import Modal from "../../components/UI/Modal";
import ProgressiveImage from "../../components/UI/ProgressiveImage";

function formatPrice(price) {
  return price.toLocaleString("sr-RS");
}

export default function Cart() {
  const { cart, removeFromCart, clearCart, updateQuantity } =
    useContext(CartContext);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removeId, setRemoveId] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);

  // Za animaciju promene cene
  const [displayedTotal, setDisplayedTotal] = useState(0);
  const [animatingTotal, setAnimatingTotal] = useState(false);

  const [animIndex, setAnimIndex] = useState(null);
  const [animType, setAnimType] = useState(""); // "inc" ili "dec"

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  // Responsivno ažuriraj prikazanu cenu uz animaciju
  useEffect(() => {
    if (displayedTotal !== total) {
      let frame = 0;
      const duration = 400;
      const frames = 20;
      setAnimatingTotal(true);
      const step = (total - displayedTotal) / frames;
      const interval = setInterval(() => {
        frame++;
        setDisplayedTotal((prev) => (frame < frames ? prev + step : total));
        if (frame >= frames) {
          clearInterval(interval);
          setDisplayedTotal(total);
          setAnimatingTotal(false);
        }
      }, duration / frames);
      return () => clearInterval(interval);
    }
  }, [displayedTotal, total]);

  const handleDecrease = (id, qty) => {
    if (qty > 1) {
      setAnimIndex(id);
      setAnimType("dec");
      updateQuantity(id, qty - 1);
    } else if (qty === 1) {
      removeFromCart(id);
    }
  };

  const handleIncrease = (id, qty) => {
    setAnimIndex(id);
    setAnimType("inc");
    updateQuantity(id, qty + 1);
  };

  return (
    <>
      <div className="max-w-5xl mx-2 sm:mx-5 md:mx-auto bg-white rounded-3xl shadow-2xl p-3 sm:p-6 md:p-10 mt-10 md:mt-14 animate-fadeIn">
        <h2 className="flex items-center gap-2 sm:gap-4 text-xl sm:text-2xl md:text-3xl font-extrabold mb-5 md:mb-8 text-bluegreen">
          <FaShoppingCart className="text-sheen" size={28} />
          <span>Vaša korpa</span>
        </h2>
        {cart.length === 0 ? (
          <div className="flex flex-col items-center py-6 sm:py-10 text-base sm:text-xl text-gray-400 animate-jump">
            <FaShoppingCart size={38} className="sm:size-48" />
            <p className="mt-3 sm:mt-4">Korpa je prazna.</p>
            <Link
              to="/prodavnica/proizvodi"
              className="mt-6 text-bluegreen underline"
            >
              Nastavi kupovinu
            </Link>
          </div>
        ) : (
          <>
            <ul className="mb-6 space-y-4 sm:space-y-6 overflow-x-auto">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-3 sm:p-4 bg-neutral-50 rounded-xl shadow-sm hover:shadow-md transition-all animate-cartItem
                    ${
                      animIndex === item.id && animType === "inc"
                        ? "animate-bounceInc"
                        : ""
                    }
                    ${
                      animIndex === item.id && animType === "dec"
                        ? "animate-bounceDec"
                        : ""
                    }`}
                  onAnimationEnd={() => {
                    setAnimIndex(null);
                    setAnimType("");
                  }}
                >
                  <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    <ProgressiveImage
                      src={item.imgUrl}
                      alt={item.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg border"
                    />
                    <div className="flex flex-col">
                      <h3 className="text-base sm:text-lg font-semibold break-words">
                        {item.name}
                      </h3>
                      <div className="text-xs sm:text-sm text-gray-400">
                        {item.category}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 sm:gap-2 w-full sm:w-auto">
                    <span
                      className={`text-base sm:text-xl font-bold text-charcoal ${
                        animatingTotal ? "animate-flipPrice" : ""
                      }`}
                    >
                      {formatPrice(item.price * item.qty)} RSD
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition"
                        onClick={() => handleDecrease(item.id, item.qty)}
                        aria-label="Smanji količinu"
                      >
                        <FaMinus />
                      </button>
                      <span className="w-8 text-center font-semibold select-none">
                        {item.qty}
                      </span>
                      <button
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition"
                        onClick={() => handleIncrease(item.id, item.qty)}
                        aria-label="Povećaj količinu"
                      >
                        <FaPlus />
                      </button>
                      <button
                        className="ml-2 flex items-center gap-1 bg-rust text-white py-1 px-2 sm:px-3 rounded hover:bg-red-700 transition-all shadow active:scale-95"
                        onClick={() => {
                          setRemoveId(item.id);
                          setShowRemoveModal(true);
                        }}
                        aria-label="Izbaci iz korpe"
                      >
                        <FaTrashAlt />
                        <span className="hidden sm:inline">Izbaci</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 font-semibold text-xl sm:text-2xl my-5 border-t pt-4">
              <span>Ukupno:</span>
              <span
                className={`text-bluegreen ${
                  animatingTotal ? "animate-flipPrice" : ""
                }`}
              >
                {formatPrice(Math.round(displayedTotal))} RSD
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Link
                to="/prodavnica/placanje"
                className="flex items-center justify-center gap-2 bg-sheen text-white px-6 py-2 sm:px-8 sm:py-3 rounded-xl sm:rounded-2xl shadow-lg hover:bg-bluegreen transition-all animate-button scale-100 active:scale-95 text-base sm:text-lg"
              >
                <FaCheckCircle className="text-white" size={18} />
                Plaćanje
              </Link>
              <button
                className="flex items-center justify-center gap-2 bg-charcoal text-white px-6 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl shadow-lg hover:bg-gray-700 transition-all animate-button scale-100 active:scale-95 text-base sm:text-lg"
                onClick={() => setShowClearModal(true)}
              >
                <FaTrashAlt />
                Očisti korpu
              </button>
            </div>
          </>
        )}
      </div>
      {showRemoveModal && (
        <Modal
          title="Potvrda"
          onClose={() => setShowRemoveModal(false)}
          onConfirm={() => {
            removeFromCart(removeId);
            setShowRemoveModal(false);
          }}
          confirmText="Da, izbaci"
        >
          Da li ste sigurni da želite da izbacite proizvod iz korpe?
        </Modal>
      )}
      {showClearModal && (
        <Modal
          title="Potvrda"
          onClose={() => setShowClearModal(false)}
          onConfirm={() => {
            clearCart();
            setShowClearModal(false);
          }}
          confirmText="Da, očisti"
        >
          Da li ste sigurni da želite da očistite celu korpu?
        </Modal>
      )}
    </>
  );
}
