// src/components/CheckoutForm.jsx
import { useState, useContext } from "react";
import { CartContext } from "../../contexts/shop/cart/CartContext";
import { db } from "../../utils/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function CheckoutForm() {
  const { cart, clearCart } = useContext(CartContext);
  const [values, setValues] = useState({
    tip: "fizicko",
    ime: "",
    prezime: "",
    adresa: "",
    grad: "",
    email: "",
    telefon: "",

    // za firmu
    firma: "",
    pib: "",
    matbr: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = e => setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.ime || !values.adresa || !values.grad || !values.email || !values.telefon) {
      setError("Molimo popunite sva obavezna polja.");
      return;
    }
    try {
      await addDoc(collection(db, "orders"), {
        ...values,
        cart,
        createdAt: serverTimestamp(),
        status: "primljeno" // <-- default status
      });
      setSuccess(true);
      clearCart();
    } catch {
      setError("Greška pri slanju narudžbine.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6">Placanje</h2>
      {success ? (
        <div className="text-green-600 text-lg font-semibold">
          Hvala na narudžbini! Potvrda je poslata.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <select name="tip" value={values.tip} onChange={handleChange} className="border rounded p-2">
            <option value="fizicko">Fizičko lice</option>
            <option value="pravno">Pravno lice</option>
          </select>
          <input name="ime" placeholder="Ime" onChange={handleChange} className="border p-2 rounded" />
          <input name="prezime" placeholder="Prezime" onChange={handleChange} className="border p-2 rounded" />
          <input name="adresa" placeholder="Adresa" onChange={handleChange} className="border p-2 rounded" />
          <input name="grad" placeholder="Grad" onChange={handleChange} className="border p-2 rounded" />
          <input name="email" placeholder="Email" onChange={handleChange} className="border p-2 rounded" />
          <input name="telefon" placeholder="Telefon" onChange={handleChange} className="border p-2 rounded" />
          {values.tip === "pravno" && (
            <>
              <input name="firma" placeholder="Naziv firme" onChange={handleChange} className="border p-2 rounded" />
              <input name="pib" placeholder="PIB" onChange={handleChange} className="border p-2 rounded" />
              <input name="matbr" placeholder="Matični broj" onChange={handleChange} className="border p-2 rounded" />
            </>
          )}
          {error && <div className="text-rust">{error}</div>}
          <button type="submit" className="bg-bluegreen text-white px-6 py-2 rounded shadow hover:bg-sheen transition">
            Pošalji narudžbinu
          </button>
        </form>
      )}
    </div>
  );
}
