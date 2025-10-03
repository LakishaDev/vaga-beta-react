import { useEffect, useState, useRef } from "react";
import { db } from "../../utils/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import ProductCard from "./ProductCard";

import {
  Package2,
  Filter,
  BadgePercent,
  TimerReset,
  Search,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Trash
} from "lucide-react";


export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState("newest");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

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

  useEffect(() => {
    let q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    getDocs(q).then(snapshot => {
      let arr = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(arr);
      const kats = Array.from(new Set(arr.map(p => p.category).filter(Boolean)))
        .sort((a, b) => a.localeCompare(b, 'sr', { numeric: true }));
      setCategories(kats);

      const prices = arr.map(p => p.price).filter(Number);
      setMinPrice(Math.min(...prices));
      setMaxPrice(Math.max(...prices));
      setPriceRange([Math.min(...prices), Math.max(...prices)]);
    });
  }, []);

  let filteredProducts = products
    .filter(p =>
      (selectedCategories.length === 0 || selectedCategories.includes(p.category)) &&
      p.price >= priceRange[0] &&
      p.price <= priceRange[1] &&
      p.name.toLowerCase().includes(search.toLowerCase()));

  let sortedProducts = [...filteredProducts];
  if (sort === "lowest") sortedProducts.sort((a, b) => a.price - b.price);
  if (sort === "highest") sortedProducts.sort((a, b) => b.price - a.price);
  if (sort === "newest") sortedProducts.sort((a, b) => {
    if (a.createdAt && b.createdAt && a.createdAt.seconds && b.createdAt.seconds) {
      return b.createdAt.seconds - a.createdAt.seconds;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSearch("");
    setPriceRange([minPrice, maxPrice]);
    setSort("newest");
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
  };

  const Arrow = (
    <span className={`inline-block transition-transform duration-300 ml-2 ${filtersOpen ? "" : "rotate-180"}`} style={{ fontSize: 28, lineHeight: 0.8 }}>▼</span>
  );

  return (
  <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8 font-sans" style={{ fontFamily: "'Geist','Inter',sans-serif" }}>
    {/* Collapsible dizajn header */}
    <div className="mb-6 sm:mb-8 bg-white/95 backdrop-blur rounded-2xl shadow-xl w-full" style={{ overflow: 'visible' }}>
      <button
        className="flex justify-between items-center w-full bg-gradient-to-r from-bluegreen to-midnight text-white px-4 sm:px-7 py-4 sm:py-5 rounded-t-2xl shadow font-bold text-xl sm:text-2xl tracking-wide uppercase"
        onClick={() => setFiltersOpen(open => !open)}
        style={{ borderBottom: "1px solid #e5e7eb", fontFamily: "'Geist','Inter',sans-serif" }}
      >
        <span className="flex items-center gap-3"><Filter size={28}/> Filteri i pretraga</span>
        <span className={`ml-2 transition-transform duration-300`} style={{ fontSize: 28, lineHeight: 0.8 }}>
          {filtersOpen ? <ChevronUp /> : <ChevronDown />}
        </span>
      </button>
      <div className={`${filtersOpen ? "max-h-[900px] py-4 sm:py-7 px-3 sm:px-6" : "max-h-0 py-0 px-0"} transition-all duration-700`} style={{ overflow: filtersOpen ? 'visible' : 'hidden' }}>
        {filtersOpen && (
          <form className="flex flex-col gap-5 w-full sm:grid sm:grid-cols-2 sm:grid-rows-2 sm:gap-7 items-start animate-fadein">
            {/* Pretraga */}
            <div className="flex flex-col gap-2 w-full order-1">
              <label className="text-charcoal font-semibold text-sm flex items-center gap-2"><Search size={18}/> Pretraži</label>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Pretraga po imenu proizvoda..."
                className="border-bone border rounded-xl py-2 px-4 bg-bone/40 shadow focus:ring focus:ring-bluegreen text-base w-full font-medium transition-all"
              />
            </div>
            {/* Kategorije */}
            <div className="relative flex flex-col gap-2 w-full order-2" ref={dropdownRef}>
              <label className="text-charcoal font-semibold text-sm flex gap-2 items-center"><BadgePercent size={18}/> Kategorije</label>
              <button
                type="button"
                className="border rounded-xl px-5 py-2 bg-bone text-charcoal font-medium w-full text-left shadow hover:bg-bluegreen/10 transition flex justify-between items-center text-base font-semibold"
                onClick={() => setDropdownOpen(open => !open)}
              >
                <span className="truncate mr-2">
                  {selectedCategories.length > 0
                    ? (selectedCategories.length === 1
                      ? selectedCategories[0]
                      : `${selectedCategories.length} odabranih`)
                    : 'Odaberi kategorije...'}
                </span>
                <span className="ml-1">{dropdownOpen ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}</span>
              </button>
              {dropdownOpen && (
                <div
                  className="absolute left-0 bottom-full mb-2 w-full bg-white rounded-xl border shadow-2xl px-2 py-3 z-50 animate-fadein"
                  style={{ minWidth: '200px', maxHeight: '220px', overflowY: 'auto' }}
                >
                  {categories.map(cat => (
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
              <label className="text-charcoal font-semibold text-sm flex items-center gap-2"><DollarSign size={18}/> Cena ({priceRange[0]} - {priceRange[1]} RSD)</label>
              <div className="flex flex-col gap-2 items-start">
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange[0]}
                    onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="accent-bluegreen flex-1 min-w-0"
                  />
                  <span className="font-semibold text-xs whitespace-nowrap">{priceRange[0]}</span>
                </div>
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="accent-bluegreen flex-1 min-w-0"
                  />
                  <span className="font-semibold text-xs whitespace-nowrap">{priceRange[1]}</span>
                </div>
              </div>
            </div>
            {/* Sortiranje i reset */}
            <div className="flex flex-col gap-2 w-full order-4">
              <label className="text-charcoal font-semibold text-sm flex items-center gap-2"><Package2 size={18}/> Sortiraj</label>
              <div>
                <select
                  className="appearance-none border rounded-xl px-5 py-2 font-semibold shadow focus:ring outline-none bg-bone text-charcoal transition w-full text-base"
                  value={sort}
                  onChange={e => setSort(e.target.value)}
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
                <Trash size={18}/> Resetuj sve filtere
              </button>
            </div>
          </form>
        )}
      </div>
    </div>

    {/* Proizvodi - grid dizajn (responsive, razmak) */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 xl:gap-10">
      {sortedProducts.length === 0 ? (
        <div className="col-span-full text-center text-lg sm:text-xl text-rust mt-8 sm:mt-12 animate-fadein px-4 font-bold">
          Nema rezultata za zadate filtere.
        </div>
      ) : (
        sortedProducts.map(product => (
          <div key={product.id} className="animate-fadein">
            <ProductCard product={product} />
          </div>
        ))
      )}
    </div>
  </div>
);

}
