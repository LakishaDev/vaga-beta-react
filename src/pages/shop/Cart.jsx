// src/components/Cart.jsx
import { useContext } from "react";
import { CartContext } from "../../contexts/shop/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6">Vaša korpa</h2>
      {cart.length === 0 ? (
        <p>Korpa je prazna.</p>
      ) : (
        <>
          <ul className="mb-6">
            {cart.map(item => (
              <li key={item.id} className="flex items-center justify-between mb-4">
                <span>
                  {item.name} x {item.qty}
                </span>
                <span>
                  {item.price * item.qty} RSD
                  <button
                    className="ml-3 text-rust"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Izbaci
                  </button>
                </span>
              </li>
            ))}
          </ul>
          <div className="font-semibold text-lg mb-4">Ukupno: {total} RSD</div>
          <Link
            to="/prodavnica/placanje"
            className="bg-sheen text-white px-6 py-2 rounded shadow hover:bg-bluegreen transition"
          >
            Checkout
          </Link>
          <button
            className="ml-2 text-charcoal"
            onClick={clearCart}
          >
            Očisti korpu
          </button>
        </>
      )}
    </div>
  );
}
