import { useState, useEffect } from "react";
import { useUserData } from "../../hooks/useUserData";
import { updateUserProfile, uploadProfileImage } from "../../utils/userService";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db,auth } from "../../utils/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Home, ReceiptText, AlertTriangle, CreditCard, Settings, Pen, Upload, LogOut, Trash2, ShieldCheck } from "lucide-react";
import Loader from "../../components/Loader";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sparkles } from "@react-three/drei";
import ProgressiveImage from "../../components/UI/ProgressiveImage";
import StatusBadge from "../../components/shop/StatusBadge";
import { useNavigate } from "react-router-dom";
import DeleteAccountModal from "../../components/shop/DeleteAccountModal";
import PasswordResetModal from "../../components/shop/PasswordResetModal";
import OrderDetailsModal from "../../components/shop/OrderDetailsModal";

function srRsd(n) { return n.toLocaleString("sr-RS") + " RSD"; }
function srDate(ts) {
  const date = ts?.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleString("sr-RS");
}

// Floating Label Input Component
// Floating Label Input Component (uvek ima placeholder dok je prazno)
const FloatingLabelInput = ({ label, value, onChange, className = "" }) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;
  
  return (
    <div className={`relative ${className}`}>
      <motion.label
        className={`absolute left-3 transition-all duration-300 pointer-events-none 
          ${focused || hasValue
            ? 'top-[-6px] text-xs px-1 bg-white text-bluegreen font-semibold z-20'
            : 'top-1/2 -translate-y-1/2 text-gray-400 text-base'
          }`}
        animate={{
          y: focused || hasValue ? -12 : 0,
          scale: focused || hasValue ? 0.91 : 1,
        }}
        transition={{ duration: 0.18, ease: "easeInOut" }}
        style={{background: focused || hasValue ? "#fff" : "transparent"}}
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

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      const q = query(collection(db, "orders"), where("email", "==", user.email));
      const snaps = await getDocs(q);
      // sortiraj po createdAt, najnoviji prvo
      const sorted = snaps.docs
        .map(d => d.data())
        .sort((a, b) => {
          const ta = a.createdAt?.seconds || 0;
          const tb = b.createdAt?.seconds || 0;
          return tb - ta; // descending
        });
      setOrders(sorted);
    };
    fetchOrders();
  }, [user]);

  useEffect(() => {
    if (userData) setEditData(userData);
  }, [userData]);

  const handleSave = async () => {
    await updateUserProfile(user.uid, editData);
    setEditMode(false);
    await refreshUserData();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      await uploadProfileImage(user.uid, file);
      await refreshUserData();
    } catch (error) {
      console.error('Greška pri upload-u slike:', error);
    }
    setUploadingImage(false);
  };

  if (loading) return <Loader />;
  if (!user) return <div className="text-center mt-10">Morate biti prijavljeni.</div>;

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-7xl mx-auto bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-4 sm:p-6 lg:p-14 my-6 sm:my-10 font-sans relative overflow-hidden"
    >

      {/* Profile Header - Fully Responsive */}
      <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12 relative z-10">
        {/* Profile Image */}
        <motion.div 
          className="relative flex-shrink-0"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44">
            <motion.img
              src={userData?.photoURL || '/default-avatar.png'}
              alt="Profilna"
              className="w-full h-full object-cover rounded-full border-4 border-bluegreen shadow-xl bg-white/90"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(34, 211, 238, 0.3)",
                borderColor: "#0891b2"
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
            {uploadingImage && (
              <motion.div
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center z-10"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-white text-sm font-semibold">Uploadujem...</div>
              </motion.div>
            )}
            <motion.label 
              className="absolute bottom-2 right-2 bg-bluegreen text-white p-2.5 sm:p-3 rounded-full cursor-pointer border-4 border-white shadow-lg z-20"
              whileHover={{ scale: 1.1, backgroundColor: "#0891b2" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Upload size={18} className="sm:w-5 sm:h-5"/>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden"/>
            </motion.label>
          </div>
        </motion.div>

        {/* User Info - Responsive Text */}
        <div className="flex-1 min-w-0 w-full lg:w-auto text-center lg:text-left">
          <motion.div 
            className="flex flex-col gap-3 sm:gap-4"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
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
                  onClick={() => setEditMode(v => !v)}
                  className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Pen size={20} className="text-bluegreen"/>
                </motion.button>
                <motion.button
                  onClick={() => setSettingsOpen(v => !v)}
                  className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Settings size={20} className="text-gray-600"/>
                </motion.button>
              </div>
            </div>

            {/* Contact Info - Better Contrast & Spacing */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 sm:gap-6 text-base sm:text-lg text-gray-700 justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <Mail className="w-6 h-6 text-bluegreen flex-shrink-0"/> 
                <span className="break-all">{userData?.email}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 sm:gap-8 text-gray-600 justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <Phone size={20} className="text-bluegreen flex-shrink-0"/>
                <span>{userData?.telefon || "Nije unet"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Home size={20} className="text-bluegreen flex-shrink-0"/>
                <span>{userData?.adresa || "Nije uneta"}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-green-500 flex-shrink-0"/>
                <span className="text-sm">
                  {user?.emailVerified ? "Verifikovan" : "Nije verifikovan"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Edit Mode - Floating Labels */}
      <AnimatePresence>
        {editMode && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 my-8"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Pen size={20} className="text-bluegreen"/>
              Izmeni profil
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FloatingLabelInput
                label="Ime"
                value={editData.ime || ''}
                onChange={e => setEditData(s => ({...s, ime: e.target.value}))}
                placeholder="Unesite vaše ime"
              />
              <FloatingLabelInput
                label="Prezime"
                value={editData.prezime || ''}
                onChange={e => setEditData(s => ({...s, prezime: e.target.value}))}
                placeholder="Unesite vaše prezime"
              />
              <FloatingLabelInput
                label="Korisničko ime"
                value={editData.username || ''}
                onChange={e => setEditData(s => ({...s, username: e.target.value}))}
                placeholder="Unesite korisničko ime"
              />
              <FloatingLabelInput
                label="Telefon"
                value={editData.telefon || ''}
                onChange={e => setEditData(s => ({...s, telefon: e.target.value}))}
                placeholder="Unesite broj telefona"
              />
              <FloatingLabelInput
                label="Adresa"
                value={editData.adresa || ''}
                onChange={e => setEditData(s => ({...s, adresa: e.target.value}))}
                placeholder="Unesite vašu adresu"
                className="sm:col-span-2"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <motion.button 
                onClick={handleSave}
                className="px-8 py-3 bg-bluegreen text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02, backgroundColor: "#0891b2" }}
                whileTap={{ scale: 0.98 }}
              >
                Sačuvaj promene
              </motion.button>
              <motion.button 
                onClick={() => setEditMode(false)}
                className="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Otkaži
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Settings size={22} className="text-bluegreen"/>
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
            <ShieldCheck size={18}/>
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
            <Trash2 size={18}/>
            Obriši nalog
          </motion.button>
          <motion.button 
            onClick={() => {
              // Add logout functionality
              auth.signOut();
              setSettingsOpen(false);
            }}
            className="flex gap-3 items-center w-full px-5 py-3 bg-gray-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
            whileHover={{ scale: 1.02, backgroundColor: "#6b7280" }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut size={18}/>
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
          // Handle successful account deletion
          navigate('/');
        }}
      />

      {/* Password Reset Modal */}
      <PasswordResetModal 
        isOpen={passwordResetModalOpen}
        onClose={() => setPasswordResetModalOpen(false)}
      />

      {/* Orders Section */}
      <motion.div 
        className="mt-8 sm:mt-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="font-bold text-2xl sm:text-3xl mb-6 flex items-center gap-3">
          <ReceiptText size={28} className="text-bluegreen"/>
          Vaše narudžbine
        </h3>
        
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-500 py-12 bg-white/80 rounded-xl shadow-lg"
          >
            <AlertTriangle size={48} className="mx-auto mb-4 text-bluegreen/60"/>
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
                  borderColor: "#22d3ee"
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
                  {order.cart.map(product => (
                    <div key={product.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <ProgressiveImage 
                        src={product.imgUrl} 
                        alt={product.name}
                        className="w-14 h-14 rounded-xl object-cover shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 truncate">{product.name}</div>
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
                    {srRsd(order.cart.reduce((a, p) => a + p.price * p.qty, 0))}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
    <OrderDetailsModal open={orderModalOpen} onClose={() => setOrderModalOpen(false)} order={selectedOrder} />
    </>
  );
}
