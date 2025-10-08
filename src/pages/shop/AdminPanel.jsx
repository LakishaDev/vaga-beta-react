// src/pages/shop/AdminPanel.jsx
// Admin panel za upravljanje proizvodima
// Omogućava dodavanje, izmenu i brisanje proizvoda
// Pristup je ograničen na email-ove navedene u .env fajlu (VITE_ADMIN_EMAILS)
// Koristi Firebase Firestore za skladištenje podataka o proizvodima
// Koristi Firebase Storage za čuvanje slika proizvoda
// Uključuje 3D animacije za dugmad i interaktivne elemente
// Responsive dizajn za desktop i mobilne uređaje
// Koristi SnackbarContext za prikaz notifikacija
// Upravlja stanjem proizvoda, forme i modala pomoću useState i useEffect
// Funkcije za dodavanje, izmenu i brisanje proizvoda su asinhrone i koriste Firebase API
// Uključuje potvrdu pre brisanja proizvoda
// Prikazuje progres bar tokom upload-a slika
import { useState, useContext, useEffect } from "react";
import { db, storage, auth } from "../../utils/firebase.js";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { SnackbarContext } from "../../contexts/snackbar/SnackbarContext.jsx";
import FloatingLabelInput from "../../components/UI/FloatingLabelInput.jsx";
import ProgressiveImage from "../../components/UI/ProgressiveImage.jsx";
import { FiUpload, FiX, FiPlus, FiTrash2, FiFile } from "react-icons/fi";
import { motion as Motion, AnimatePresence } from "framer-motion";

export default function AdminPanel() {
  const { showSnackbar } = useContext(SnackbarContext);
  const [allowed, setAllowed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [editUploadProgress, setEditUploadProgress] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null); // za mobile modal

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    hasHiddenPrice: false,
    imgFile: null,
    imgPreview: null,
    images: [], // Multiple images
    features: [], // Array of feature objects
    datasheets: [], // Array of datasheet files
  });

  const [products, setProducts] = useState([]);

  // Provera autentikacije
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const adminEmails =
        import.meta.env.VITE_ADMIN_EMAILS?.split(",").map((e) => e.trim()) ||
        [];
      setAllowed(user && adminEmails.includes(user.email));
    });
    return () => unsubscribe();
  }, []);

  // Učitaj proizvode
  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    setProducts(
      querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };
  useEffect(() => {
    if (allowed) fetchProducts();
  }, [allowed]);

  if (allowed === null)
    return <div className="text-center mt-10 text-xl">Učitavanje...</div>;
  if (allowed === false)
    return (
      <div className="text-red-600 font-bold text-xl mt-10 text-center">
        Pristup odbijen
      </div>
    );

  // Format cene sa separatorom za hiljade
  const formatPrice = (price) => {
    return new Intl.NumberFormat("sr-RS").format(price);
  };

  // Unos i upload slike
  const handleChange = (e) =>
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  const handleFile = (e) => {
    const file = e.target.files[0];
    setNewProduct({
      ...newProduct,
      imgFile: file,
      imgPreview: file ? URL.createObjectURL(file) : null,
    });
  };

  // Handle multiple images
  const handleMultipleImages = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setNewProduct({
      ...newProduct,
      images: [...newProduct.images, ...newImages]
    });
  };

  const removeImage = (index) => {
    const updated = [...newProduct.images];
    updated.splice(index, 1);
    setNewProduct({ ...newProduct, images: updated });
  };

  // Handle features
  const addFeature = () => {
    setNewProduct({
      ...newProduct,
      features: [...newProduct.features, { label: "", value: "" }]
    });
  };

  const updateFeature = (index, field, value) => {
    const updated = [...newProduct.features];
    updated[index][field] = value;
    setNewProduct({ ...newProduct, features: updated });
  };

  const removeFeature = (index) => {
    const updated = [...newProduct.features];
    updated.splice(index, 1);
    setNewProduct({ ...newProduct, features: updated });
  };

  // Handle datasheets
  const handleDatasheets = (e) => {
    const files = Array.from(e.target.files);
    const newDatasheets = files.map(file => ({
      file,
      name: file.name
    }));
    setNewProduct({
      ...newProduct,
      datasheets: [...newProduct.datasheets, ...newDatasheets]
    });
  };

  const removeDatasheet = (index) => {
    const updated = [...newProduct.datasheets];
    updated.splice(index, 1);
    setNewProduct({ ...newProduct, datasheets: updated });
  };

  // Simulacija upload progresa
  const simulateUpload = (setProgress) => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 30;
      });
    }, 100);
  };

  // Dodavanje proizvoda sa 3D animacijom
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 3D animacija dugmeta
    e.target.style.transform = "perspective(1000px) rotateX(20deg) scale(0.95)";
    setTimeout(() => {
      if (e.target) e.target.style.transform = "";
    }, 200);

    let imgUrl = "";
    const imageUrls = [];
    const datasheetUrls = [];
    
    try {
      // Upload main image
      if (newProduct.imgFile) {
        simulateUpload(setUploadProgress);
        const storageRef = ref(
          storage,
          `products/${Date.now()}_${newProduct.imgFile.name}`
        );
        await uploadBytes(storageRef, newProduct.imgFile);
        imgUrl = await getDownloadURL(storageRef);
      }

      // Upload additional images
      for (const img of newProduct.images) {
        const storageRef = ref(
          storage,
          `products/${Date.now()}_${img.file.name}`
        );
        await uploadBytes(storageRef, img.file);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }

      // Upload datasheets
      for (const ds of newProduct.datasheets) {
        const storageRef = ref(
          storage,
          `datasheets/${Date.now()}_${ds.file.name}`
        );
        await uploadBytes(storageRef, ds.file);
        const url = await getDownloadURL(storageRef);
        datasheetUrls.push({
          name: ds.file.name,
          url: url
        });
      }

      await addDoc(collection(db, "products"), {
        name: newProduct.name,
        category: newProduct.category,
        price: newProduct.hasHiddenPrice ? null : Number(newProduct.price),
        hiddenPrice: newProduct.hasHiddenPrice
          ? Number(newProduct.price)
          : null,
        imgUrl,
        images: imageUrls,
        features: newProduct.features,
        datasheets: datasheetUrls,
        createdAt: new Date(),
      });

      showSnackbar("Proizvod uspešno dodat!", "success");
      setNewProduct({
        name: "",
        category: "",
        price: "",
        imgFile: null,
        imgPreview: null,
        images: [],
        features: [],
        datasheets: [],
      });
      setUploadProgress(0);
      fetchProducts();
    } catch (error) {
      console.error(error);
      showSnackbar("Greška pri dodavanju proizvoda.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Potvrda brisanja
  const confirmDelete = (product) => setDeleteConfirm(product);
  const cancelDelete = () => setDeleteConfirm(null);

  // Brisanje proizvoda sa animacijom
  const handleDelete = async (id) => {
    try {
      const element = document.querySelector(`[data-product-id="${id}"]`);
      if (element) {
        element.style.transform = "scale(0.8) rotateX(90deg)";
        element.style.opacity = "0";
        element.style.transition =
          "all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
      }

      setTimeout(async () => {
        await deleteDoc(doc(db, "products", id));
        showSnackbar("Proizvod uspešno obrisan!", "success");
        fetchProducts();
        setDeleteConfirm(null);
        setSelectedProduct(null); // zatvori modal ako je otvoren
      }, 500);
    } catch {
      showSnackbar("Greška pri brisanju proizvoda.", "error");
    }
  };

  // Edit funkcije
  const handleEditOpen = (product) =>
    setEditProduct({
      ...product,
      hasHiddenPrice: !!product.hiddenPrice,
      price: product.hiddenPrice || product.price,
      imgPreview: product.imgUrl,
      images: product.images || [],
      newImages: [],
      features: product.features || [],
      datasheets: product.datasheets || [],
      newDatasheets: [],
    });

  const handleEditClose = () => {
    setEditProduct(null);
    setEditUploadProgress(0);
    setSelectedProduct(null); // zatvori i product modal
  };

  const handleEditChange = (e) =>
    setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
  const handleEditFile = (e) => {
    const file = e.target.files[0];
    setEditProduct({
      ...editProduct,
      imgFile: file,
      imgPreview: file ? URL.createObjectURL(file) : editProduct.imgUrl,
    });
  };

  // Edit handlers for multiple images
  const handleEditMultipleImages = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setEditProduct({
      ...editProduct,
      newImages: [...(editProduct.newImages || []), ...newImages]
    });
  };

  const removeEditImage = (index, isNew) => {
    if (isNew) {
      const updated = [...editProduct.newImages];
      updated.splice(index, 1);
      setEditProduct({ ...editProduct, newImages: updated });
    } else {
      const updated = [...editProduct.images];
      updated.splice(index, 1);
      setEditProduct({ ...editProduct, images: updated });
    }
  };

  // Edit handlers for features
  const addEditFeature = () => {
    setEditProduct({
      ...editProduct,
      features: [...editProduct.features, { label: "", value: "" }]
    });
  };

  const updateEditFeature = (index, field, value) => {
    const updated = [...editProduct.features];
    updated[index][field] = value;
    setEditProduct({ ...editProduct, features: updated });
  };

  const removeEditFeature = (index) => {
    const updated = [...editProduct.features];
    updated.splice(index, 1);
    setEditProduct({ ...editProduct, features: updated });
  };

  // Edit handlers for datasheets
  const handleEditDatasheets = (e) => {
    const files = Array.from(e.target.files);
    const newDatasheets = files.map(file => ({
      file,
      name: file.name
    }));
    setEditProduct({
      ...editProduct,
      newDatasheets: [...(editProduct.newDatasheets || []), ...newDatasheets]
    });
  };

  const removeEditDatasheet = (index, isNew) => {
    if (isNew) {
      const updated = [...editProduct.newDatasheets];
      updated.splice(index, 1);
      setEditProduct({ ...editProduct, newDatasheets: updated });
    } else {
      const updated = [...editProduct.datasheets];
      updated.splice(index, 1);
      setEditProduct({ ...editProduct, datasheets: updated });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imgUrl = editProduct.imgUrl;
      if (editProduct.imgFile) {
        simulateUpload(setEditUploadProgress);
        const storageRef = ref(
          storage,
          `products/${Date.now()}_${editProduct.imgFile.name}`
        );
        await uploadBytes(storageRef, editProduct.imgFile);
        imgUrl = await getDownloadURL(storageRef);
      }

      // Upload new additional images
      const newImageUrls = [];
      if (editProduct.newImages && editProduct.newImages.length > 0) {
        for (const img of editProduct.newImages) {
          const storageRef = ref(
            storage,
            `products/${Date.now()}_${img.file.name}`
          );
          await uploadBytes(storageRef, img.file);
          const url = await getDownloadURL(storageRef);
          newImageUrls.push(url);
        }
      }

      // Upload new datasheets
      const newDatasheetUrls = [];
      if (editProduct.newDatasheets && editProduct.newDatasheets.length > 0) {
        for (const ds of editProduct.newDatasheets) {
          const storageRef = ref(
            storage,
            `datasheets/${Date.now()}_${ds.file.name}`
          );
          await uploadBytes(storageRef, ds.file);
          const url = await getDownloadURL(storageRef);
          newDatasheetUrls.push({
            name: ds.file.name,
            url: url
          });
        }
      }

      const allImages = [...editProduct.images, ...newImageUrls];
      const allDatasheets = [...editProduct.datasheets, ...newDatasheetUrls];

      await updateDoc(doc(db, "products", editProduct.id), {
        name: editProduct.name,
        category: editProduct.category,
        price: editProduct.hasHiddenPrice ? null : Number(editProduct.price),
        hiddenPrice: editProduct.hasHiddenPrice
          ? Number(editProduct.price)
          : null,
        imgUrl,
        images: allImages,
        features: editProduct.features,
        datasheets: allDatasheets,
      });

      showSnackbar("Proizvod izmenjen!", "success");
      handleEditClose();
      fetchProducts();
    } catch (error) {
      console.error(error);
      showSnackbar("Greška pri izmeni proizvoda.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-8 lg:p-10 mt-6 animate-fade-up flex flex-col gap-8 sm:gap-16">
      <h2 className="text-2xl sm:text-4xl font-black text-center text-charcoal mb-6 tracking-tight">
        Admin panel
      </h2>

      {/* Forma za unos proizvoda - responsive */}
      <form
        onSubmit={handleAddProduct}
        className="flex flex-col gap-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 sm:p-6 lg:p-8 shadow animate-pop w-full"
      >
        <div className="flex flex-col lg:flex-row items-start gap-6 w-full">

          <div className="flex flex-col gap-4 w-full pt-2">
            <FloatingLabelInput
              name="name"
              label="Naziv proizvoda"
              value={newProduct.name}
              onChange={handleChange}
              required
            />
            <FloatingLabelInput
              name="category"
              label="Kategorija"
              value={newProduct.category}
              onChange={handleChange}
              required
            />
            <FloatingLabelInput
              name="price"
              label="Cena (RSD)"
              type="number"
              value={newProduct.price}
              onChange={handleChange}
              required
            />

            <div className="flex items-center gap-2">
              <label className="flex items-center cursor-pointer relative group">
                <input
                  type="checkbox"
                  name="hasHiddenPrice"
                  checked={newProduct.hasHiddenPrice}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      hasHiddenPrice: e.target.checked,
                    })
                  }
                  className="peer w-5 h-5 rounded border border-slate-300 checked:bg-indigo-600 checked:border-indigo-600 transition-all duration-300 shadow focus:ring-2 focus:ring-indigo-400"
                />
                <span className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 20 20"
                    stroke="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="ml-2 text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors peer-checked:text-indigo-600">
                  Sakrij cenu za korisnike
                </span>
              </label>
            </div>
          </div>

          {/* Upload slika */}
          <div className="flex flex-col items-center gap-4 w-full max-w-xs lg:max-w-none">
            <div className="relative">
              <label className="cursor-pointer group">
                <div className="w-28 h-28 sm:w-60 sm:h-auto aspect-square border-3 border-dashed border-blue-300 rounded-xl flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 transition-all duration-300 group-hover:border-blue-500 group-hover:scale-105">
                  {newProduct.imgPreview ? (
                    <ProgressiveImage
                      src={newProduct.imgPreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <svg
                        className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 group-hover:text-blue-600 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span className="text-xs sm:text-sm text-blue-600 font-medium mt-1 sm:mt-2">
                        Upload glavnu sliku
                      </span>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="hidden"
                />
              </label>

              {/* Upload progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                    <div className="text-xs sm:text-sm font-medium">
                      {Math.round(uploadProgress)}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sekcija za dodatne funkcionalnosti - full width */}
        <div className="w-full lg:col-span-2 flex flex-col gap-6 mt-4">
          {/* Multiple Images */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-white/90 backdrop-blur-md border border-[#6EAEA2]/30 shadow-lg"
            style={{
              background: "rgba(203, 207, 187, 0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            <h4 className="font-bold text-[#1E3E49] mb-3 flex items-center gap-2">
              <FiUpload className="text-[#6EAEA2]" /> Dodatne slike
            </h4>
            <Motion.label
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#6EAEA2] text-white rounded-lg hover:bg-[#91CEC1] transition-all shadow-md hover:shadow-lg"
            >
              <FiPlus /> Dodaj slike
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleMultipleImages}
                className="hidden"
              />
            </Motion.label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-3">
              <AnimatePresence>
                {newProduct.images.map((img, idx) => (
                  <Motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
                    transition={{ duration: 0.3, ease: "backOut" }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className="relative group"
                  >
                    <img
                      src={img.preview}
                      alt={`Preview ${idx}`}
                      className="w-full aspect-square object-cover rounded-lg border-2 border-[#6EAEA2]/40 shadow-md group-hover:shadow-xl transition-shadow"
                    />
                    <Motion.button
                      type="button"
                      onClick={() => removeImage(idx)}
                      whileHover={{ scale: 1.2, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute -top-2 -right-2 bg-[#AD5637] text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <FiX size={16} />
                    </Motion.button>
                  </Motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Motion.div>

          {/* Features / Karakteristike */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-xl bg-white/90 backdrop-blur-md border border-[#6EAEA2]/30 shadow-lg"
            style={{
              background: "rgba(145, 206, 193, 0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            <h4 className="font-bold text-[#1E3E49] mb-3 flex items-center gap-2">
              <FiPlus className="text-[#6EAEA2]" /> Karakteristike
            </h4>
            <Motion.button
              type="button"
              onClick={addFeature}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#6EAEA2] text-white rounded-lg hover:bg-[#91CEC1] transition-all shadow-md hover:shadow-lg mb-3"
            >
              <FiPlus /> Dodaj karakteristiku
            </Motion.button>
            <div className="space-y-2">
              <AnimatePresence>
                {newProduct.features.map((feature, idx) => (
                  <Motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex gap-2 items-center p-2 rounded-lg bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow"
                  >
                    <input
                      type="text"
                      placeholder="Naziv (npr. Težina)"
                      value={feature.label}
                      onChange={(e) => updateFeature(idx, "label", e.target.value)}
                      className="flex-1 px-3 py-2 border border-[#6EAEA2]/40 rounded-lg focus:ring-2 focus:ring-[#6EAEA2] bg-white/90 backdrop-blur-sm transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Vrednost (npr. 2kg)"
                      value={feature.value}
                      onChange={(e) => updateFeature(idx, "value", e.target.value)}
                      className="flex-1 px-3 py-2 border border-[#6EAEA2]/40 rounded-lg focus:ring-2 focus:ring-[#6EAEA2] bg-white/90 backdrop-blur-sm transition-all"
                    />
                    <Motion.button
                      type="button"
                      onClick={() => removeFeature(idx)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-[#AD5637] text-white rounded-lg hover:bg-[#8A4D34] transition-all shadow-sm hover:shadow-md"
                    >
                      <FiTrash2 />
                    </Motion.button>
                  </Motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Motion.div>

          {/* Datasheets */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-xl bg-white/90 backdrop-blur-md border border-[#6EAEA2]/30 shadow-lg"
            style={{
              background: "rgba(30, 62, 73, 0.05)",
              backdropFilter: "blur(10px)",
            }}
          >
            <h4 className="font-bold text-[#1E3E49] mb-3 flex items-center gap-2">
              <FiFile className="text-[#6EAEA2]" /> Datasheets / Preuzimanja
            </h4>
            <Motion.label
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#6EAEA2] text-white rounded-lg hover:bg-[#91CEC1] transition-all shadow-md hover:shadow-lg"
            >
              <FiPlus /> Dodaj datoteke
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                multiple
                onChange={handleDatasheets}
                className="hidden"
              />
            </Motion.label>
            <div className="space-y-2 mt-3">
              <AnimatePresence>
                {newProduct.datasheets.map((ds, idx) => (
                  <Motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center gap-2 p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-[#6EAEA2]/30 shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <Motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    >
                      <FiFile className="text-[#6EAEA2]" size={20} />
                    </Motion.div>
                    <span className="flex-1 text-sm text-[#1E3E49] truncate font-medium">{ds.name}</span>
                    <Motion.button
                      type="button"
                      onClick={() => removeDatasheet(idx)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 bg-[#AD5637] text-white rounded hover:bg-[#8A4D34] transition-all shadow-sm hover:shadow-md"
                    >
                      <FiX size={16} />
                    </Motion.button>
                  </Motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Motion.div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full lg:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          {loading ? (
            <div className="flex items-center gap-2 justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Dodavanje...
            </div>
          ) : (
            "Dodaj proizvod"
          )}
        </button>
      </form>

      {/* Proizvodi - Desktop tabela, Mobile kartice */}
      <div className="w-full">
        {/* Desktop tabela (lg i veće) */}
        <div className="hidden lg:block overflow-hidden rounded-xl shadow-lg">
          <table className="min-w-full text-center divide-y divide-gray-200 bg-white">
            <thead className="bg-gradient-to-r from-indigo-50 to-blue-50">
              <tr>
                <th className="px-6 py-4 text-lg font-bold text-gray-700">
                  Slika
                </th>
                <th className="px-6 py-4 text-lg font-bold text-gray-700">
                  Naziv
                </th>
                <th className="px-6 py-4 text-lg font-bold text-gray-700">
                  Kategorija
                </th>
                <th className="px-6 py-4 text-lg font-bold text-gray-700">
                  Cena (RSD)
                </th>
                <th className="px-6 py-4 text-lg font-bold text-gray-700">
                  Akcije
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-xl text-slate-400">
                    Nema proizvoda
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr
                    key={prod.id}
                    data-product-id={prod.id}
                    className="hover:bg-blue-50 transition-all duration-300 hover:scale-[1.01] hover:shadow-md"
                  >
                    <td className="py-4">
                      <ProgressiveImage
                        src={prod.imgUrl}
                        alt={prod.name}
                        className="w-20 h-20 object-cover mx-auto rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      />
                    </td>
                    <td className="py-4 font-semibold text-gray-800">
                      {prod.name}
                    </td>
                    <td className="py-4 text-gray-600">{prod.category}</td>
                    <td className="py-4 font-bold text-green-600 text-lg">
                      {prod.price !== null ? (
                        formatPrice(prod.price) + " RSD"
                      ) : allowed ? (
                        formatPrice(prod.hiddenPrice) + " RSD (skrivena)"
                      ) : (
                        <span className="italic text-gray-400">
                          Cena skrivena
                        </span>
                      )}
                      {prod.hiddenPrice && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold ml-2 animate-pulse">
                          Sakrivena cena
                        </span>
                      )}
                    </td>

                    <td className="py-4 space-x-3">
                      <button
                        onClick={() => handleEditOpen(prod)}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg font-medium"
                      >
                        Izmeni
                      </button>
                      <button
                        onClick={() => confirmDelete(prod)}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg font-medium"
                      >
                        Obriši
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile kartice (manje od lg) */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {products.length === 0 ? (
            <div className="col-span-full text-center text-xl text-slate-400 py-12 bg-gray-50 rounded-xl">
              Nema proizvoda
            </div>
          ) : (
            products.map((prod) => (
              <div
                key={prod.id}
                data-product-id={prod.id}
                onClick={() => setSelectedProduct(prod)}
                className="bg-white rounded-xl shadow-lg p-4 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-100"
              >
                <ProgressiveImage
                  src={prod.imgUrl}
                  alt={prod.name}
                  className="w-full h-32 sm:h-40 object-cover rounded-lg mb-3"
                />
                <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-1 truncate">
                  {prod.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{prod.category}</p>
                <p className="font-bold text-green-600 text-lg">
                  {prod.price !== null ? (
                    formatPrice(prod.price) + " RSD"
                  ) : allowed ? (
                    formatPrice(prod.hiddenPrice) + " RSD (skrivena)"
                  ) : (
                    <span className="italic text-gray-400">Cena skrivena</span>
                  )}
                  {prod.hiddenPrice && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold ml-2 animate-pulse">
                      Sakrivena cena
                    </span>
                  )}
                </p>

                <div className="mt-3 text-center">
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    Kliknite za opcije
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mobile Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          />
          <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl w-full max-w-sm max-h-[80vh] overflow-y-auto">
            <div className="text-center">
              <ProgressiveImage
                src={selectedProduct.imgUrl}
                alt={selectedProduct.name}
                className="w-32 h-32 object-cover rounded-xl mx-auto mb-4 shadow-lg"
              />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {selectedProduct.name}
              </h3>
              <p className="text-gray-600 mb-2">{selectedProduct.category}</p>
              <p className="font-bold text-green-600 text-2xl mb-6">
                {selectedProduct.hiddenPrice
                  ? formatPrice(selectedProduct.hiddenPrice) + " RSD (skrivena)"
                  : selectedProduct.price !== null
                  ? formatPrice(selectedProduct.price) + " RSD"
                  : "Nema cene"}
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    handleEditOpen(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                >
                  Izmeni proizvod
                </button>
                <button
                  onClick={() => {
                    confirmDelete(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                >
                  Obriši proizvod
                </button>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="w-full px-6 py-3 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-300 font-semibold"
                >
                  Zatvori
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Potvrda brisanja modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-white/20 backdrop-blur-md backdrop-saturate-150"
            style={{
              background: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(20px) saturate(180%)",
            }}
            onClick={cancelDelete}
          />
          <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20 animate-scale-up max-w-md w-full mx-4">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-center text-gray-800">
              Potvrda brisanja
            </h3>
            <p className="text-gray-600 mb-2 text-center text-sm sm:text-base">
              Da li ste sigurni da želite da obrišete proizvod "
              {deleteConfirm.name}"?
            </p>
            <p className="font-bold text-green-600 text-lg mb-6 text-center">
              {deleteConfirm.hiddenPrice
                ? formatPrice(deleteConfirm.hiddenPrice) + " RSD (skrivena)"
                : deleteConfirm.price !== null
                ? formatPrice(deleteConfirm.price) + " RSD"
                : "Nema cene"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={cancelDelete}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl transition-all duration-300 font-medium"
              >
                Otkaži
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-300 font-medium hover:scale-105"
              >
                Obriši
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-white/20 backdrop-blur-md backdrop-saturate-150"
            style={{
              background: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(20px) saturate(180%)",
            }}
            onClick={handleEditClose}
          />
          <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20 animate-scale-up max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" data-lenis-prevent>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-6">
              <h3 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
                Izmena proizvoda
              </h3>

              {/* Trenutna slika */}
              <div className="flex justify-center">
                <div className="relative">
                  <ProgressiveImage
                    src={editProduct.imgPreview}
                    alt="Current"
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl shadow-lg"
                  />
                  <label className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditFile}
                      className="hidden"
                    />
                  </label>

                  {/* Upload progress */}
                  {editUploadProgress > 0 && editUploadProgress < 100 && (
                    <div className="absolute inset-0 bg-black/70 rounded-xl flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 border-3 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                        <div className="text-xs sm:text-sm">
                          {Math.round(editUploadProgress)}%
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <FloatingLabelInput
                name="name"
                label="Naziv"
                value={editProduct.name}
                onChange={handleEditChange}
                required
              />
              <FloatingLabelInput
                name="category"
                label="Kategorija"
                value={editProduct.category}
                onChange={handleEditChange}
                required
              />
              <FloatingLabelInput
                name="price"
                label="Cena"
                type="number"
                value={editProduct.price}
                onChange={handleEditChange}
                required
              />

              <label className="flex items-center cursor-pointer relative group mb-4">
                <input
                  type="checkbox"
                  name="hasHiddenPrice"
                  checked={!!editProduct.hasHiddenPrice}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      hasHiddenPrice: e.target.checked,
                    })
                  }
                  className="peer w-5 h-5 rounded border border-slate-300 checked:bg-indigo-600 checked:border-indigo-600 transition-all duration-300 shadow focus:ring-2 focus:ring-indigo-400"
                />
                <span className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 20 20"
                    stroke="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="ml-2 text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors peer-checked:text-indigo-600">
                  Sakrij cenu za korisnike
                </span>
              </label>

              {/* Edit Multiple Images */}
              <Motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-[#CBCFBB]/10 backdrop-blur-sm border border-[#6EAEA2]/30 shadow-sm"
              >
                <h4 className="font-semibold text-[#1E3E49] mb-2 text-sm flex items-center gap-2">
                  <FiUpload className="text-[#6EAEA2]" /> Dodatne slike
                </h4>
                <Motion.label 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-[#6EAEA2] text-white rounded-lg hover:bg-[#91CEC1] transition-all text-sm shadow-sm hover:shadow-md"
                >
                  <FiPlus size={14} /> Dodaj slike
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleEditMultipleImages}
                    className="hidden"
                  />
                </Motion.label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <AnimatePresence>
                    {editProduct.images.map((img, idx) => (
                      <Motion.div 
                        key={idx} 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        className="relative group"
                      >
                        <img
                          src={img}
                          alt={`Img ${idx}`}
                          className="w-full aspect-square object-cover rounded border-2 border-[#6EAEA2]/40 shadow-sm group-hover:shadow-md transition-shadow"
                        />
                        <Motion.button
                          type="button"
                          onClick={() => removeEditImage(idx, false)}
                          whileHover={{ scale: 1.2, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute -top-1 -right-1 bg-[#AD5637] text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        >
                          <FiX size={12} />
                        </Motion.button>
                      </Motion.div>
                    ))}
                    {editProduct.newImages && editProduct.newImages.map((img, idx) => (
                      <Motion.div 
                        key={`new-${idx}`} 
                        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
                        whileHover={{ scale: 1.05 }}
                        className="relative group"
                      >
                        <img
                          src={img.preview}
                          alt={`New ${idx}`}
                          className="w-full aspect-square object-cover rounded border-2 border-[#91CEC1] shadow-sm group-hover:shadow-md transition-shadow"
                        />
                        <Motion.button
                          type="button"
                          onClick={() => removeEditImage(idx, true)}
                          whileHover={{ scale: 1.2, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute -top-1 -right-1 bg-[#AD5637] text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        >
                          <FiX size={12} />
                        </Motion.button>
                      </Motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </Motion.div>

              {/* Edit Features */}
              <Motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-3 rounded-lg bg-[#91CEC1]/10 backdrop-blur-sm border border-[#6EAEA2]/30 shadow-sm"
              >
                <h4 className="font-semibold text-[#1E3E49] mb-2 text-sm flex items-center gap-2">
                  <FiPlus className="text-[#6EAEA2]" /> Karakteristike
                </h4>
                <Motion.button
                  type="button"
                  onClick={addEditFeature}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-[#6EAEA2] text-white rounded-lg hover:bg-[#91CEC1] transition-all text-sm mb-2 shadow-sm hover:shadow-md"
                >
                  <FiPlus size={14} /> Dodaj
                </Motion.button>
                <div className="space-y-2">
                  <AnimatePresence>
                    {editProduct.features.map((feature, idx) => (
                      <Motion.div 
                        key={idx} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-2 items-center p-2 rounded bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow"
                      >
                        <input
                          type="text"
                          placeholder="Naziv"
                          value={feature.label}
                          onChange={(e) => updateEditFeature(idx, "label", e.target.value)}
                          className="flex-1 px-2 py-1 border border-[#6EAEA2]/40 rounded text-sm focus:ring-2 focus:ring-[#6EAEA2] bg-white/80"
                        />
                        <input
                          type="text"
                          placeholder="Vrednost"
                          value={feature.value}
                          onChange={(e) => updateEditFeature(idx, "value", e.target.value)}
                          className="flex-1 px-2 py-1 border border-[#6EAEA2]/40 rounded text-sm focus:ring-2 focus:ring-[#6EAEA2] bg-white/80"
                        />
                        <Motion.button
                          type="button"
                          onClick={() => removeEditFeature(idx)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 bg-[#AD5637] text-white rounded hover:bg-[#8A4D34] transition-all shadow-sm"
                        >
                          <FiTrash2 size={14} />
                        </Motion.button>
                      </Motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </Motion.div>

              {/* Edit Datasheets */}
              <Motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-3 rounded-lg bg-[#1E3E49]/5 backdrop-blur-sm border border-[#6EAEA2]/30 shadow-sm"
              >
                <h4 className="font-semibold text-[#1E3E49] mb-2 text-sm flex items-center gap-2">
                  <FiFile className="text-[#6EAEA2]" /> Datasheets
                </h4>
                <Motion.label 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-[#6EAEA2] text-white rounded-lg hover:bg-[#91CEC1] transition-all text-sm shadow-sm hover:shadow-md"
                >
                  <FiPlus size={14} /> Dodaj
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    multiple
                    onChange={handleEditDatasheets}
                    className="hidden"
                  />
                </Motion.label>
                <div className="space-y-2 mt-2">
                  <AnimatePresence>
                    {editProduct.datasheets.map((ds, idx) => (
                      <Motion.div 
                        key={idx} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="flex items-center gap-2 p-2 bg-white/60 backdrop-blur-sm rounded border border-[#6EAEA2]/30 text-sm shadow-sm hover:shadow-md transition-shadow group"
                      >
                        <FiFile className="text-[#6EAEA2]" size={14} />
                        <span className="flex-1 truncate text-xs font-medium">{ds.name}</span>
                        <Motion.button
                          type="button"
                          onClick={() => removeEditDatasheet(idx, false)}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 bg-[#AD5637] text-white rounded hover:bg-[#8A4D34] transition-all shadow-sm"
                        >
                          <FiX size={12} />
                        </Motion.button>
                      </Motion.div>
                    ))}
                    {editProduct.newDatasheets && editProduct.newDatasheets.map((ds, idx) => (
                      <Motion.div 
                        key={`new-${idx}`} 
                        initial={{ opacity: 0, x: -20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.9 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="flex items-center gap-2 p-2 bg-[#91CEC1]/20 backdrop-blur-sm rounded border border-[#91CEC1] text-sm shadow-sm hover:shadow-md transition-shadow group"
                      >
                        <FiFile className="text-[#6EAEA2]" size={14} />
                        <span className="flex-1 truncate text-xs font-medium">{ds.name}</span>
                        <Motion.button
                          type="button"
                          onClick={() => removeEditDatasheet(idx, true)}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 bg-[#AD5637] text-white rounded hover:bg-[#8A4D34] transition-all shadow-sm"
                        >
                          <FiX size={12} />
                        </Motion.button>
                      </Motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </Motion.div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
                <button
                  type="button"
                  onClick={handleEditClose}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl transition-all duration-300 font-medium"
                >
                  Otkaži
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 rounded-xl transition-all duration-300 font-medium hover:scale-105 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Čuvanje...
                    </div>
                  ) : (
                    "Sačuvaj izmene"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
