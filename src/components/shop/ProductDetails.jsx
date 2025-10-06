// components/shop/ProductDetails.jsx
// Komponenta koja prikazuje detalje o proizvodu
// Učitava proizvod iz Firestore na osnovu ID-a iz URL-a
// Prikazuje sliku, naziv, opis, cenu, ocene i recenzije
// Omogućava dodavanje u korpu sa animacijom
// Omogućava pregled slike u modalnom prozoru
// Koristi kontekst korpe i snackbar-a za funkcionalnosti
// Koristi ProgressiveImage za učitavanje slike sa efektom preliva
// Koristi framer-motion za animacije
// Koristi React Router za čitanje URL parametara
// Koristi Firebase Firestore za čuvanje i učitavanje podataka o proizvodima i recenzijama
// Props: nema (uzima ID proizvoda iz URL-a)

import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { db } from "../../utils/firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import ProgressiveImage from "../UI/ProgressiveImage";
import {
  Star,
  Package,
  Download,
  MessageCircle,
  ShoppingCart,
  X,
  Percent,
} from "lucide-react";
import { CartContext } from "../../contexts/shop/cart/CartContext";
import { SnackbarContext } from "../../contexts/snackbar/SnackbarContext";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState("");
  const [showAddAnim, setShowAddAnim] = useState(false);

  const { addToCart } = useContext(CartContext);
  const { showSnackbar } = useContext(SnackbarContext);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalAnimating, setModalAnimating] = useState(false);

  const closeModal = () => {
    setModalAnimating(true);
    setTimeout(() => {
      setShowImageModal(false);
      setModalAnimating(false);
    }, 520);
  };

  function addDiscountInfo(product) {
    let percent = 0.1; // 10% popusta za proizvode ispod 14k
    if (product.price > 40000 && product.price < 500000) percent = 0.25;
    else if (product.price < 14000) percent = 0.1;
    else if (product.price > 500000) percent = 0.3;
    let originalPrice = Math.round(product.price / (1 - percent));
    return {
      ...product,
      originalPrice,
      discountPercent: Math.round(percent * 100),
    };
  }

  useEffect(() => {
    const fetchProduct = async () => {
      const snap = await getDoc(doc(db, "products", id));
      setProduct(addDiscountInfo({ id: snap.id, ...snap.data() }));
    };
    const fetchReviews = async () => {
      const q = query(collection(db, "reviews"), where("productId", "==", id));
      const snaps = await getDocs(q);
      setReviews(snaps.docs.map((d) => ({ ...d.data() })));
    };
    fetchProduct();
    fetchReviews();
    window.scrollTo({ top: 0, behavior: "smooth" }); // ili "smooth" za animirani skok
  }, [id]);

  const handleReview = async (e) => {
    e.preventDefault();
    if (review.length > 2) {
      await addDoc(collection(db, "reviews"), {
        productId: id,
        text: review,
        createdAt: new Date(),
      });
      setReview("");
      const q = query(collection(db, "reviews"), where("productId", "==", id));
      const snaps = await getDocs(q);
      setReviews(snaps.docs.map((d) => ({ ...d.data() })));
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    showSnackbar(`Proizvod ${product.name} je dodat u korpu!`, "success");
    setShowAddAnim(true);
    setTimeout(() => setShowAddAnim(false), 1200);
  };

  const formatRSD = (num) => new Intl.NumberFormat("sr-RS").format(num);

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center px-3 py-10 bg-gradient-to-br from-sheen/40 to-bluegreen/20">
        <div
          className="
          flex flex-col md:flex-row items-center w-full max-w-5xl rounded-[2rem] shadow-xl
          bg-white bg-opacity-80 border border-gray-200 animate-pulse
          relative overflow-hidden
          p-7 md:p-12
        "
        >
          {/* Slika skeleton + shimmer */}
          <div className="md:w-1/2 w-full flex items-center justify-center mb-8 md:mb-0">
            <div
              className="
            aspect-square w-40 sm:w-56 rounded-2xl bg-gray-200/60
            animate-shimmer shadow-lg
            "
            >
              {/* Ikona proizvoda - shimmer */}
              <svg
                className="mx-auto my-auto block mt-12 opacity-25"
                width="64"
                height="64"
                fill="none"
                viewBox="0 0 48 48"
              >
                <rect width="48" height="48" rx="12" fill="#B3BED4" />
                <path
                  d="M15 33h18M24 15v18"
                  stroke="#253869"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          {/* Info skeleton */}
          <div className="md:w-1/2 w-full flex flex-col gap-5">
            <div className="h-8 bg-gray-300/50 rounded w-3/4 animate-shimmer"></div>
            <div className="h-4 bg-gray-200/60 rounded w-1/2 animate-shimmer"></div>
            <div className="h-16 bg-gray-200/60 rounded w-full mb-2 animate-shimmer"></div>
            <div className="flex gap-3">
              <div className="h-9 w-28 bg-gray-300/50 rounded-lg animate-shimmer"></div>
              <div className="h-9 w-16 bg-gray-250/60 rounded-lg animate-shimmer"></div>
            </div>
            <div className="h-5 bg-gray-200/50 rounded w-2/3 animate-shimmer mt-2"></div>
            <div className="h-4 bg-gray-150/50 rounded w-1/3 animate-shimmer"></div>
            <div className="h-8 w-40 bg-gray-250/60 rounded-lg animate-shimmer"></div>
          </div>
        </div>
      </div>
    );

  // Prikaz badge-a i cena za popust
  const showDiscount =
    product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-4 px-1 sm:py-8 sm:px-2 animate-pop">
      {/* MODAL za sliku */}
      {showImageModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm
          transition-all duration-500 ${
            modalAnimating ? "image-modal-close" : "image-modal-open"
          }`}
        >
          <div className="absolute inset-0" onClick={closeModal} />
          <div className="relative z-10 flex flex-col items-center max-w-[95vw] max-h-[90vh]">
            <button
              className="absolute right-3 top-3 bg-black/60 text-white rounded-full p-2 hover:bg-black transition z-20"
              onClick={closeModal}
            >
              <X size={28} />
            </button>
            <img
              src={product.imgUrl}
              alt={product.name}
              className={`rounded-2xl max-w-[88vw] max-h-[80vh] object-contain shadow-xl bg-white
                image-modal-animate transition-all duration-500
                ${modalAnimating ? "img-leave" : "img-enter"}`}
            />
            <div className="mt-3 text-lg font-semibold text-white drop-shadow">
              {product.name}
            </div>
          </div>
        </div>
      )}
      <div
        className="w-full max-w-5xl rounded-[2rem] shadow-xl bg-white bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-60 border border-gray-300 flex flex-col md:flex-row p-0 overflow-hidden relative"
        style={{
          boxShadow:
            "0 16px 80px 0 rgba(60,88,143,.19), 0 2px 6px 0 rgba(44,98,120,.13)",
          border: "1.5px solid rgba(170,170,185,0.23)",
        }}
      >
        <div className="md:w-1/2 w-full flex items-center justify-center flex-col gap-6 py-5 px-2 sm:py-8 sm:px-4 animate-fade-up relative">
          {/* Popust badge */}
          {showDiscount && (
            <span className="absolute top-3 left-3 sm:top-5 sm:left-6 bg-green-100 text-green-800 px-3 py-1 rounded-xl font-bold text-xs sm:text-sm shadow border border-green-200 flex items-center gap-1 z-20">
              <Percent size={16} className="text-green-600" /> -
              {product.discountPercent}% POPUST
            </span>
          )}
          <div
            className="rounded-2xl overflow-hidden shadow-lg ring-1 ring-blue-100 bg-white bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-70 w-full max-w-xs cursor-zoom-in transition hover:scale-105"
            onClick={() => {
              setShowImageModal(true);
              setModalAnimating(false);
            }}
            tabIndex={0}
            aria-label="Otvori sliku"
          >
            <ProgressiveImage
              src={product.imgUrl}
              alt={product.name}
              className="w-full aspect-square object-contain"
            />
          </div>
          <div className="flex gap-2 mt-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#edeef3] text-[#2d334d]">
              <Package size={20} />
            </span>
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#edeef3] text-[#2d334d]">
              <Download size={20} />
            </span>
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#edeef3] text-[#2d334d]">
              <Star size={20} />
            </span>
          </div>
        </div>
        <div className="md:w-1/2 w-full flex flex-col items-center md:items-start justify-center px-2 pt-4 sm:px-6 sm:py-10 gap-2 relative min-h-[340px] pb-5 animate-slidein-right">
          <h1 className="font-bold text-[1.6rem] sm:text-3xl md:text-4xl text-[#253869] mb-2 leading-tight flex items-center gap-2">
            {product.name}
          </h1>
          <div className="text-base sm:text-lg text-[#7c8493] mb-1">
            {product.category}
          </div>
          <div className="text-sm sm:text-base text-gray-500 mb-2">
            {product.description}
          </div>
          {/* Prikaz cene i staru cenu precrtanu */}
          <div className="flex items-center sm:items-end flex-col sm:flex-row gap-2 sm:gap-4 mt-0 sm:mt-1 mb-3 relative min-h-[48px]">
            <div className="flex flex-col">
              {showDiscount && (
                <span className="line-through text-rust font-semibold text-base sm:text-lg opacity-60 mb-[2px]">
                  {formatRSD(product.originalPrice)} RSD
                </span>
              )}
              <span className="font-bold text-lg sm:text-xl md:text-2xl text-[#253869]">
                {formatRSD(product.price)} RSD
              </span>
            </div>

            <button
              className="bg-[#253869] text-white font-semibold rounded-xl px-4 sm:px-8 py-2 shadow hover:bg-[#162040] transition flex items-center gap-2 relative overflow-visible"
              onClick={handleAddToCart}
              style={{ position: "relative", zIndex: 10 }}
            >
              {showAddAnim && (
                <>
                  <span className="cart-anim absolute right-[-32px] sm:right-[-60px] top-[-12px] sm:top-[-18px] z-30">
                    <ShoppingCart
                      size={28}
                      className="sm:hidden text-[#355aac] drop-shadow-lg"
                    />
                    <ShoppingCart
                      size={38}
                      className="hidden sm:inline text-[#355aac] drop-shadow-lg"
                    />
                  </span>
                  <span className="add-to-cart-anim absolute left-1/2 -translate-x-1/2 -top-6 sm:-top-7 z-20 pointer-events-none">
                    <Package
                      size={24}
                      className="sm:hidden text-[#44bb99] drop-shadow-lg"
                    />
                    <Package
                      size={32}
                      className="hidden sm:inline text-[#44bb99] drop-shadow-lg"
                    />
                  </span>
                </>
              )}
              Dodaj u korpu
            </button>
          </div>
          <div className="flex items-center gap-3 mb-1 mt-1">
            <span className="text-sm text-gray-600 font-medium">Boja:</span>
            <span className="inline-block w-5 h-5 bg-[#232221] rounded-full border border-gray-300"></span>
            <span className="inline-block w-5 h-5 bg-[#ededed] rounded-full border border-gray-300"></span>
          </div>
          <div>
            <details className="mb-1">
              <summary className="cursor-pointer font-medium text-[#253869] flex items-center gap-1">
                <Package size={16} /> Karakteristike
              </summary>
              <div className="mt-2 text-sm text-gray-600">
                {product.features || "Osnovne karakteristike proizvoda..."}
              </div>
            </details>
            <details>
              <summary className="cursor-pointer font-medium text-[#253869] flex items-center gap-1">
                <Download size={16} /> Preuzimanja
              </summary>
              <div className="mt-2 text-sm text-gray-600">
                {product.downloads || "Preuzmi PDF, deklaracije..."}
              </div>
            </details>
          </div>
        </div>
      </div>
      <div
        className="w-full max-w-5xl mt-3 rounded-[2rem] shadow bg-white bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-60 border border-gray-100 p-5 animate-fade-up"
        style={{
          boxShadow: "0 2px 20px rgba(44,88,99,.07)",
          border: "1.2px solid rgba(170,170,185,0.17)",
        }}
      >
        <h3 className="font-semibold text-xl text-[#253869] mb-2 flex items-center gap-1">
          <MessageCircle size={20} /> Recenzije:
        </h3>
        <form onSubmit={handleReview} className="flex gap-2">
          <input
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Ostavi recenziju..."
            className="flex-1 border border-gray-300 bg-[#f4f5f9] rounded-xl px-4 py-2 text-gray-800 transition-shadow focus:shadow-lg"
          />
          <button className="bg-[#253869] text-white px-6 py-2 rounded-xl font-semibold shadow hover:bg-[#162040] transition">
            Pošalji
          </button>
        </form>
        <ul className="mb-3 space-y-2 mt-4">
          {reviews.map((r, i) => (
            <li
              key={i}
              className="bg-[#f4f5f9] rounded-xl px-3 py-2 text-gray-800 shadow border animate-slidein"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {r.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
