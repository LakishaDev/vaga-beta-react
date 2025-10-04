import { useState, useContext, useEffect } from "react";
import { db, storage, auth } from "../../utils/firebase.js";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { SnackbarContext } from "../../contexts/shop/SnackbarContext.jsx";
import FloatingLabelInput from "../../components/FloatingLabelInput.jsx";
import ProgressiveImage from "../../components/ProgressiveImage.jsx";

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
    imgFile: null,
    imgPreview: null,
  });
  const [products, setProducts] = useState([]);

  // Provera autentikacije
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAllowed(user && user.email === "lazar.cve@gmail.com");
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
  useEffect(() => { if (allowed) fetchProducts(); }, [allowed]);

  if (allowed === null) return <div className="text-center mt-10 text-xl">Učitavanje...</div>;
  if (allowed === false) return <div className="text-red-600 font-bold text-xl mt-10 text-center">Pristup odbijen</div>;

  // Format cene sa separatorom za hiljade
  const formatPrice = (price) => {
    return new Intl.NumberFormat('sr-RS').format(price);
  };

  // Unos i upload slike
  const handleChange = e => setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  const handleFile = e => {
    const file = e.target.files[0];
    setNewProduct({ ...newProduct, imgFile: file, imgPreview: file ? URL.createObjectURL(file) : null });
  };

  // Simulacija upload progresa
  const simulateUpload = (setProgress) => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
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
    e.target.style.transform = 'perspective(1000px) rotateX(20deg) scale(0.95)';
    setTimeout(() => {
      if (e.target) e.target.style.transform = '';
    }, 200);

    let imgUrl = "";
    try {
      if (newProduct.imgFile) {
        simulateUpload(setUploadProgress);
        const storageRef = ref(storage, `products/${Date.now()}_${newProduct.imgFile.name}`);
        await uploadBytes(storageRef, newProduct.imgFile);
        imgUrl = await getDownloadURL(storageRef);
      }
      
      await addDoc(collection(db, "products"), {
        name: newProduct.name,
        category: newProduct.category,
        price: Number(newProduct.price),
        imgUrl,
        createdAt: new Date()
      });
      
      showSnackbar("Proizvod uspešno dodat!", "success");
      setNewProduct({ name: "", category: "", price: "", imgFile: null, imgPreview: null });
      setUploadProgress(0);
      fetchProducts();
    } catch (err) {
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
        element.style.transform = 'scale(0.8) rotateX(90deg)';
        element.style.opacity = '0';
        element.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      }
      
      setTimeout(async () => {
        await deleteDoc(doc(db, "products", id));
        showSnackbar("Proizvod uspešno obrisan!", "success");
        fetchProducts();
        setDeleteConfirm(null);
        setSelectedProduct(null); // zatvori modal ako je otvoren
      }, 500);
    } catch (err) {
      showSnackbar("Greška pri brisanju proizvoda.", "error");
    }
  };

  // Edit funkcije
  const handleEditOpen = (product) => setEditProduct({...product, imgPreview: product.imgUrl});
  const handleEditClose = () => {
    setEditProduct(null);
    setEditUploadProgress(0);
    setSelectedProduct(null); // zatvori i product modal
  };

  const handleEditChange = e => setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
  const handleEditFile = e => {
    const file = e.target.files[0];
    setEditProduct({ ...editProduct, imgFile: file, imgPreview: file ? URL.createObjectURL(file) : editProduct.imgUrl });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let imgUrl = editProduct.imgUrl;
      if (editProduct.imgFile) {
        simulateUpload(setEditUploadProgress);
        const storageRef = ref(storage, `products/${Date.now()}_${editProduct.imgFile.name}`);
        await uploadBytes(storageRef, editProduct.imgFile);
        imgUrl = await getDownloadURL(storageRef);
      }
      
      await updateDoc(doc(db, "products", editProduct.id), {
        name: editProduct.name,
        category: editProduct.category,
        price: Number(editProduct.price),
        imgUrl,
      });
      
      showSnackbar("Proizvod izmenjen!", "success");
      handleEditClose();
      fetchProducts();
    } catch (err) {
      showSnackbar("Greška pri izmeni proizvoda.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-8 lg:p-10 mt-6 animate-fade-up flex flex-col gap-8 sm:gap-16">
      <h2 className="text-2xl sm:text-4xl font-black text-center text-charcoal mb-6 tracking-tight">Admin panel</h2>

      {/* Forma za unos proizvoda - responsive */}
      <form 
        onSubmit={handleAddProduct} 
        className="flex flex-col gap-6 lg:flex-row items-start bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 sm:p-6 lg:p-8 shadow animate-pop w-full"
      >
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
        </div>
        
        {/* Upload slika */}
        <div className="flex flex-col items-center gap-4 w-full max-w-xs lg:max-w-none">
          <div className="relative">
            <label className="cursor-pointer group">
              <div className="w-28 h-28 sm:w-60 sm:h-auto aspect-square border-3 border-dashed border-blue-300 rounded-xl flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 transition-all duration-300 group-hover:border-blue-500 group-hover:scale-105">
                {newProduct.imgPreview ? (
                  <ProgressiveImage src={newProduct.imgPreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <>
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-xs sm:text-sm text-blue-600 font-medium mt-1 sm:mt-2">Upload sliku</span>
                  </>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
            
            {/* Upload progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                  <div className="text-xs sm:text-sm font-medium">{Math.round(uploadProgress)}%</div>
                </div>
              </div>
            )}
          </div>
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
                <th className="px-6 py-4 text-lg font-bold text-gray-700">Slika</th>
                <th className="px-6 py-4 text-lg font-bold text-gray-700">Naziv</th>
                <th className="px-6 py-4 text-lg font-bold text-gray-700">Kategorija</th>
                <th className="px-6 py-4 text-lg font-bold text-gray-700">Cena (RSD)</th>
                <th className="px-6 py-4 text-lg font-bold text-gray-700">Akcije</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-xl text-slate-400">Nema proizvoda</td></tr>
              ) : (
                products.map(prod => (
                  <tr key={prod.id} data-product-id={prod.id} className="hover:bg-blue-50 transition-all duration-300 hover:scale-[1.01] hover:shadow-md">
                    <td className="py-4">
                      <ProgressiveImage src={prod.imgUrl} alt={prod.name} className="w-20 h-20 object-cover mx-auto rounded-lg shadow-md hover:shadow-lg transition-shadow" />
                    </td>
                    <td className="py-4 font-semibold text-gray-800">{prod.name}</td>
                    <td className="py-4 text-gray-600">{prod.category}</td>
                    <td className="py-4 font-bold text-green-600 text-lg">{formatPrice(prod.price)} RSD</td>
                    <td className="py-4 space-x-3">
                      <button onClick={() => handleEditOpen(prod)} 
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg font-medium">
                        Izmeni
                      </button>
                      <button onClick={() => confirmDelete(prod)} 
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg font-medium">
                        Obriši
                      </button>
                    </td>
                  </tr>
                )))}
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
            products.map(prod => (
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
                <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-1 truncate">{prod.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{prod.category}</p>
                <p className="font-bold text-green-600 text-lg">{formatPrice(prod.price)} RSD</p>
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
              <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h3>
              <p className="text-gray-600 mb-2">{selectedProduct.category}</p>
              <p className="font-bold text-green-600 text-2xl mb-6">{formatPrice(selectedProduct.price)} RSD</p>
              
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
            style={{background: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(20px) saturate(180%)'}}
            onClick={cancelDelete}
          />
          <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20 animate-scale-up max-w-md w-full mx-4">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-center text-gray-800">Potvrda brisanja</h3>
            <p className="text-gray-600 mb-6 text-center text-sm sm:text-base">
              Da li ste sigurni da želite da obrišete proizvod "{deleteConfirm.name}"?
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
            style={{background: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(20px) saturate(180%)'}}
            onClick={handleEditClose}
          />
          <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20 animate-scale-up max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-6">
              <h3 className="text-xl sm:text-2xl font-bold text-center text-gray-800">Izmena proizvoda</h3>
              
              {/* Trenutna slika */}
              <div className="flex justify-center">
                <div className="relative">
                  <ProgressiveImage src={editProduct.imgPreview} alt="Current" className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl shadow-lg" />
                  <label className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input type="file" accept="image/*" onChange={handleEditFile} className="hidden" />
                  </label>
                  
                  {/* Upload progress */}
                  {editUploadProgress > 0 && editUploadProgress < 100 && (
                    <div className="absolute inset-0 bg-black/70 rounded-xl flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 border-3 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                        <div className="text-xs sm:text-sm">{Math.round(editUploadProgress)}%</div>
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
