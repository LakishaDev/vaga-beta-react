// components/shop/ProductGrid.jsx
// Komponenta koja prikazuje mrežu proizvoda sa filterima i sortiranjem
// Učitava proizvode iz Firebase Firestore baze podataka
// Omogućava filtriranje po kategorijama, ceni i pretragu po imenu
// Omogućava sortiranje po najnovijim, najjeftinijim i najskupljim
// Koristi useEffect za učitavanje podataka i useState za stanje filtera
// Koristi ProductCard komponentu za prikaz pojedinačnih proizvoda
// Koristi lucide-react za ikone i framer-motion za animacije
// Koristi useRef za upravljanje klikom van dropdown menija
// Koristi Firebase Firestore metode: collection, getDocs, query, orderBy
//
// OPTIMIZACIJE:
// - useMemo za filtriranje i sortiranje proizvoda (sprečava nepotrebne kalkulacije)
// - useCallback za event handlere (sprečava ponovno kreiranje funkcija)
// - React.memo za ProductCard wrapper (sprečava nepotrebno re-renderovanje)
import { useEffect, useState, useRef, useMemo, useCallback, memo } from "react";
import { db } from "../../utils/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import ProductCard from "./ProductCard";
import Lenis from "lenis";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

import {
  Package2,
  Filter,
  BadgePercent,
  TimerReset,
  Search,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Trash,
} from "lucide-react";

// Memoized product item wrapper to prevent unnecessary re-renders with animations
const MemoizedProductItem = memo(({ product, isNew }) => (
  <motion.div
    initial={isNew ? { opacity: 0, scale: 0.8, y: 20 } : false}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ 
      duration: 0.5, 
      ease: [0.34, 1.56, 0.64, 1],
      type: "spring",
      stiffness: 100
    }}
    layout
  >
    <ProductCard product={product} />
  </motion.div>
));
MemoizedProductItem.displayName = "MemoizedProductItem";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [newProductIds, setNewProductIds] = useState(new Set());
  const [sort, setSort] = useState("newest");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const lenisRef = useRef();
  const initialLoadRef = useRef(true);

  useEffect(() => {
    lenisRef.current = new Lenis({ lerp: 0.07 });
    return () => lenisRef.current.destroy();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handler);
    }
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  // Nova logika: vraća price i originalPrice
  // function withDiscount(product) {
  //   let percent = 0.10; // 10% popusta za proizvode ispod 14k
  //   if (product.price > 40000 && product.price < 500000) percent = 0.25;
  //   else if (product.price < 14000) percent = 0.1;
  //   else if (product.price > 500000) percent = 0.3;
  //   let originalPrice = Math.round(product.price / (1 - percent));
  //   return { ...product, originalPrice, discountPercent: Math.round(percent*100) };
  // }

  function addDiscountInfo(product) {
    let percent = 0.1; // 10% popusta za proizvode ispod 14k
    if (product.price > 40000 && product.price < 500000) percent = 0.25;
    else if (product.price < 14000) percent = 0.1;
    else if (product.price > 500000) percent = 0.3;
    let originalPrice = Math.round(product.price / (1 - percent));
    return {
      ...product,
      originalPrice,
      discountPercent: Math.round(percent * 100),
    };
  }

  // Real-time listener with onSnapshot for products
  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newIds = new Set();
      
      // Detect new products (only for non-initial loads)
      if (!initialLoadRef.current) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            newIds.add(change.doc.id);
          }
        });
      }
      
      let arr = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .map(addDiscountInfo);
      
      setProducts(arr);
      
      // Mark new products for animation
      if (newIds.size > 0) {
        setNewProductIds(newIds);
        // Clear the new product markers after animation completes
        setTimeout(() => setNewProductIds(new Set()), 1000);
      }
      
      const kats = Array.from(
        new Set(arr.map((p) => p.category).filter(Boolean))
      ).sort((a, b) => a.localeCompare(b, "sr", { numeric: true }));
      setCategories(kats);

      const prices = arr
        .map((p) =>
          p.price !== null && p.price !== undefined
            ? p.price
            : p.hiddenPrice !== null && p.hiddenPrice !== undefined
            ? p.hiddenPrice
            : null
        )
        .filter(Number);
      
      if (prices.length > 0) {
        setMinPrice(Math.min(...prices));
        setMaxPrice(Math.max(...prices));
        setPriceRange([Math.min(...prices), Math.max(...prices)]);
      }
      
      // Mark initial load as complete
      initialLoadRef.current = false;
    }, (error) => {
      console.error("Error fetching products:", error);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const getEffectivePrice = useCallback((product) => {
    // Vraća cenu koja treba da se koristi za sortiranje/filter
    return product.price !== null && product.price !== undefined
      ? product.price
      : product.hiddenPrice !== null && product.hiddenPrice !== undefined
      ? product.hiddenPrice
      : 0;
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        (selectedCategories.length === 0 ||
          selectedCategories.includes(p.category)) &&
        getEffectivePrice(p) >= priceRange[0] &&
        getEffectivePrice(p) <= priceRange[1] &&
        p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, selectedCategories, priceRange, search, getEffectivePrice]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    if (sort === "lowest") {
      sorted.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
    } else if (sort === "highest") {
      sorted.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
    } else if (sort === "newest") {
      sorted.sort((a, b) => {
        if (
          a.createdAt &&
          b.createdAt &&
          a.createdAt.seconds &&
          b.createdAt.seconds
        ) {
          return b.createdAt.seconds - a.createdAt.seconds;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }
    return sorted;
  }, [filteredProducts, sort, getEffectivePrice]);

  const handleResetFilters = useCallback(() => {
    setSelectedCategories([]);
    setSearch("");
    setPriceRange([minPrice, maxPrice]);
    setSort("newest");
  }, [minPrice, maxPrice]);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  }, []);

  const Arrow = (
    <span
      className={`inline-block transition-transform duration-300 ml-2 ${
        filtersOpen ? "" : "rotate-180"
      }`}
      style={{ fontSize: 28, lineHeight: 0.8 }}
    >
      ▼
    </span>
  );

  return (
    <div
      className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8 font-sans"
      style={{ fontFamily: "'Geist','Inter',sans-serif" }}
    >
      {/* Collapsible dizajn header */}
      <div
        className="mb-6 sm:mb-8 bg-white/95 backdrop-blur rounded-2xl shadow-xl w-full"
        style={{ overflow: "visible" }}
      >
        <button
          className={`flex justify-between items-center w-full bg-gradient-to-r from-bluegreen to-midnight text-white px-4 sm:px-7 py-4 sm:py-5 ${
            filtersOpen ? "rounded-t-2xl" : "rounded-2xl"
          } shadow font-bold text-xl sm:text-2xl tracking-wide uppercase`}
          onClick={() => setFiltersOpen((open) => !open)}
          style={{
            borderBottom: "1px solid #e5e7eb",
            fontFamily: "'Geist','Inter',sans-serif",
          }}
        >
          <span className="flex items-center gap-3">
            <Filter size={28} /> Filteri i pretraga
          </span>
          <span
            className={`ml-2 transition-transform duration-300`}
            style={{ fontSize: 28, lineHeight: 0.8 }}
          >
            {filtersOpen ? <ChevronUp /> : <ChevronDown />}
          </span>
        </button>
        <div
          className={`${
            filtersOpen
              ? "max-h-[900px] py-4 sm:py-7 px-3 sm:px-6"
              : "max-h-0 py-0 px-0"
          } transition-all duration-700`}
          style={{ overflow: filtersOpen ? "visible" : "hidden" }}
        >
          {filtersOpen && (
            <form className="flex flex-col gap-5 w-full sm:grid sm:grid-cols-2 sm:grid-rows-2 sm:gap-7 items-start animate-fadein">
              {/* Pretraga */}
              <div className="flex flex-col gap-2 w-full order-1">
                <label className="text-charcoal font-semibold text-sm flex items-center gap-2">
                  <Search size={18} /> Pretraži
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pretraga po imenu proizvoda..."
                  className="border-bone border rounded-xl py-2 px-4 bg-bone/40 shadow focus:ring focus:ring-bluegreen text-base w-full font-medium transition-all"
                />
              </div>
              {/* Kategorije */}
              <div
                className="relative flex flex-col gap-2 w-full order-2"
                ref={dropdownRef}
              >
                <label className="text-charcoal font-semibold text-sm flex gap-2 items-center">
                  <BadgePercent size={18} /> Kategorije
                </label>
                <button
                  type="button"
                  className="border rounded-xl px-5 py-2 bg-bone text-charcoal w-full text-left shadow hover:bg-bluegreen/10 transition flex justify-between items-center text-base font-semibold"
                  onClick={() => setDropdownOpen((open) => !open)}
                >
                  <span className="truncate mr-2">
                    {selectedCategories.length > 0
                      ? selectedCategories.length === 1
                        ? selectedCategories[0]
                        : `${selectedCategories.length} odabranih`
                      : "Odaberi kategorije..."}
                  </span>
                  <span className="ml-1">
                    {dropdownOpen ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </span>
                </button>
                {dropdownOpen && (
                  <div
                    className="absolute left-0 top-full mt-2 mb-2 w-full bg-white rounded-xl border shadow-2xl px-2 py-3 z-50 animate-fadein"
                    style={{
                      minWidth: "200px",
                      maxHeight: "220px",
                      overflowY: "auto",
                    }}
                    data-lenis-prevent
                  >
                    {categories.map((cat) => (
                      <label
                        key={cat}
                        className="flex items-center px-2 py-2 rounded cursor-pointer hover:bg-bluegreen/10 font-semibold text-base transition"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => handleCategoryChange(cat)}
                          className="mr-2 accent-bluegreen h-4 w-4 transition"
                        />
                        <span className="text-gray-700 truncate">{cat}</span>
                      </label>
                    ))}
                    {selectedCategories.length > 0 && (
                      <button
                        type="button"
                        className="mt-2 px-3 py-2 rounded-lg bg-red-500 text-white font-semibold shadow hover:bg-red-600 w-full text-base"
                        onClick={() => {
                          setSelectedCategories([]);
                          setDropdownOpen(false);
                        }}
                      >
                        Obriši sve kategorije
                      </button>
                    )}
                  </div>
                )}
              </div>
              {/* Cena */}
              <div className="flex flex-col gap-2 w-full order-3">
                <label className="text-charcoal font-semibold text-sm flex items-center gap-2">
                  <DollarSign size={18} /> Cena ({priceRange[0]} -{" "}
                  {priceRange[1]} RSD)
                </label>
                <div className="flex flex-col gap-2 items-start">
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value), priceRange[1]])
                      }
                      className="accent-bluegreen flex-1 min-w-0"
                    />
                    <span className="font-semibold text-xs whitespace-nowrap">
                      {priceRange[0]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="accent-bluegreen flex-1 min-w-0"
                    />
                    <span className="font-semibold text-xs whitespace-nowrap">
                      {priceRange[1]}
                    </span>
                  </div>
                </div>
              </div>
              {/* Sortiranje i reset */}
              <div className="flex flex-col gap-2 w-full order-4">
                <label className="text-charcoal font-semibold text-sm flex items-center gap-2">
                  <Package2 size={18} /> Sortiraj
                </label>
                <div>
                  <select
                    className="appearance-none border rounded-xl px-5 py-2 font-semibold shadow focus:ring outline-none bg-bone text-charcoal transition w-full text-base"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="newest">Najnovije</option>
                    <option value="lowest">Najjeftinije</option>
                    <option value="highest">Najskuplje</option>
                  </select>
                </div>
                <button
                  type="button"
                  className="px-5 py-2 rounded-xl bg-rust text-white font-bold shadow-md hover:bg-bluegreen w-full transition-colors text-base mt-2 flex items-center justify-center gap-2"
                  onClick={handleResetFilters}
                >
                  <Trash size={18} /> Resetuj sve filtere
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Proizvodi - grid dizajn (responsive, razmak) */}
      <AnimatePresence mode="popLayout">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 xl:gap-10"
          layout
        >
          {sortedProducts.length === 0 ? (
            <motion.div 
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="col-span-full text-center text-lg sm:text-xl text-rust mt-8 sm:mt-12 px-4 font-bold"
            >
              Nema rezultata za zadate filtere.
            </motion.div>
          ) : (
            sortedProducts.map((product) => (
              <MemoizedProductItem 
                key={product.id} 
                product={product} 
                isNew={newProductIds.has(product.id)}
              />
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
