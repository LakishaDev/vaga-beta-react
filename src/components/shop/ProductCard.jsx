import { useContext } from "react";
import { CartContext } from "../../contexts/shop/CartContext";
import { SnackbarContext } from "../../contexts/shop/SnackbarContext";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const { showSnackbar } = useContext(SnackbarContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    showSnackbar(`${product.name} je dodat u korpu!`, "success");
  };

  return (
    <Link
      to={`/prodavnica/product/${product.id}`}
      className="group bg-white/80 backdrop-blur rounded-2xl border shadow-xl 
        transition-transform hover:scale-105 hover:shadow-2xl hover:border-bluegreen
        flex flex-col items-center py-6 px-3 sm:px-5 relative overflow-hidden min-h-[320px] sm:min-h-[380px] w-full"
      style={{
        borderColor: "#CBCFBB"
      }}
    >
      {/* Cena badge gore desno */}
      <span className="absolute top-4 sm:top-6 right-4 sm:right-7 bg-bluegreen text-white px-3 sm:px-4 py-1 rounded-xl font-bold text-base sm:text-lg shadow animate-pop z-10">
        {Number(product.price).toLocaleString("sr-RS")} RSD
      </span>
      <img
        src={product.imgUrl}
        alt={product.name}
        className="h-32 w-32 sm:h-40 sm:w-40 object-cover rounded-xl shadow-lg mb-3 sm:mb-4 group-hover:scale-105 group-hover:shadow-2xl transition"
        style={{ aspectRatio: "1/1", background: "#E5E5E5" }}
      />
      <h3 className="font-bold text-base sm:text-xl text-midnight mb-1 text-center">{product.name}</h3>
      <p className="text-sheen mb-2 text-center font-semibold text-sm sm:text-base">{product.category}</p>
      {/* Ocena */}
      <div className="mb-2 sm:mb-3 flex items-center justify-center gap-1">
        <span className="text-yellow-400 text-lg sm:text-xl">★</span>
        <span className="text-charcoal font-semibold text-base sm:text-lg">{product.rating ? product.rating.toFixed(1) : "5.0"}</span>
      </div>
      <button
        onClick={handleAddToCart}
        className="mt-2 sm:mt-4 px-4 sm:px-6 py-2 sm:py-3 w-full rounded-full font-semibold shadow-lg 
          bg-gradient-to-tr from-bluegreen to-midnight text-white
          hover:from-midnight hover:to-bluegreen hover:shadow-2xl
          transition-all group-hover:-translate-y-1 group-hover:scale-105
          active:scale-95 focus:ring-2 focus:ring-sheen text-sm sm:text-base"
      >
        Dodaj u korpu
      </button>
    </Link>
  );
}
