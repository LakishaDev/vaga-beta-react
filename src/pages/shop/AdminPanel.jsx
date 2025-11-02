// src/pages/shop/AdminPanel.jsx
// ===============================================================================
// ADMIN PANEL ZA UPRAVLJANJE PROIZVODIMA - REFACTORED v3.0
// ===============================================================================
// 
// @component AdminPanel
// @description Admin panel za potpunu kontrolu nad e-commerce proizvodima
// @version 3.0 - REFACTORED
// @lastmodified 2025-11-02
// @documentation Vidi: /ADMINPANEL_DOKUMENTACIJA.md za detaljnu dokumentaciju
// 
// KLJUČNE FUNKCIONALNOSTI:
// ========================
// ✅ CRUD operacije (Create, Read, Update, Delete) proizvoda
// ✅ Upload glavne slike i dodatnih slika sa reordering funkcijom (↑/↓)
// ✅ Lokalizacija cene sa automatskim separatorom za hiljade (sr-RS format)
// ✅ Modal za prikaz slika u velikom formatu (zoom preview)
// ✅ Upravljanje karakteristikama proizvoda (key-value parovi)
// ✅ Upload datasheets (PDF, DOC dokumenti)
// ✅ Software toggle sa markdown dokumentacijom
// ✅ Responsive dizajn (desktop/mobile/tablet)
// ✅ 3D animacije i glassmorphism efekti (Framer Motion) - FIXED
// ✅ Firebase integracija (Firestore + Storage)
// ✅ Email-based autorizacija sa .env konfiguracija
// 
// REFACTORING CHANGES v3.0:
// ==========================
// 🆕 Komponente razbijene u manje, reusable module
// 🆕 FIXED framer-motion rotate animation errors (spring + multi-keyframe)
// 🆕 Koristi EditProductModal iz UI komponenti
// 🆕 Bolja organizacija koda i separacija odgovornosti
// 
// ===============================================================================

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
import LepModal from "../../components/UI/LepModal.jsx";
import EditProductModal from "../../components/UI/EditProductModal.jsx";
import ProductForm from "../../components/AdminPanel/ProductForm.jsx";
import ProductList from "../../components/AdminPanel/ProductList.jsx";
import ProductModal from "../../components/AdminPanel/ProductModal.jsx";
import DeleteConfirmModal from "../../components/AdminPanel/DeleteConfirmModal.jsx";

export default function AdminPanel() {
  const { showSnackbar } = useContext(SnackbarContext);
  const [allowed, setAllowed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [editUploadProgress, setEditUploadProgress] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null); // za mobile modal
  const [imageModal, setImageModal] = useState({ open: false, src: "", text: "" }); // za prikaz slika

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
    isSoftware: false, // Software toggle
    markdownFiles: [], // Markdown documentation files
  });

  const [products, setProducts] = useState([]);

  // ===============================================================================
  // AUTHENTICATION
  // ===============================================================================

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const adminEmails =
        import.meta.env.VITE_ADMIN_EMAILS?.split(",").map((e) => e.trim()) ||
        [];
      setAllowed(user && adminEmails.includes(user.email));
    });
    return () => unsubscribe();
  }, []);

  // ===============================================================================
  // FETCH PRODUCTS
  // ===============================================================================

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    setProducts(
      querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };

  useEffect(() => {
    if (allowed) fetchProducts();
  }, [allowed]);

  // ===============================================================================
  // PRICE FORMATTING FUNCTIONS
  // ===============================================================================

  /**
   * Formatira cenu za prikaz sa separatorom za hiljade
   * @function formatPrice
   * @param {number} price - Cena kao broj (integer)
   * @returns {string} Formatirana cena sa tačkom kao separatorom
   */
  const formatPrice = (price) => {
    return new Intl.NumberFormat("sr-RS").format(price);
  };

  /**
   * Formatira unos cene tokom kucanja sa automatskim dodavanjem separatora
   * @function formatPriceInput
   * @param {string} value - Sirova vrednost iz input polja
   * @returns {string} Formatirana cena sa tačkom kao separatorom
   */
  const formatPriceInput = (value) => {
    if (!value) return "";
    const numericValue = value.replace(/\D/g, "");
    if (!numericValue) return "";
    return new Intl.NumberFormat("sr-RS").format(parseInt(numericValue, 10));
  };

  /**
   * Parsira formatiranu cenu nazad u "čisti" numerički string
   * @function parsePriceInput
   * @param {string} formattedValue - Formatirana cena (npr. "10.000")
   * @returns {string} Čisti numerički string bez separatora (npr. "10000")
   */
  const parsePriceInput = (formattedValue) => {
    if (!formattedValue) return "";
    const numericValue = formattedValue.replace(/[.]/g, "");
    return numericValue;
  };

  // ===============================================================================
  // FORM HANDLERS - NEW PRODUCT
  // ===============================================================================

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

  const handleMultipleImages = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setNewProduct({
      ...newProduct,
      images: [...newProduct.images, ...newImages],
    });
  };

  const removeImage = (index) => {
    const updated = [...newProduct.images];
    updated.splice(index, 1);
    setNewProduct({ ...newProduct, images: updated });
  };

  /**
   * Pomera dodatnu sliku jednu poziciju gore u glavnom formu
   */
  const moveImageUp = (index) => {
    if (index === 0) return;
    const updated = [...newProduct.images];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setNewProduct({ ...newProduct, images: updated });
  };

  /**
   * Pomera dodatnu sliku jednu poziciju dole u glavnom formu
   */
  const moveImageDown = (index) => {
    if (index === newProduct.images.length - 1) return;
    const updated = [...newProduct.images];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setNewProduct({ ...newProduct, images: updated });
  };

  const addFeature = () => {
    setNewProduct({
      ...newProduct,
      features: [...newProduct.features, { label: "", value: "" }],
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

  const handleDatasheets = (e) => {
    const files = Array.from(e.target.files);
    const newDatasheets = files.map((file) => ({
      file,
      name: file.name,
    }));
    setNewProduct({
      ...newProduct,
      datasheets: [...newProduct.datasheets, ...newDatasheets],
    });
  };

  const removeDatasheet = (index) => {
    const updated = [...newProduct.datasheets];
    updated.splice(index, 1);
    setNewProduct({ ...newProduct, datasheets: updated });
  };

  const handleMarkdownFiles = (files) => {
    setNewProduct({
      ...newProduct,
      markdownFiles: [...newProduct.markdownFiles, ...files],
    });
  };

  const removeMarkdownFile = (index) => {
    const updated = [...newProduct.markdownFiles];
    updated.splice(index, 1);
    setNewProduct({ ...newProduct, markdownFiles: updated });
  };

  // ===============================================================================
  // UPLOAD SIMULATION
  // ===============================================================================

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

  // ===============================================================================
  // ADD PRODUCT
  // ===============================================================================

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
          url: url,
        });
      }

      // Upload markdown files
      const markdownUrls = [];
      for (const md of newProduct.markdownFiles) {
        const storageRef = ref(
          storage,
          `markdown/${Date.now()}_${md.file.name}`
        );
        await uploadBytes(storageRef, md.file);
        const url = await getDownloadURL(storageRef);
        markdownUrls.push({
          name: md.file.name,
          url: url,
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
        isSoftware: newProduct.isSoftware,
        markdownFiles: markdownUrls,
        createdAt: new Date(),
      });

      showSnackbar("Proizvod uspešno dodat!", "success");
      setNewProduct({
        name: "",
        category: "",
        price: "",
        hasHiddenPrice: false,
        imgFile: null,
        imgPreview: null,
        images: [],
        features: [],
        datasheets: [],
        isSoftware: false,
        markdownFiles: [],
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

  // ===============================================================================
  // DELETE PRODUCT
  // ===============================================================================

  const confirmDelete = (product) => setDeleteConfirm(product);
  const cancelDelete = () => setDeleteConfirm(null);

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
        setSelectedProduct(null);
      }, 500);
    } catch {
      showSnackbar("Greška pri brisanju proizvoda.", "error");
    }
  };

  // ===============================================================================
  // EDIT PRODUCT
  // ===============================================================================

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
      isSoftware: product.isSoftware || false,
      markdownFiles: product.markdownFiles || [],
      newMarkdownFiles: [],
    });

  const handleEditClose = () => {
    setEditProduct(null);
    setEditUploadProgress(0);
    setSelectedProduct(null);
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

  const handleEditMultipleImages = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setEditProduct({
      ...editProduct,
      newImages: [...(editProduct.newImages || []), ...newImages],
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

  /**
   * Helper funkcija za premeštanje slika u edit modu
   */
  const moveEditImageInDirection = (index, isNew, direction) => {
    if (!editProduct) return;
    
    const arrayKey = isNew ? "newImages" : "images";
    const sourceArray = editProduct[arrayKey] || [];
    
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === sourceArray.length - 1) return;
    
    const updated = [...sourceArray];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
    
    setEditProduct({ ...editProduct, [arrayKey]: updated });
  };

  const moveEditImageUp = (index, isNew) => {
    moveEditImageInDirection(index, isNew, "up");
  };

  const moveEditImageDown = (index, isNew) => {
    moveEditImageInDirection(index, isNew, "down");
  };

  const addEditFeature = () => {
    setEditProduct({
      ...editProduct,
      features: [...editProduct.features, { label: "", value: "" }],
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

  const handleEditDatasheets = (e) => {
    const files = Array.from(e.target.files);
    const newDatasheets = files.map((file) => ({
      file,
      name: file.name,
    }));
    setEditProduct({
      ...editProduct,
      newDatasheets: [...(editProduct.newDatasheets || []), ...newDatasheets],
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

  const handleEditMarkdownFiles = (files) => {
    setEditProduct({
      ...editProduct,
      newMarkdownFiles: [...(editProduct.newMarkdownFiles || []), ...files],
    });
  };

  const removeEditMarkdownFile = (index, isNew) => {
    if (isNew) {
      const updated = [...editProduct.newMarkdownFiles];
      updated.splice(index, 1);
      setEditProduct({ ...editProduct, newMarkdownFiles: updated });
    } else {
      const updated = [...editProduct.markdownFiles];
      updated.splice(index, 1);
      setEditProduct({ ...editProduct, markdownFiles: updated });
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
            url: url,
          });
        }
      }

      // Upload new markdown files
      const newMarkdownUrls = [];
      if (
        editProduct.newMarkdownFiles &&
        editProduct.newMarkdownFiles.length > 0
      ) {
        for (const md of editProduct.newMarkdownFiles) {
          const storageRef = ref(
            storage,
            `markdown/${Date.now()}_${md.file.name}`
          );
          await uploadBytes(storageRef, md.file);
          const url = await getDownloadURL(storageRef);
          newMarkdownUrls.push({
            name: md.file.name,
            url: url,
          });
        }
      }

      const allImages = [...editProduct.images, ...newImageUrls];
      const allDatasheets = [...editProduct.datasheets, ...newDatasheetUrls];
      const allMarkdownFiles = [
        ...(editProduct.markdownFiles || []),
        ...newMarkdownUrls,
      ];

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
        isSoftware: editProduct.isSoftware,
        markdownFiles: allMarkdownFiles,
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

  // ===============================================================================
  // RENDER
  // ===============================================================================

  if (allowed === null)
    return <div className="text-center mt-10 text-xl">Učitavanje...</div>;
  if (allowed === false)
    return (
      <div className="text-red-600 font-bold text-xl mt-10 text-center">
        Pristup odbijen
      </div>
    );

  return (
    <div className="max-w-7xl w-full mx-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-8 lg:p-10 mt-6 animate-fade-up flex flex-col gap-8 sm:gap-16">
      <h2 className="text-2xl sm:text-4xl font-black text-center text-charcoal mb-6 tracking-tight">
        Admin panel
      </h2>

      {/* Forma za unos proizvoda - koristi ProductForm komponentu */}
      <ProductForm
        product={newProduct}
        onChange={handleChange}
        onSubmit={handleAddProduct}
        onFileChange={handleFile}
        formatPriceInput={formatPriceInput}
        parsePriceInput={parsePriceInput}
        loading={loading}
        uploadProgress={uploadProgress}
        onMultipleImagesChange={handleMultipleImages}
        onRemoveImage={removeImage}
        onMoveImageUp={moveImageUp}
        onMoveImageDown={moveImageDown}
        onImageClick={(src, text) => setImageModal({ open: true, src, text })}
        onAddFeature={addFeature}
        onUpdateFeature={updateFeature}
        onRemoveFeature={removeFeature}
        onDatasheetsChange={handleDatasheets}
        onRemoveDatasheet={removeDatasheet}
        onMarkdownFilesChange={handleMarkdownFiles}
        onRemoveMarkdownFile={removeMarkdownFile}
      />

      {/* Lista proizvoda - koristi ProductList komponentu */}
      <ProductList
        products={products}
        formatPrice={formatPrice}
        onEdit={handleEditOpen}
        onDelete={confirmDelete}
        onProductClick={setSelectedProduct}
        allowed={allowed}
      />

      {/* Mobile Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          formatPrice={formatPrice}
          onClose={() => setSelectedProduct(null)}
          onEdit={handleEditOpen}
          onDelete={confirmDelete}
        />
      )}

      {/* Potvrda brisanja modal */}
      {deleteConfirm && (
        <DeleteConfirmModal
          product={deleteConfirm}
          formatPrice={formatPrice}
          onCancel={cancelDelete}
          onConfirm={handleDelete}
        />
      )}

      {/* Edit modal - koristi UI EditProductModal sa image reordering */}
      <EditProductModal
        isOpen={!!editProduct}
        onClose={handleEditClose}
        onSubmit={handleEditSubmit}
        product={editProduct}
        onChange={(e) => {
          if (e.target.name === "price") {
            const numericValue = parsePriceInput(e.target.value);
            setEditProduct({ ...editProduct, price: numericValue });
          } else {
            handleEditChange(e);
          }
        }}
        onFileChange={handleEditFile}
        onMultipleImagesChange={handleEditMultipleImages}
        onRemoveImage={removeEditImage}
        onMoveImageUp={moveEditImageUp}
        onMoveImageDown={moveEditImageDown}
        onImageClick={(src, text) => setImageModal({ open: true, src, text })}
        onAddFeature={addEditFeature}
        onUpdateFeature={updateEditFeature}
        onRemoveFeature={removeEditFeature}
        onDatasheetsChange={handleEditDatasheets}
        onRemoveDatasheet={removeEditDatasheet}
        onMarkdownChange={handleEditMarkdownFiles}
        onRemoveMarkdown={(idx) => {
          const totalOld = editProduct.markdownFiles?.length || 0;
          if (idx < totalOld) {
            removeEditMarkdownFile(idx, false);
          } else {
            removeEditMarkdownFile(idx - totalOld, true);
          }
        }}
        formatPriceInput={formatPriceInput}
        loading={loading}
        uploadProgress={editUploadProgress}
      />

      {/* Modal za prikaz slika */}
      <LepModal
        open={imageModal.open}
        src={imageModal.src}
        text={imageModal.text}
        onClose={() => setImageModal({ open: false, src: "", text: "" })}
      />
    </div>
  );
}
