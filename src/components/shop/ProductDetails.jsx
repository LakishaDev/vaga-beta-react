import { Link, useParams } from "react-router-dom";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { CartContext } from "../../contexts/shop/cart/CartContext";
import { SnackbarContext } from "../../contexts/snackbar/SnackbarContext";
import { ArrowLeft } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { FiDownload, FiPackage } from "react-icons/fi";

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
  const [hovered, setHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const closeModal = () => {
    setModalAnimating(true);
    setTimeout(() => {
      setShowImageModal(false);
      setModalAnimating(false);
    }, 520);
  };

  function addDiscountInfo(product) {
    let percent = 0.1;
    if (product.price > 40000 && product.price < 500000) percent = 0.25;
    else if (product.price < 14000) percent = 0.1;
    else if (product.price > 500000) percent = 0.3;
    let originalPrice = Math.round(
      (product.price || product.hiddenPrice || 0) / (1 - percent)
    );
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
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const formatRSD = (num) =>
    num ? new Intl.NumberFormat("sr-RS").format(num) : "";

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

  // Provera skrivene cene
  const hasHiddenPrice = product.hiddenPrice && !product.price;
  const getDisplayPrice = () => {
    if (product.price) return product.price;
    if (product.hiddenPrice) return product.hiddenPrice;
    return 0;
  };
  const showDiscount =
    !hasHiddenPrice &&
    product.originalPrice &&
    product.originalPrice > product.price;

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
            <ProgressiveImage
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
        {/* Back button — na vrhu, ispod otvaranja wrappera */}
        <div className="hidden sm:flex justify-start mb-5 px-3 pt-5">
          <Motion.div
            className={`
          group flex items-center
          rounded-full bg-white/80 backdrop-blur-md border border-[#bed7ec]/70 shadow
          px-1 py-1
          transition-colors
          cursor-pointer
          hover:bg-blue-50/80 focus:outline-none
          relative overflow-hidden whitespace-nowrap
          min-w-[48px]
          max-h-fit
        `}
            aria-label="Vrati na proizvode"
            style={{
              boxShadow: "0 2px 24px rgba(50,60,100,0.10)",
              border: "1.25px solid rgba(130,170,230,0.17)",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            animate={{
              width: hovered ? "118px" : "48px",
              transition: { type: "spring", stiffness: 340, damping: 30 },
            }}
            initial={{ width: "48px" }}
          >
            <Link
              to="/prodavnica/proizvodi"
              className="flex items-center focus:outline-none"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {/* Fiksni kružić za ikonu */}
              <span
                className="flex items-center justify-center bg-white/80 border border-[#bed7ec]/60 rounded-full shadow w-10 h-10 transition"
                style={{
                  minWidth: 40,
                  minHeight: 40,
                  maxWidth: 40,
                  maxHeight: 40,
                  boxShadow: "0 2px 12px rgba(50,60,100,0.10)",
                }}
              >
                <ArrowLeft
                  size={24}
                  className="text-blue-700 drop-shadow transition-all"
                />
              </span>
              {/* Animirani tekst na hover */}
              <Motion.span
                className="pl-2 select-none font-semibold text-blue-900 text-lg hidden sm:inline-block"
                style={{
                  whiteSpace: "nowrap",
                  display: "inline-block",
                  opacity: hovered ? 1 : 0,
                  transition: "opacity 0.22s",
                }}
                layout
              >
                Vrati
              </Motion.span>
            </Link>
          </Motion.div>
        </div>
        <div className="md:w-1/2 w-full flex items-center justify-center flex-col gap-6 py-5 px-2 sm:py-8 sm:px-4 animate-fade-up relative">
          {/* Popust badge */}
          {!hasHiddenPrice && showDiscount && (
            <span className="absolute top-3 left-3 sm:top-5 sm:left-6 bg-green-100 text-green-800 px-3 py-1 rounded-xl font-bold text-xs sm:text-sm shadow border border-green-200 flex items-center gap-1 z-20">
              <Percent size={16} className="text-green-600" /> -
              {product.discountPercent}% POPUST
            </span>
          )}
          
          {/* Image Carousel */}
          <div className="relative w-full max-w-xs">
            <div
              className="rounded-2xl overflow-hidden shadow-lg ring-1 ring-blue-100 bg-white bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-70 cursor-zoom-in transition hover:scale-105"
              onClick={() => {
                setShowImageModal(true);
                setModalAnimating(false);
              }}
              tabIndex={0}
              aria-label="Otvori sliku"
            >
              <AnimatePresence mode="wait">
                <Motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProgressiveImage
                    src={
                      currentImageIndex === 0
                        ? product.imgUrl
                        : product.images?.[currentImageIndex - 1]
                    }
                    alt={`${product.name} - ${currentImageIndex + 1}`}
                    className="w-full aspect-square object-contain"
                  />
                </Motion.div>
              </AnimatePresence>
            </div>

            {/* Carousel Controls */}
            {product.images && product.images.length > 0 && (
              <>
                <Motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    const totalImages = 1 + (product.images?.length || 0);
                    setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md text-[#1E3E49] p-2 rounded-full shadow-lg hover:bg-[#6EAEA2] hover:text-white transition-all border border-[#6EAEA2]/30"
                  style={{ backdropFilter: "blur(10px)" }}
                >
                  <ChevronLeft size={20} />
                </Motion.button>
                <Motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    const totalImages = 1 + (product.images?.length || 0);
                    setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md text-[#1E3E49] p-2 rounded-full shadow-lg hover:bg-[#6EAEA2] hover:text-white transition-all border border-[#6EAEA2]/30"
                  style={{ backdropFilter: "blur(10px)" }}
                >
                  <ChevronRight size={20} />
                </Motion.button>

                {/* Dots indicator */}
                <div className="flex justify-center gap-2 mt-3">
                  {[...Array(1 + (product.images?.length || 0))].map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentImageIndex
                          ? "bg-[#6EAEA2] w-6"
                          : "bg-gray-300 hover:bg-[#6EAEA2]/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
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
              {/* Precrtana cena samo ako JE JAVNA cena i popust */}
              {!hasHiddenPrice && showDiscount && (
                <span className="line-through text-rust font-semibold text-base sm:text-lg opacity-60 mb-[2px]">
                  {formatRSD(product.originalPrice)} RSD
                </span>
              )}
              {/* Prikaz badge-a kada je cena skrivena */}
              {hasHiddenPrice ? (
                <span className="font-bold text-base sm:text-lg md:text-xl text-rust/90 bg-orange-100 px-3 py-1 rounded-xl">
                  Cena na upit
                </span>
              ) : (
                <span className="font-bold text-lg sm:text-xl md:text-2xl text-[#253869]">
                  {formatRSD(getDisplayPrice())} RSD
                </span>
              )}
            </div>
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
          <div className="flex items-center gap-3 mb-1 mt-1">
            <span className="text-sm text-gray-600 font-medium">Boja:</span>
            <span className="inline-block w-5 h-5 bg-[#232221] rounded-full border border-gray-300"></span>
            <span className="inline-block w-5 h-5 bg-[#ededed] rounded-full border border-gray-300"></span>
          </div>
          {/* Features & Downloads with glassmorphism */}
          <div className="w-full space-y-3 mt-4">
            {/* Karakteristike */}
            {product.features && product.features.length > 0 && (
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-xl backdrop-blur-md border shadow-lg"
                style={{
                  background: "rgba(110, 174, 162, 0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1.5px solid rgba(110, 174, 162, 0.3)",
                }}
              >
                <h3 className="font-bold text-[#1E3E49] mb-3 flex items-center gap-2 text-base">
                  <FiPackage className="text-[#6EAEA2]" size={20} />
                  Karakteristike
                </h3>
                <div className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <Motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="flex justify-between items-center p-2 rounded-lg bg-white/40 backdrop-blur-sm border border-[#6EAEA2]/20"
                    >
                      <span className="text-sm font-semibold text-[#1E3E49]">
                        {feature.label}:
                      </span>
                      <span className="text-sm text-[#2F5363]">{feature.value}</span>
                    </Motion.div>
                  ))}
                </div>
              </Motion.div>
            )}

            {/* Preuzimanja / Datasheets */}
            {product.datasheets && product.datasheets.length > 0 && (
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 rounded-xl backdrop-blur-md border shadow-lg"
                style={{
                  background: "rgba(30, 62, 73, 0.08)",
                  backdropFilter: "blur(10px)",
                  border: "1.5px solid rgba(110, 174, 162, 0.3)",
                }}
              >
                <h3 className="font-bold text-[#1E3E49] mb-3 flex items-center gap-2 text-base">
                  <FiDownload className="text-[#6EAEA2]" size={20} />
                  Preuzimanja
                </h3>
                <div className="space-y-2">
                  {product.datasheets.map((datasheet, idx) => (
                    <Motion.a
                      key={idx}
                      href={datasheet.url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-[#6EAEA2]/30 hover:bg-[#91CEC1]/20 hover:border-[#6EAEA2] transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#6EAEA2]/20 group-hover:bg-[#6EAEA2] transition-all">
                        <FiDownload className="text-[#1E3E49] group-hover:text-white transition-all" size={18} />
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-[#1E3E49] group-hover:text-[#6EAEA2] transition-all">
                          {datasheet.name}
                        </span>
                      </div>
                      <ChevronRight className="text-[#6EAEA2] group-hover:translate-x-1 transition-transform" size={18} />
                    </Motion.a>
                  ))}
                </div>
              </Motion.div>
            )}
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
