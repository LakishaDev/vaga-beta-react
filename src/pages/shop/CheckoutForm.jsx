// src/components/CheckoutForm.jsx
import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CartContext } from "../../contexts/shop/cart/CartContext";
import { db } from "../../utils/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import AnimatedInput from "../../components/UI/AnimatedInput";
import {
  User,
  Mail,
  Phone,
  Home,
  Building2,
  Barcode,
  Hash,
  MapPin,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import AnimatedSelect from "../../components/UI/AnimatedSelect";


const initialValues = {
  tip: "fizicko",
  ime: "",
  prezime: "",
  adresa: "",
  grad: "",
  email: "",
  telefon: "",
  firma: "",
  pib: "",
  matbr: ""
};

const validators = {
  ime: v => v.trim().length >= 2 || "Unesite validno ime",
  prezime: v => v.trim().length >= 2 || "Unesite validno prezime",
  adresa: v => v.trim().length > 3 || "Unesite validnu adresu",
  grad: v => v.trim().length > 1 || "Unesite validan grad",
  email: v =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Unesite validan email",
  telefon: v =>
    /^(\+?\d{6,18})$/.test(v.replace(/ /g, "")) || "Unesite validan telefon"
};

const firmValidators = {
  firma: v => v.trim().length >= 2 || "Unesite naziv firme",
  pib: v =>
    /^\d{8,15}$/.test(v) || "PIB mora imati 8-15 cifara",
  matbr: v =>
    /^\d{8,15}$/.test(v) || "Matični broj mora imati 8-15 cifara"
};


export default function CheckoutForm() {
  const { cart, clearCart } = useContext(CartContext);
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const kupacOptions = [
    { value: "fizicko", label: "Fizičko lice", icon: User, description: "Za privatne korisnike" },
    { value: "pravno", label: "Pravno lice", icon: Building2, description: "Za kompanije i firme" },
    // { value: "vip", label: "VIP korisnik", icon: Star, description: "Pristup premium pogodnostima" },
    // { value: "korporativni", label: "Korporativni nalog", icon: Briefcase }
  ];

  // Responsive container animation variants
  const containerVariant = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.9, bounce: 0.25 } }
  };

  // Handle input change
  const handleChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setTouched({ ...touched, [e.target.name]: true });
  };

  // Field validation on blur
  const validateField = name => {
    let validator = validators[name];
    if (values.tip === "pravno" && firmValidators[name]) {
      validator = firmValidators[name];
    }
    if (validator) {
      const valid = validator(values[name]);
      setFieldErrors(err => ({
        ...err,
        [name]: valid === true ? "" : valid
      }));
    }
  };

  // Validate all fields before submit
  const validateForm = () => {
    const errors = {};
    Object.keys(validators).forEach(field => {
      const valid = validators[field](values[field]);
      if (valid !== true) errors[field] = valid;
    });
    if (values.tip === "pravno") {
      Object.keys(firmValidators).forEach(field => {
        const valid = firmValidators[field](values[field]);
        if (valid !== true) errors[field] = valid;
      });
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!validateForm()) {
      setError("Molimo ispravite označena polja.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "orders"), {
        ...values,
        cart,
        createdAt: serverTimestamp(),
        status: "primljeno"
      });
      setSuccess(true);
      clearCart();
    } catch {
      setError("Greška pri slanju narudžbine.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="relative max-w-5xl sm:w-full mx-3 sm:mx-auto bg-gradient-to-br from-slate-50 to-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden py-8 px-4 sm:px-8 mt-8 mb-16"
      variants={containerVariant}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-3xl md:text-4xl font-extrabold text-bluegreen mb-5 text-center drop-shadow-sm tracking-tight">
        <span className="inline-flex items-center gap-2">
          <Building2 className="w-7 h-7 text-bluegreen drop-shadow" />
          Placanje
        </span>
      </h2>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center min-h-[120px] text-center"
          >
            <CheckCircle className="w-12 h-12 text-green-500 mb-3 animate-bounce" />
            <div className="text-lg font-semibold text-green-700 mb-2">
              Hvala na narudžbini! Potvrda je poslata.
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            className="flex flex-col flex-wrap gap-8 mx-5"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            onSubmit={handleSubmit}
            noValidate
            autoComplete="off"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatedSelect
                value={values.tip}
                onChange={handleChange}
                name="tip"
                label="Tip korisnika"
                required
                options={kupacOptions}
                error={fieldErrors.tip}
                helperText="Odaberite tip naloga za naplatu."
                withSearch
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatedInput
                label="Ime"
                name="ime"
                required
                icon={User}
                value={values.ime}
                error={touched.ime && fieldErrors.ime}
                onChange={handleChange}
                onBlur={() => validateField("ime")}
             />
              <AnimatedInput
                label="Prezime"
                name="prezime"
                required
                icon={User}
                value={values.prezime}
                error={touched.prezime && fieldErrors.prezime}
                onChange={handleChange}
                onBlur={() => validateField("prezime")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatedInput
                label="Adresa"
                name="adresa"
                required
                icon={Home}
                value={values.adresa}
                error={touched.adresa && fieldErrors.adresa}
                onChange={handleChange}
                onBlur={() => validateField("adresa")}
              />
              <AnimatedInput
                label="Grad"
                name="grad"
                required
                icon={MapPin}
                value={values.grad}
                error={touched.grad && fieldErrors.grad}
                onChange={handleChange}
                onBlur={() => validateField("grad")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatedInput
                label="Email"
                name="email"
                required
                icon={Mail}
                type="email"
                value={values.email}
                error={touched.email && fieldErrors.email}
                onChange={handleChange}
                onBlur={() => validateField("email")}
              />
              <AnimatedInput
                label="Telefon"
                name="telefon"
                required
                icon={Phone}
                value={values.telefon}
                error={touched.telefon && fieldErrors.telefon}
                onChange={handleChange}
                onBlur={() => validateField("telefon")}
              />
            </div>

            {values.tip === "pravno" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AnimatedInput
                  label="Naziv firme"
                  name="firma"
                  required
                  icon={Building2}
                  value={values.firma}
                  error={touched.firma && fieldErrors.firma}
                  onChange={handleChange}
                  onBlur={() => validateField("firma")}
                />
                <AnimatedInput
                  label="PIB"
                  name="pib"
                  required
                  icon={Barcode}
                  value={values.pib}
                  error={touched.pib && fieldErrors.pib}
                  onChange={handleChange}
                  onBlur={() => validateField("pib")}
                />
                <AnimatedInput
                  label="Matični broj"
                  name="matbr"
                  required
                  icon={Hash}
                  value={values.matbr}
                  error={touched.matbr && fieldErrors.matbr}
                  onChange={handleChange}
                  onBlur={() => validateField("matbr")}
                />
              </div>
            )}

            <AnimatePresence>
              {(!!error) && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="bg-red-50 border border-red-200 rounded-xl py-2 px-4 flex items-center gap-2 text-red-600 font-medium shadow"
                >
                  <AlertTriangle className="w-5 h-5" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02, boxShadow: "0px 6px 32px -8px rgba(36,180,190,0.18)" }}
              disabled={loading}
              className="relative my-2 mx-auto w-full md:w-7/12 text-lg py-3 rounded-xl font-bold tracking-tight bg-gradient-to-r from-bluegreen to-sheen text-white shadow-md hover:shadow-lg transition duration-200 focus:outline-none disabled:opacity-70"
            >
              {loading ? (
                <span>Slanje...</span>
              ) : (
                <span>Pošalji narudžbinu</span>
              )}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
      {/* Animirane pozadiske dekoracije */}
      <motion.span
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.08, 1], y: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[-80px] top-[-60px] w-52 h-52 rounded-full bg-sheen/10 blur-2xl"
      />
      <motion.span
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.18, 1], x: [0, 20, 0] }}
        transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[-60px] bottom-[-80px] w-40 h-40 rounded-full bg-bluegreen/10 blur-2xl"
      />
    </motion.div>
  );
}