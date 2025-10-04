// src/components/ProductDetails.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../../utils/firebase";
import { doc, getDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import ProgressiveImage from "../ProgressiveImage";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      const snap = await getDoc(doc(db, "products", id));
      setProduct({ id: snap.id, ...snap.data() });
    };
    const fetchReviews = async () => {
      const q = query(collection(db, "reviews"), where("productId", "==", id));
      const snaps = await getDocs(q);
      setReviews(snaps.docs.map(d => ({ ...d.data() })));
    };
    fetchProduct();
    fetchReviews();
  }, [id]);

  const handleReview = async (e) => {
    e.preventDefault();
    if (review.length > 2) {
      await addDoc(collection(db, "reviews"), { productId: id, text: review, createdAt: new Date() });
      setReview("");
      // refresh reviews
      const q = query(collection(db, "reviews"), where("productId", "==", id));
      const snaps = await getDocs(q);
      setReviews(snaps.docs.map(d => ({ ...d.data() })));
    }
  };

  if (!product) return <p>Učitavanje...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10">
      <ProgressiveImage src={product.imgUrl} alt={product.name} className="w-56 h-56 mx-auto mb-6 rounded shadow" />
      <h2 className="text-3xl text-midnight font-bold mb-1">{product.name}</h2>
      <div className="mb-4 text-sheen">{product.category}</div>
      <div className="mb-4 text-xl text-charcoal font-semibold">{product.price} RSD</div>
      <p className="mb-8">{product.description}</p>

      <h3 className="text-lg font-bold mb-2">Recenzije:</h3>
      <ul className="mb-4">
        {reviews.map((r, i) => (
          <li key={i} className="mb-1 border-b pb-1 last:border-b-0">{r.text}</li>
        ))}
      </ul>
      <form onSubmit={handleReview} className="flex items-center gap-2">
        <input
          value={review}
          onChange={e => setReview(e.target.value)}
          placeholder="Ostavi recenziju..."
          className="flex-1 border rounded p-2"
        />
        <button className="bg-bluegreen text-white px-4 py-1 rounded">Pošalji</button>
      </form>
    </div>
  );
}
