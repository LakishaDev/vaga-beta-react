// src/components/admin/licensing/UserTable.jsx
// ===============================================================================
// USER TABLE - Tabela korisnika za eVagaClientMobile
// ===============================================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  EditIcon,
  TrashIcon,
  KeyIcon,
  ShieldIcon,
  UserIcon,
  PackageIcon,
  CheckIcon,
  XCloseIcon,
  MenuIcon,
  MailIcon,
} from "../../icons";
import UserMobileCard from "./UserMobileCard";

/**
 * Role badge komponenta - Responsive
 */
const RoleBadge = ({ role }) => {
  const roleConfig = {
    admin: {
      color: "from-purple-500 to-violet-500",
      icon: ShieldIcon,
      label: "Admin",
    },
    operator: {
      color: "from-blue-500 to-cyan-500",
      icon: UserIcon,
      label: "Operator",
    },
    user: {
      color: "from-green-500 to-emerald-500",
      icon: UserIcon,
      label: "User",
    },
  };

  const config = roleConfig[role] || roleConfig.user;
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-gradient-to-r ${config.color} text-white text-xs font-semibold shadow-sm`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </div>
  );
};

/**
 * Product badges komponenta
 */
const ProductBadges = ({ proizvodi = [] }) => {
  const productConfig = {
    evagahub: {
      color: "bg-blue-100 text-blue-700 border-blue-200",
      label: "eVagaHub",
    },
    evagatruck: {
      color: "bg-green-100 text-green-700 border-green-200",
      label: "eVagaTruck",
    },
  };

  if (!proizvodi || proizvodi.length === 0) {
    return <span className="text-xs text-gray-400">Nema proizvoda</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {proizvodi.map((product) => {
        const config =
          productConfig[product] || productConfig.evagahub;
        return (
          <span
            key={product}
            className={`px-2 py-0.5 rounded-md text-xs font-medium border ${config.color}`}
          >
            {config.label}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Action menu komponenta
 */
const ActionMenu = ({ user, onEdit, onDelete, onChangePassword }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MenuIcon className="w-4 h-4 text-gray-600" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 overflow-hidden"
            >
              <button
                onClick={() => {
                  onEdit(user);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700 transition-colors"
              >
                <EditIcon className="w-4 h-4" />
                Izmeni
              </button>
              <button
                onClick={() => {
                  onChangePassword(user);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700 transition-colors"
              >
                <KeyIcon className="w-4 h-4" />
                Promeni lozinku
              </button>
              <div className="border-t border-gray-100 my-2" />
              <button
                onClick={() => {
                  onDelete(user);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600 transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
                Obriši
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * User Table komponenta
 */
export default function UserTable({
  users = [],
  onEdit,
  onDelete,
  onChangePassword,
  onToggleActive,
}) {
  if (users.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl border border-gray-200"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <UserIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
        </motion.div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
          Nema korisnika
        </h3>
        <p className="text-sm sm:text-base text-gray-500 px-4">
          Kreirajte prvog korisnika za eVagaClientMobile aplikaciju
        </p>
      </motion.div>
    );
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        <AnimatePresence>
          {users.map((user) => (
            <UserMobileCard
              key={user.id}
              user={user}
              onEdit={onEdit}
              onDelete={onDelete}
              onChangePassword={onChangePassword}
              onToggleActive={onToggleActive}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto" data-lenis-prevent>
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Korisnik
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Rola
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Proizvodi
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Admin
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Akcije
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <AnimatePresence>
              {users.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onToggleActive(user)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        user.active
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-gray-100 text-gray-700 border border-gray-200"
                      }`}
                    >
                      {user.active ? (
                        <>
                          <CheckIcon className="w-3 h-3" />
                          Aktivan
                        </>
                      ) : (
                        <>
                          <XCloseIcon className="w-3 h-3" />
                          Neaktivan
                        </>
                      )}
                    </motion.button>
                  </td>

                  {/* Korisnik Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-bluegreen to-sheen rounded-full flex items-center justify-center text-white font-bold">
                        {user.displayName?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {user.displayName || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <MailIcon className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Rola */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RoleBadge role={user.role} />
                  </td>

                  {/* Proizvodi */}
                  <td className="px-6 py-4">
                    <ProductBadges proizvodi={user.proizvodi} />
                  </td>

                  {/* Admin Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.isAdmin ? (
                      <div className="inline-flex items-center gap-1.5 text-purple-600">
                        <ShieldIcon className="w-4 h-4" />
                        <span className="text-sm font-semibold">Da</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 text-gray-400">
                        <XCloseIcon className="w-4 h-4" />
                        <span className="text-sm">Ne</span>
                      </div>
                    )}
                  </td>

                  {/* Akcije */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <ActionMenu
                      user={user}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onChangePassword={onChangePassword}
                    />
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}
