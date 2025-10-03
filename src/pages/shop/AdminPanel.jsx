import { useState, useContext, useEffect } from "react";
import { db, storage, auth } from "../../utils/firebase.js";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { SnackbarContext } from "../../contexts/shop/SnackbarContext.jsx";

export default function AdminPanel() {
  const { showSnackbar } = useContext(SnackbarContext);

  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.email === "lazar.cve@gmail.com") {
        setAllowed(true);
      } else {
        setAllowed(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    imgFile: null
  });
  const [products, setProducts] = useState([]);

  if (allowed === null) return <div>Učitavanje...</div>;
  if (allowed === false) return <div className="text-red-600 font-bold text-xl mt-10 text-center">Pristup odbijen</div>;

  const handleChange = e => setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  const handleFile = e => setNewProduct({ ...newProduct, imgFile: e.target.files[0] });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    try {
      if (newProduct.imgFile) {
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
      showSnackbar("Proizvod uspešno dodat!");
      // refresh products list...
    } catch(err) {
      showSnackbar("Greška pri dodavanju proizvoda.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      showSnackbar("Proizvod uspešno obrisan!");
      // refresh products list...
    } catch(err) {
      showSnackbar("Greška pri brisanju proizvoda.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6">Admin panel</h2>
      <form onSubmit={handleAddProduct} className="flex flex-col gap-4 mb-10">
        <input name="name" placeholder="Naziv proizvoda" onChange={handleChange} className="border p-2 rounded" />
        <input name="category" placeholder="Kategorija" onChange={handleChange} className="border p-2 rounded" />
        <input name="price" placeholder="Cena (RSD)" type="number" onChange={handleChange} className="border p-2 rounded" />
        <input type="file" accept="image/*" onChange={handleFile} className="border p-2 rounded" />
        <button type="submit" className="bg-charcoal text-white px-6 py-2 rounded shadow hover:bg-midnight transition">
          Dodaj proizvod
        </button>
      </form>
      {/* List products & buttons for delete/edit, dinamički deo, skraćeno ovde */}
    </div>
  );
}
