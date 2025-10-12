import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useContext, useCallback } from "react";
import { db, auth } from "../../utils/firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  orderBy,
  serverTimestamp,
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
  Trash2,
  Mail,
} from "lucide-react";
import { CartContext } from "../../contexts/shop/cart/CartContext";
import { SnackbarContext } from "../../contexts/snackbar/SnackbarContext";
import { ArrowLeft } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { FiDownload, FiPackage } from "react-icons/fi";
import { FaStar, FaRegStar, FaUserCircle } from "react-icons/fa";
import ScrollToTopOnMount from "../UI/ScrollToTopOnMount";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [showAddAnim, setShowAddAnim] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const { addToCart } = useContext(CartContext);
  const { showSnackbar } = useContext(SnackbarContext);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalAnimating, setModalAnimating] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const closeModal = () => {
    setModalAnimating(true);
    setTimeout(() => {
      setShowImageModal(false);
      setModalAnimating(false);
    }, 520);
  };

  const openModal = () => {
    setModalImageIndex(currentImageIndex);
    setShowImageModal(true);
    setModalAnimating(false);
  };

  const openReviewModal = () => {
    if (!currentUser) {
      showSnackbar(
        "Morate biti prijavljeni da biste ostavili recenziju",
        "error"
      );
      return;
    }
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setReview("");
    setRating(5);
  };

  const nextModalImage = useCallback(() => {
    if (!product) return;
    const totalImages = 1 + (product.images?.length || 0);
    setModalImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  }, [product]);

  const prevModalImage = useCallback(() => {
    if (!product) return;
    const totalImages = 1 + (product.images?.length || 0);
    setModalImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  }, [product]);

  // Handle keyboard navigation in modal
  useEffect(() => {
    if (!showImageModal) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        prevModalImage();
      } else if (e.key === "ArrowRight") {
        nextModalImage();
      } else if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showImageModal, nextModalImage, prevModalImage]);

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

  // Check admin status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        const adminEmails =
          import.meta.env.VITE_ADMIN_EMAILS?.split(",").map((e) => e.trim()) ||
          [];
        setIsAdmin(adminEmails.includes(user.email));
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      const snap = await getDoc(doc(db, "products", id));
      setProduct(addDiscountInfo({ id: snap.id, ...snap.data() }));
    };
    fetchProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // Real-time reviews with onSnapshot
  useEffect(() => {
    const q = query(
      collection(db, "reviews"),
      where("productId", "==", id),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(reviewsData);
    });

    return () => unsubscribe();
  }, [id]);

  const handleReview = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      showSnackbar(
        "Morate biti prijavljeni da biste ostavili recenziju",
        "error"
      );
      return;
    }
    if (review.length > 2) {
      try {
        await addDoc(collection(db, "reviews"), {
          productId: id,
          text: review,
          rating: rating,
          userName: currentUser.displayName || "Korisnik",
          userEmail: currentUser.email,
          userPhoto: currentUser.photoURL || null,
          userId: currentUser.uid,
          createdAt: serverTimestamp(),
        });
        setReview("");
        setRating(5);
        closeReviewModal();
        showSnackbar("Recenzija je uspešno dodata!", "success");
      } catch (error) {
        console.error("Error adding review:", error);
        showSnackbar("Greška pri dodavanju recenzije", "error");
      }
    } else {
      showSnackbar("Recenzija mora imati najmanje 3 karaktera", "error");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!isAdmin) {
      showSnackbar("Nemate dozvolu za brisanje recenzija", "error");
      return;
    }
    try {
      await deleteDoc(doc(db, "reviews", reviewId));
      showSnackbar("Recenzija je obrisana", "success");
    } catch (error) {
      console.error("Error deleting review:", error);
      showSnackbar("Greška pri brisanju recenzije", "error");
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
    <>
      <ScrollToTopOnMount offset={0} duration={1.2} delay={100} />
      <div className="min-h-screen flex flex-col items-center justify-center py-4 px-1 sm:py-8 sm:px-2 animate-pop">
        {/* MODAL za sliku sa karuselom */}
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
                className="absolute right-3 top-3 bg-black/60 hover:bg-black text-white rounded-full p-2 transition z-20 backdrop-blur-md"
                onClick={closeModal}
                aria-label="Zatvori modal"
              >
                <X size={28} />
              </button>

              {/* Navigation arrows - show only if there are multiple images */}
              {product.images && product.images.length > 0 && (
                <>
                  <Motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevModalImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-3 rounded-full shadow-xl hover:bg-white/30 transition-all border border-white/30 z-20"
                    aria-label="Prethodna slika"
                  >
                    <ChevronLeft size={28} />
                  </Motion.button>
                  <Motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextModalImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-3 rounded-full shadow-xl hover:bg-white/30 transition-all border border-white/30 z-20"
                    aria-label="Sledeća slika"
                  >
                    <ChevronRight size={28} />
                  </Motion.button>
                </>
              )}

              {/* Image with animation */}
              <AnimatePresence mode="wait">
                <Motion.div
                  key={modalImageIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <img
                    src={
                      modalImageIndex === 0
                        ? product.imgUrl
                        : product.images?.[modalImageIndex - 1]
                    }
                    alt={`${product.name} - ${modalImageIndex + 1}`}
                    className="rounded-2xl max-w-[88vw] max-h-[70vh] object-contain shadow-xl bg-white/10 backdrop-blur-md border border-white/20"
                    style={{
                      backdropFilter: "blur(10px)",
                    }}
                  />
                  <div className="mt-4 text-center">
                    <div className="text-lg font-semibold text-white drop-shadow-lg">
                      {product.name}
                    </div>
                    {product.images && product.images.length > 0 && (
                      <div className="mt-2 text-sm text-white/80 backdrop-blur-sm bg-black/30 px-3 py-1 rounded-full inline-block">
                        {modalImageIndex + 1} / {1 + product.images.length}
                      </div>
                    )}
                  </div>
                </Motion.div>
              </AnimatePresence>

              {/* Dots indicator for modal */}
              {product.images && product.images.length > 0 && (
                <div className="flex justify-center gap-2 mt-4">
                  {[...Array(1 + product.images.length)].map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setModalImageIndex(idx)}
                      className={`transition-all rounded-full ${
                        idx === modalImageIndex
                          ? "bg-white w-8 h-3"
                          : "bg-white/50 hover:bg-white/70 w-3 h-3"
                      }`}
                      aria-label={`Idi na sliku ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
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
          <div className="md:w-1/2 w-full flex items-center justify-items-start flex-col gap-6 py-5 px-2 sm:py-20 sm:px-4 animate-fade-up relative">
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
                onClick={openModal}
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
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? totalImages - 1 : prev - 1
                      );
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
                      setCurrentImageIndex((prev) =>
                        prev === totalImages - 1 ? 0 : prev + 1
                      );
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md text-[#1E3E49] p-2 rounded-full shadow-lg hover:bg-[#6EAEA2] hover:text-white transition-all border border-[#6EAEA2]/30"
                    style={{ backdropFilter: "blur(10px)" }}
                  >
                    <ChevronRight size={20} />
                  </Motion.button>

                  {/* Dots indicator */}
                  <div className="flex justify-center gap-2 mt-3">
                    {[...Array(1 + (product.images?.length || 0))].map(
                      (_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImageIndex
                              ? "bg-[#6EAEA2] w-6"
                              : "bg-gray-300 hover:bg-[#6EAEA2]/50"
                          }`}
                        />
                      )
                    )}
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
                        <span className="text-sm text-[#2F5363]">
                          {feature.value}
                        </span>
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
                          <FiDownload
                            className="text-[#1E3E49] group-hover:text-white transition-all"
                            size={18}
                          />
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-[#1E3E49] group-hover:text-[#6EAEA2] transition-all">
                            {datasheet.name}
                          </span>
                        </div>
                        <ChevronRight
                          className="text-[#6EAEA2] group-hover:translate-x-1 transition-transform"
                          size={18}
                        />
                      </Motion.a>
                    ))}
                  </div>
                </Motion.div>
              )}
            </div>
          </div>
        </div>
        {/* Review Modal */}
        <AnimatePresence>
          {showReviewModal && (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
              onClick={closeReviewModal}
            >
              <Motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 max-w-lg w-full border-2 border-[#6EAEA2]/30"
                style={{
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-[#253869] flex items-center gap-2">
                    <MessageCircle size={28} className="text-[#6EAEA2]" />
                    Nova recenzija
                  </h3>
                  <Motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeReviewModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={28} />
                  </Motion.button>
                </div>

                <form onSubmit={handleReview} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#253869] mb-2">
                      Ocena
                    </label>
                    <div className="flex gap-2 items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Motion.button
                          key={star}
                          type="button"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          {star <= rating ? (
                            <FaStar size={32} className="text-yellow-400" />
                          ) : (
                            <FaRegStar size={32} className="text-gray-300" />
                          )}
                        </Motion.button>
                      ))}
                      <span className="ml-2 text-lg font-semibold text-[#253869]">
                        {rating}/5
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#253869] mb-2">
                      Vaša recenzija
                    </label>
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Podelite vaše iskustvo sa ovim proizvodom..."
                      rows={4}
                      className="w-full border-2 border-[#6EAEA2]/30 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 text-gray-800 transition-all focus:border-[#6EAEA2] focus:shadow-lg focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={closeReviewModal}
                      className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold shadow hover:bg-gray-300 transition-all"
                    >
                      Otkaži
                    </Motion.button>
                    <Motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-gradient-to-r from-[#6EAEA2] to-[#5A9D92] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      Objavi
                    </Motion.button>
                  </div>
                </form>
              </Motion.div>
            </Motion.div>
          )}
        </AnimatePresence>

        {/* Reviews Section */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-5xl mt-3 rounded-[2rem] shadow-xl backdrop-blur-xl border-2 p-6 sm:p-8"
          style={{
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(20px)",
            border: "2px solid rgba(110, 174, 162, 0.3)",
            boxShadow: "0 8px 32px rgba(110, 174, 162, 0.15)",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-2xl sm:text-3xl text-[#253869] flex items-center gap-2">
              <MessageCircle size={28} className="text-[#6EAEA2]" />
              Recenzije
              {reviews.length > 0 && (
                <span className="text-lg text-gray-500">
                  ({reviews.length})
                </span>
              )}
            </h3>
            <Motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openReviewModal}
              className="bg-gradient-to-r from-[#6EAEA2] to-[#5A9D92] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <MessageCircle size={18} />
              <span className="hidden sm:inline">Dodaj recenziju</span>
              <span className="sm:hidden">Dodaj</span>
            </Motion.button>
          </div>

          {reviews.length === 0 ? (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <MessageCircle size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">
                Još nema recenzija. Budite prvi koji će ostaviti recenziju!
              </p>
            </Motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-4">
                {reviews.map((r, i) => (
                  <Motion.div
                    key={r.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.1 }}
                    className="backdrop-blur-md rounded-2xl p-4 sm:p-5 border-2 shadow-lg hover:shadow-xl transition-all group"
                    style={{
                      background: "rgba(255, 255, 255, 0.6)",
                      backdropFilter: "blur(15px)",
                      border: "2px solid rgba(110, 174, 162, 0.2)",
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* User Avatar */}
                      <div className="flex-shrink-0">
                        {r.userPhoto ? (
                          <img
                            src={r.userPhoto}
                            alt={r.userName}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#6EAEA2]/50 object-cover shadow-md"
                          />
                        ) : (
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#6EAEA2] to-[#5A9D92] flex items-center justify-center border-2 border-[#6EAEA2]/50 shadow-md">
                            <FaUserCircle size={28} className="text-white" />
                          </div>
                        )}
                      </div>

                      {/* Review Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <h4 className="font-bold text-[#253869] text-base sm:text-lg flex items-center gap-2 flex-wrap">
                              {r.userName}
                              {r.userEmail && (
                                <span className="text-xs text-gray-500 font-normal flex items-center gap-1">
                                  <Mail size={12} />
                                  {r.userEmail}
                                </span>
                              )}
                            </h4>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, idx) => (
                                <FaStar
                                  key={idx}
                                  size={14}
                                  className={
                                    idx < r.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                              <span className="text-sm text-gray-600 ml-1">
                                ({r.rating}/5)
                              </span>
                            </div>
                          </div>
                          {isAdmin && (
                            <Motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteReview(r.id)}
                              className="text-red-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                              title="Obriši recenziju"
                            >
                              <Trash2 size={18} />
                            </Motion.button>
                          )}
                        </div>
                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                          {r.text}
                        </p>
                        {r.createdAt && (
                          <p className="text-xs text-gray-400 mt-2">
                            {r.createdAt.toDate
                              ? new Date(
                                  r.createdAt.toDate()
                                ).toLocaleDateString("sr-RS", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  </Motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </Motion.div>
      </div>
    </>
  );
}
