// src/components/admin/licensing/UserMobileCard.jsx
// Mobile-optimized card view for users
import { motion } from "framer-motion";
import { useState } from "react";
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
} from "../../icons";

const UserMobileCard = ({ user, onEdit, onDelete, onChangePassword, onToggleActive }) => {
  const [showActions, setShowActions] = useState(false);

  const roleConfig = {
    admin: { color: "from-purple-500 to-violet-500", icon: ShieldIcon, label: "Admin" },
    operator: { color: "from-blue-500 to-cyan-500", icon: UserIcon, label: "Operator" },
    user: { color: "from-green-500 to-emerald-500", icon: UserIcon, label: "User" },
  };

  const config = roleConfig[user.role] || roleConfig.user;
  const RoleIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-admin-primary to-admin-accent flex items-center justify-center flex-shrink-0">
            <UserIcon className="w-6 h-6 text-white" />
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {user.displayName || user.email}
            </h3>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>

        {/* Menu Button */}
        <button
          onClick={() => setShowActions(!showActions)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        >
          <MenuIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Status & Role */}
      <div className="flex items-center gap-2 mb-3">
        {/* Status Badge */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onToggleActive(user)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
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

        {/* Role Badge */}
        <div
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r ${config.color} text-white text-xs font-semibold`}
        >
          <RoleIcon className="w-3 h-3" />
          {config.label}
        </div>

        {/* Admin Badge */}
        {user.isAdmin && (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold">
            <ShieldIcon className="w-3 h-3" />
            Admin
          </div>
        )}
      </div>

      {/* Products */}
      {user.proizvodi && user.proizvodi.length > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <PackageIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="flex flex-wrap gap-1.5">
            {user.proizvodi.map((product) => (
              <span
                key={product}
                className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md font-medium"
              >
                {product === "evagahub" ? "eVagaHub" : "eVagaClient"}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions Menu */}
      {showActions && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="pt-3 border-t border-gray-200 space-y-2"
        >
          <button
            onClick={() => {
              onEdit(user);
              setShowActions(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors text-left"
          >
            <EditIcon className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Izmeni</span>
          </button>

          <button
            onClick={() => {
              onChangePassword(user);
              setShowActions(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-yellow-50 rounded-lg transition-colors text-left"
          >
            <KeyIcon className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-gray-700">Promeni lozinku</span>
          </button>

          <button
            onClick={() => {
              onDelete(user);
              setShowActions(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors text-left"
          >
            <TrashIcon className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-gray-700">Obriši</span>
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UserMobileCard;
