// src/components/Cart.jsx
import { useContext, useState } from "react";
import { CartContext } from "../../contexts/shop/CartContext";
import { Link } from "react-router-dom";
import { FaTrashAlt, FaCheckCircle, FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import Modal from "../../components/UI/Modal";

function formatPrice(price) {
  return price.toLocaleString("sr-RS");
}

export default function Cart() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useContext(CartContext);

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removeId, setRemoveId] = useState(null);

  const [showClearModal, setShowClearModal] = useState(false);

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-10 mt-14 animate-fadeIn">
      <h2 className="flex items-center gap-4 text-3xl font-extrabold mb-8 text-bluegreen">
        <FaShoppingCart className="text-sheen" size={36} />
        Vaša korpa
      </h2>
      {cart.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-xl text-gray-400 animate-jump">
          <FaShoppingCart size={48} />
          <p className="mt-4">Korpa je prazna.</p>
          <Link to="/prodavnica/proizvodi" className="mt-6 text-bluegreen underline">Nastavi kupovinu</Link>
        </div>
      ) : (
        <>
          <ul className="mb-8 space-y-6">
            {cart.map(item => (
              <li key={item.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl shadow-sm hover:shadow-md transition-all animate-cartItem">
                <div className="flex items-center gap-4">
                  <img src={item.imgUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg border" />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <div className="text-xs text-gray-400">{item.category}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xl font-bold text-charcoal">{formatPrice(item.price * item.qty)} RSD</span>
                  <div className="flex items-center gap-1">
                    <button className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition"
                      onClick={() => updateQuantity(item.id, item.qty - 1)}>
                      <FaMinus />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.qty}</span>
                    <button className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition"
                      onClick={() => updateQuantity(item.id, item.qty + 1)}>
                      <FaPlus />
                    </button>
                    <button className="ml-2 flex items-center gap-1 bg-rust text-white py-1 px-3 rounded hover:bg-red-700 transition-all shadow active:scale-95"
                      onClick={() => { setRemoveId(item.id); setShowRemoveModal(true); }}>
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center font-semibold text-2xl my-6 border-t pt-6">
            <span>Ukupno:</span>
            <span className="text-bluegreen">{formatPrice(total)} RSD</span>
          </div>
          <div className="flex gap-4">
            <Link
              to="/prodavnica/placanje"
              className="flex items-center gap-2 bg-sheen text-white px-8 py-3 rounded-2xl shadow-lg hover:bg-bluegreen transition-all animate-button scale-100 active:scale-95"
            >
              <FaCheckCircle className="text-white" size={20} />
              Plaćanje
            </Link>
            <button
              className="flex items-center gap-2 bg-charcoal text-white px-6 py-3 rounded-2xl shadow-lg hover:bg-gray-700 transition-all animate-button scale-100 active:scale-95"
              onClick={() => setShowClearModal(true)}
            >
              <FaTrashAlt />
              Očisti korpu
            </button>
          </div>
        </>
      )}

      {showRemoveModal && (
        <Modal
          title="Potvrda"
          onClose={() => setShowRemoveModal(false)}
          onConfirm={() => { removeFromCart(removeId); setShowRemoveModal(false); }}
          confirmText="Da, izbaci"
        >
          Da li ste sigurni da želite da izbacite proizvod iz korpe?
        </Modal>
      )}
      {showClearModal && (
        <Modal
          title="Potvrda"
          onClose={() => setShowClearModal(false)}
          onConfirm={() => { clearCart(); setShowClearModal(false); }}
          confirmText="Da, očisti"
        >
          Da li ste sigurni da želite da očistite celu korpu?
        </Modal>
      )}
    </div>
  );
}
