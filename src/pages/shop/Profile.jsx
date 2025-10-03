// src/components/Profile.jsx
import { auth, db } from "../../utils/firebase";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Profile() {
  const user = auth.currentUser;
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        const q = query(collection(db, "orders"), where("email", "==", user.email));
        const snaps = await getDocs(q);
        setOrders(snaps.docs.map(d => d.data()));
      }
    };
    fetchOrders();
  }, [user]);

  if (!user)
    return <p className="text-center mt-10">Morate biti prijavljeni da biste videli profil.</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10">
      <h2 className="text-2xl font-bold mb-2">Vaš profil</h2>
      <div className="mb-4">Email: {user.email}</div>
      <h3 className="font-bold mb-2">Vaše narudžbine:</h3>
      {orders.length === 0 ? (
        <div>Nema narudžbina.</div>
      ) : (
        <ul>
          {orders.map((order, idx) => (
            <li key={idx} className="mb-2 border-b pb-2">
              <div>
                <strong>Datum:</strong> {order.createdAt?.toDate().toLocaleString() ?? 'Nepoznato'}
              </div>
              <div>
                <strong>Proizvodi:</strong>{" "}
                {order.cart.map(p => p.name).join(", ")}
              </div>
              <div>
                <strong>Ukupno:</strong>{" "}
                {order.cart.reduce((acc, p) => acc + (p.price * p.qty), 0)} RSD
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
