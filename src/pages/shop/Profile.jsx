// src/pages/shop/Profile.jsx
// Profilna stranica korisnika
// Prikazuje informacije o korisniku, narudžbine, opcije za izmenu profila, verifikaciju itd.
// Koristi Firebase za autentifikaciju i Firestore za podatke
// Stilizovana sa Tailwind CSS
// Responsive i pristupačna
// Koristi komponente iz /components i hook iz /hooks
// Animacije sa Framer Motion
// Ikonice iz lucide-react
// Koristi modale za osetljive akcije (brisanje naloga, reset lozinke, detalji narudžbine, verifikacija telefona)
import { useState, useEffect } from "react";
import { useUserData } from "../../hooks/useUserData";
import { updateUserProfile, uploadProfileImage } from "../../utils/userService";
import { collection, query, where, getDocs, or } from "firebase/firestore";
import { db, auth } from "../../utils/firebase";
import { sendEmailVerification } from "firebase/auth";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  Pen,
  Settings,
  Upload,
  LogOut,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  ReceiptText,
  Home,
} from "lucide-react";
import Loader from "../../components/Loader";
import ProgressiveImage from "../../components/UI/ProgressiveImage";
import StatusBadge from "../../components/shop/StatusBadge";
import { useNavigate } from "react-router-dom";
import DeleteAccountModal from "../../components/shop/DeleteAccountModal";
import PasswordResetModal from "../../components/shop/PasswordResetModal";
import OrderDetailsModal from "../../components/shop/OrderDetailsModal";
import PhoneVerifyModal from "../../components/shop/PhoneVerifyModal";

// Helperi
function srRsd(n) {
  return n.toLocaleString("sr-RS") + " RSD";
}
function srDate(ts) {
  const date = ts?.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleString("sr-RS");
}

// Floating Label Input (koristi se u edit profilu)
const FloatingLabelInput = ({ label, value, onChange, className = "" }) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;
  return (
    <div className={`relative ${className}`}>
      <motion.label
        className={`absolute left-3 transition-all duration-300 pointer-events-none 
        ${
          focused || hasValue
            ? "top-[-6px] text-xs px-1 bg-white text-bluegreen font-semibold z-20"
            : "top-1/2 -translate-y-1/2 text-gray-400 text-base"
        }`}
        animate={{
          y: focused || hasValue ? -12 : 0,
          scale: focused || hasValue ? 0.91 : 1,
        }}
        transition={{ duration: 0.18, ease: "easeInOut" }}
        style={{ background: focused || hasValue ? "#fff" : "transparent" }}
      >
        {label}
      </motion.label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/90 backdrop-blur-sm
        focus:border-bluegreen focus:ring-2 focus:ring-bluegreen/20 focus:outline-none
        transition-all duration-200 text-gray-800 font-medium shadow-sm hover:shadow-md
        ${focused || hasValue ? "pt-3" : ""}`}
        placeholder={focused || hasValue ? "" : label}
        autoComplete="off"
      />
    </div>
  );
};

// Animirani status badge
const VerificationBadge = ({ verified, type, value, onClick }) => {
  let badgeIcon, badgeText, badgeSub, badgeColor;
  if (type === "email") {
    badgeIcon = (
      <Mail
        size={16}
        className={verified ? "text-green-600" : "text-gray-400"}
      />
    );
    badgeText = verified ? "E-mail verifikovan" : "E-mail nije verifikovan";
    badgeSub = value;
    badgeColor = verified
      ? "bg-green-100 border-green-200 text-green-800"
      : "bg-red-100 border-red-200 text-red-800";
  } else if (type === "phone") {
    badgeIcon = (
      <Phone
        size={15}
        className={verified ? "text-green-600" : "text-gray-400"}
      />
    );
    badgeText = verified ? "Telefon verifikovan" : "Telefon nije verifikovan";
    badgeSub = value ? value : "Nema broja";
    badgeColor = verified
      ? "bg-green-100 border-green-200 text-green-800"
      : "bg-yellow-100 border-yellow-200 text-yellow-700";
  }
  return (
    <motion.div
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", duration: 0.68 }}
      className={`inline-flex items-center border px-3 py-1 rounded-xl gap-2 text-xs font-semibold shadow-sm ${badgeColor} mr-2 mb-1 min-w-[161px] cursor-pointer`}
      onClick={onClick}
    >
      {badgeIcon}
      <span>{badgeText}</span>
      <span className="ml-2 px-2 py-0.5 bg-white rounded text-gray-500 font-normal">
        {badgeSub}
      </span>
      {verified ? (
        <ShieldCheck size={16} className="ml-1 text-green-500 animate-bounce" />
      ) : (
        <AlertTriangle
          size={14}
          className="ml-1 text-yellow-500 animate-pulse"
        />
      )}
    </motion.div>
  );
};

export default function Profile() {
  const { user, userData, loading, refreshUserData } = useUserData();
  const [orders, setOrders] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [passwordResetModalOpen, setPasswordResetModalOpen] = useState(false);
  const navigate = useNavigate();
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Provera da li je korisnik dovoljno verifikovan (email ILI telefon)
  const isUserVerified = user && (user.emailVerified || !!user.phoneNumber);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      // Pretpostavljam da user.email i user.phoneNumber mogu postojati ili jedan ili oba
      const conditions = [];
      if (user?.email) conditions.push(where("email", "==", user.email));
      if (user?.phoneNumber)
        conditions.push(where("telefon", "==", user.phoneNumber));

      // Postavi Firestore upit sa OR logikom
      const q = query(collection(db, "orders"), or(...conditions));
      const snaps = await getDocs(q);
      const sorted = snaps.docs
        .map((d) => d.data())
        .sort((a, b) => {
          const ta = a.createdAt?.seconds || 0;
          const tb = b.createdAt?.seconds || 0;
          return tb - ta;
        });
      setOrders(sorted);
    };
    fetchOrders();
  }, [user]);

  useEffect(() => {
    if (userData) setEditData(userData);
  }, [userData]);

  // Save edit profile
  const handleSave = async () => {
    await updateUserProfile(user.uid, editData);
    setEditMode(false);
    await refreshUserData();
  };

  // Upload avatar
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      await uploadProfileImage(user.uid, file);
      await refreshUserData();
    } catch (error) {
      console.error("Greška pri upload-u slike:", error);
    }
    setUploadingImage(false);
  };

  // PROMENJENA LOGIKA: Zahteva email ILI telefon verifikaciju (ne oba)
  if (loading) return <Loader />;
  if (!user)
    return <div className="text-center mt-10">Morate biti prijavljeni.</div>;

  // Ako korisnik nema ni email ni telefon verifikovan
  if (!isUserVerified) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto mt-24 bg-white/90 backdrop-blur-2xl text-center shadow-2xl border border-red-300 rounded-3xl p-8"
      >
        <div className="flex justify-center gap-4 mb-5">
          <Mail size={42} className="text-red-500 animate-pulse" />
          <Phone size={42} className="text-yellow-500 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-red-700">
          Potrebna je verifikacija!
        </h2>
        <p className="mb-6 text-lg text-gray-600">
          Da biste nastavili, potrebno je da verifikujete svoj e-mail{" "}
          <strong>ili</strong> broj telefona.
        </p>

        {/* Email verifikacija sekcija */}
        <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">
            E-mail verifikacija
          </h3>
          {emailSent ? (
            <div className="text-green-600 font-semibold mb-4">
              Verifikacioni email je poslat! Proverite vašu poštu.
            </div>
          ) : (
            <motion.button
              onClick={async () => {
                await sendEmailVerification(user);
                setEmailSent(true);
              }}
              whileHover={{ scale: 1.05, backgroundColor: "#0891b2" }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-bluegreen text-white font-bold rounded-lg shadow-lg mb-4 transition-all"
            >
              Pošalji verifikacioni email
            </motion.button>
          )}
        </div>

        {/* Telefon verifikacija sekcija */}
        <div className="mb-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">
            Telefon verifikacija
          </h3>
          <motion.button
            onClick={() => setPhoneModalOpen(true)}
            whileHover={{ scale: 1.05, backgroundColor: "#d97706" }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-yellow-600 text-white font-bold rounded-lg shadow-lg transition-all"
          >
            Verifikuj broj telefona
          </motion.button>
        </div>

        <div className="text-base text-gray-500">
          Nakon verifikacije bilo kog načina, osvežite stranicu ili se ponovo
          prijavite.
        </div>

        {/* Phone verify modal */}
        <PhoneVerifyModal
          open={phoneModalOpen}
          onClose={() => setPhoneModalOpen(false)}
          user={user}
          onSuccess={async () => {
            setPhoneModalOpen(false);
            await refreshUserData();
            // Nakon uspešne verifikacije telefona, korisnik može pristupiti profilu
          }}
        />
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-2 sm:mx-auto bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-4 sm:p-6 lg:p-14 my-6 sm:my-10 font-sans relative overflow-hidden"
      >
        {/* Profile header */}
        <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12">
          {/* Avatar */}
          <motion.div className="relative flex-shrink-0">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44">
              <motion.img
                src={userData?.photoURL || "/default-avatar.png"}
                alt="Profilna"
                className="w-full h-full object-cover rounded-full border-4 border-bluegreen shadow-xl bg-white/90"
              />
              {uploadingImage && (
                <motion.div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center z-10">
                  <div className="text-white text-sm font-semibold">
                    Uploadujem...
                  </div>
                </motion.div>
              )}
              <motion.label className="absolute bottom-2 right-2 bg-bluegreen text-white p-2.5 sm:p-3 rounded-full cursor-pointer border-4 border-white shadow-lg z-20">
                <Upload size={18} className="sm:w-5 sm:h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </motion.label>
            </div>
          </motion.div>

          {/* User Info */}
          <div className="flex-1 min-w-0 w-full lg:w-auto text-center lg:text-left">
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* Name and Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center lg:justify-start">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 break-words">
                  {userData?.ime} {userData?.prezime}
                  <span className="block sm:inline ml-0 sm:ml-2 text-bluegreen text-lg sm:text-xl font-mono">
                    @{userData?.username}
                  </span>
                </h2>
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => setEditMode((v) => !v)}
                    className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <Pen size={20} className="text-bluegreen" />
                  </motion.button>
                  <motion.button
                    onClick={() => setSettingsOpen((v) => !v)}
                    className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <Settings size={20} className="text-gray-600" />
                  </motion.button>
                </div>
              </div>

              {/* Mail, telefon, adresa */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 sm:gap-6 text-base sm:text-lg text-gray-700 justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <Mail className="w-6 h-6 text-bluegreen flex-shrink-0" />
                  <span className="break-all">{userData?.email}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 sm:gap-8 text-gray-600 justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <Phone size={20} className="text-bluegreen flex-shrink-0" />
                  <span>
                    {userData?.telefon || user?.phoneNumber || "Nije unet"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Home size={20} className="text-bluegreen flex-shrink-0" />
                  <span>{userData?.adresa || "Nije uneta"}</span>
                </div>
              </div>
            </div>

            {/* STATUS BADGE - EMAIL i TELEFON */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center lg:justify-start">
              <VerificationBadge
                verified={user?.emailVerified || false}
                type="email"
                value={userData?.email}
                onClick={() =>
                  !user?.emailVerified && sendEmailVerification(user)
                }
              />
              <VerificationBadge
                verified={!!user?.phoneNumber}
                type="phone"
                value={user?.phoneNumber || userData?.telefon}
                onClick={() => !user?.phoneNumber && setPhoneModalOpen(true)}
              />
              {!user?.phoneNumber && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPhoneModalOpen(true)}
                  className="text-xs font-semibold text-yellow-600 bg-yellow-100 border border-yellow-300 px-4 py-2 rounded-xl shadow ml-2"
                >
                  Poveži/verifikuj telefon — koristi za prijavu!
                </motion.button>
              )}

              {/* Dugmad za verifikaciju (samo ako nisu verifikovani) */}
              {!user?.emailVerified && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={async () => {
                    await sendEmailVerification(user);
                    setEmailSent(true);
                  }}
                  className="text-xs font-semibold text-blue-600 bg-blue-100 border border-blue-300 px-4 py-2 rounded-xl shadow ml-2"
                >
                  Verifikuj email
                </motion.button>
              )}

              {!user?.phoneNumber && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPhoneModalOpen(true)}
                  className="text-xs font-semibold text-yellow-600 bg-yellow-100 border border-yellow-300 px-4 py-2 rounded-xl shadow ml-2"
                >
                  Verifikuj telefon
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Edit Mode */}
        <AnimatePresence>
          {editMode && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 my-8"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Pen size={20} className="text-bluegreen" />
                Izmeni profil
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FloatingLabelInput
                  label="Ime"
                  value={editData.ime || ""}
                  onChange={(e) =>
                    setEditData((s) => ({ ...s, ime: e.target.value }))
                  }
                />
                <FloatingLabelInput
                  label="Prezime"
                  value={editData.prezime || ""}
                  onChange={(e) =>
                    setEditData((s) => ({ ...s, prezime: e.target.value }))
                  }
                />
                <FloatingLabelInput
                  label="Korisničko ime"
                  value={editData.username || ""}
                  onChange={(e) =>
                    setEditData((s) => ({ ...s, username: e.target.value }))
                  }
                />
                <FloatingLabelInput
                  label="Telefon"
                  value={editData.telefon || ""}
                  onChange={(e) =>
                    setEditData((s) => ({ ...s, telefon: e.target.value }))
                  }
                />
                <FloatingLabelInput
                  label="Adresa"
                  value={editData.adresa || ""}
                  onChange={(e) =>
                    setEditData((s) => ({ ...s, adresa: e.target.value }))
                  }
                  className="sm:col-span-2"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <motion.button
                  onClick={handleSave}
                  className="px-8 py-3 bg-bluegreen text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Sačuvaj promene
                </motion.button>
                <motion.button
                  onClick={() => setEditMode(false)}
                  className="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all"
                >
                  Otkaži
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Orders Section */}
        <motion.div
          className="mt-8 sm:mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="font-bold text-2xl sm:text-3xl mb-6 flex items-center gap-3">
            <ReceiptText size={28} className="text-bluegreen" />
            Vaše narudžbine
          </h3>

          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center text-gray-500 py-12 bg-white/80 rounded-xl shadow-lg"
            >
              <AlertTriangle
                size={48}
                className="mx-auto mb-4 text-bluegreen/60"
              />
              <p className="text-lg font-medium">Nema narudžbina.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 md:auto-rows-fr">
              {orders.map((order, idx) => (
                <motion.div
                  key={order.createdAt?.seconds || idx}
                  className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-gray-100 cursor-pointer flex flex-col h-full"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  onClick={() => {
                    setSelectedOrder(order);
                    setOrderModalOpen(true);
                  }}
                  whileHover={{
                    scale: 1.02,
                    y: -8,
                    boxShadow: "0 20px 40px rgba(34, 211, 238, 0.15)",
                    borderColor: "#22d3ee",
                  }}
                  layout
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500 font-medium">
                      {srDate(order.createdAt)}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="space-y-3 mb-4 md:max-h-56 md:overflow-y-auto custom-scrollbar">
                    {order.cart.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <ProgressiveImage
                          src={product.imgUrl}
                          alt={product.name}
                          className="w-14 h-14 rounded-xl object-cover shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-800 truncate">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {srRsd(product.price)} × {product.qty}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 flex justify-between items-center mt-auto">
                    <span className="font-semibold text-gray-700">Ukupno:</span>
                    <span className="font-bold text-bluegreen text-lg">
                      {srRsd(
                        order.cart.reduce((a, p) => a + p.price * p.qty, 0)
                      )}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
      {/* Modali */}
      {/* Settings Modal */}
      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSettingsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Settings size={22} className="text-bluegreen" />
                Podešavanja profila
              </h3>
              <div className="space-y-3">
                <motion.button
                  onClick={() => {
                    setSettingsOpen(false);
                    setPasswordResetModalOpen(true);
                  }}
                  className="flex gap-3 items-center w-full px-5 py-3 bg-blue-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02, backgroundColor: "#3b82f6" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShieldCheck size={18} />
                  Promeni lozinku
                </motion.button>
                <motion.button
                  onClick={() => {
                    setSettingsOpen(false);
                    setDeleteModalOpen(true);
                  }}
                  className="flex gap-3 items-center w-full px-5 py-3 bg-red-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02, backgroundColor: "#dc2626" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Trash2 size={18} />
                  Obriši nalog
                </motion.button>
                <motion.button
                  onClick={async () => {
                    await auth.signOut();
                    setSettingsOpen(false);
                    navigate("/prodavnica/prijava");
                  }}
                  className="flex gap-3 items-center w-full px-5 py-3 bg-gray-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02, backgroundColor: "#6b7280" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut size={18} />
                  Odjavi se
                </motion.button>
              </div>
              <button
                onClick={() => setSettingsOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onSuccess={() => {
          navigate("/");
        }}
      />

      {/* Password Reset Modal */}
      <PasswordResetModal
        isOpen={passwordResetModalOpen}
        onClose={() => setPasswordResetModalOpen(false)}
      />
      {/* Modal za phone auth */}
      <PhoneVerifyModal
        open={phoneModalOpen}
        onClose={() => setPhoneModalOpen(false)}
        user={user}
        onSuccess={async () => {
          setPhoneModalOpen(false);
          await refreshUserData();
        }}
      />
      <OrderDetailsModal
        open={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        order={selectedOrder}
      />
    </>
  );
}
