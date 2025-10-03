import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  return (
    <nav className="bg-white shadow p-2 sm:p-4">
      <ul className="flex flex-col sm:flex-row sm:justify-center gap-2 sm:gap-6 list-none m-0 p-0">
        {[
          { name: "Početna", path: "/" },
          { name: "Proizvodi", path: "/proizvodi" },
          { name: "Usluge", path: "/usluge" },
          { name: "Kontakt", path: "/kontakt" },
          { name: "O nama", path: "/onama" }
        ].map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`transition-colors font-semibold px-4 py-2 rounded-full
                ${location.pathname === item.path ? 'bg-blue-600 text-white' : 'text-blue-700 hover:bg-blue-100'}
              `}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
