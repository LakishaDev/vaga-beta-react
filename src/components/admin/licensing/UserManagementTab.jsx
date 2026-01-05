// src/components/admin/licensing/UserManagementTab.jsx
// ===============================================================================
// USER MANAGEMENT TAB - Tab za upravljanje korisnicima
// ===============================================================================

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  UsersIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon,
  ShieldIcon,
  CheckIcon,
  XCloseIcon,
  PackageIcon,
  AlertCircleIcon,
  KeyIcon,
  TrashIcon,
} from "../../icons";
import {
  subscribeToUsers,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  toggleUserActive,
  filterUsers,
} from "../../../services/userService";
import UserTable from "./UserTable";
import UserCreateModal from "./UserCreateModal";
import UserEditDrawer from "./UserEditDrawer";
import ErrorBoundary from "../../ErrorBoundary";

/**
 * Stats Card komponenta - Responsive & Mobile Optimized
 */
const StatsCard = ({ icon: Icon, label, value, color = "blue" }) => {
  const colorStyles = {
    blue: "from-blue-500 to-cyan-500",
    green: "from-green-500 to-emerald-500",
    red: "from-red-500 to-rose-500",
    purple: "from-purple-500 to-violet-500",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${colorStyles[color]} flex items-center justify-center shadow-lg flex-shrink-0 ml-3`}
        >
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Filter Badge komponenta - Touch Optimized
 */
const FilterBadge = ({ label, isActive, onClick, icon: Icon }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${
        isActive
          ? "bg-gradient-to-r from-bluegreen to-sheen text-white shadow-lg shadow-bluegreen/25"
          : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
      }`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />}
      <span className="hidden xs:inline">{label}</span>
      <span className="xs:hidden">{label.split(' ')[0]}</span>
    </motion.button>
  );
};

/**
 * User Management Tab komponenta
 */
function UserManagementTabContent() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    active: "all",
    role: "all",
    proizvod: "all",
  });

  // Modals & Drawers
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Subscribe to users
  useEffect(() => {
    const unsubscribe = subscribeToUsers((usersData) => {
      setUsers(usersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter users
  useEffect(() => {
    const filtered = filterUsers(users, {
      ...filters,
      search: searchQuery,
    });
    setFilteredUsers(filtered);
  }, [users, filters, searchQuery]);

  // Stats
  const stats = {
    total: users.length,
    active: users.filter((u) => u.active).length,
    inactive: users.filter((u) => !u.active).length,
    admins: users.filter((u) => u.isAdmin).length,
  };

  // Handlers with Optimistic Updates
  const handleCreateUser = async (userData) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticUser = {
      id: tempId,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Optimistic update
    setUsers((prev) => [optimisticUser, ...prev]);

    try {
      await createUser(userData);
      toast.success("Korisnik uspešno kreiran!");
    } catch (error) {
      // Rollback on error
      setUsers((prev) => prev.filter((u) => u.id !== tempId));
      toast.error(error.message || "Greška pri kreiranju korisnika");
      throw error;
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    // Save original for rollback
    const originalUsers = [...users];
    
    // Optimistic update
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, ...userData, updatedAt: new Date() } : u
      )
    );

    try {
      await updateUser(userId, userData);
      toast.success("Korisnik uspešno ažuriran!");
    } catch (error) {
      // Rollback on error
      setUsers(originalUsers);
      toast.error(error.message || "Greška pri ažuriranju korisnika");
      throw error;
    }
  };

  const handleDeleteUser = async (user) => {
    if (
      !window.confirm(
        `Da li ste sigurni da želite da obrišete korisnika ${user.displayName}?`
      )
    ) {
      return;
    }

    // Save original for rollback
    const originalUsers = [...users];
    
    // Optimistic update
    setUsers((prev) => prev.filter((u) => u.id !== user.id));

    try {
      await deleteUser(user.id);
      toast.success("Korisnik uspešno obrisan!");
    } catch (error) {
      // Rollback on error
      setUsers(originalUsers);
      toast.error(error.message || "Greška pri brisanju korisnika");
    }
  };

  const handleChangePassword = async (user) => {
    const newPassword = window.prompt(
      `Unesite novu lozinku za ${user.displayName}:`
    );

    if (!newPassword) {
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Lozinka mora imati najmanje 6 karaktera");
      return;
    }

    const loadingToast = toast.loading("Promena lozinke...");

    try {
      await changePassword(user.id, newPassword);
      toast.success("Lozinka uspešno promenjena!", { id: loadingToast });
    } catch (error) {
      toast.error(error.message || "Greška pri promeni lozinke", {
        id: loadingToast,
      });
    }
  };

  const handleToggleActive = async (user) => {
    // Save original for rollback
    const originalUsers = [...users];
    const newStatus = !user.active;
    
    // Optimistic update
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, active: newStatus, updatedAt: new Date() } : u
      )
    );

    try {
      await toggleUserActive(user.id, user.active);
      toast.success(`Korisnik ${user.active ? "deaktiviran" : "aktiviran"}!`);
    } catch (error) {
      // Rollback on error
      setUsers(originalUsers);
      toast.error(error.message || "Greška pri promeni statusa");
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditDrawerOpen(true);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-96"
      >
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-bluegreen/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-bluegreen border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Učitavanje korisnika...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4 sm:space-y-6 px-3 sm:px-0"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: UsersIcon, label: "Ukupno korisnika", value: stats.total, color: "blue" },
          { icon: CheckIcon, label: "Aktivni", value: stats.active, color: "green" },
          { icon: XCloseIcon, label: "Neaktivni", value: stats.inactive, color: "red" },
          { icon: ShieldIcon, label: "Administratori", value: stats.admins, color: "purple" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Search & Add Button Row */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Pretraži..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-bluegreen/20 focus:border-bluegreen transition-all"
              />
            </div>

            {/* Create Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-bluegreen to-sheen text-white rounded-lg sm:rounded-xl font-semibold hover:shadow-lg hover:shadow-bluegreen/25 transition-all flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap"
            >
              <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">Dodaj korisnika</span>
              <span className="xs:hidden">Dodaj</span>
            </motion.button>
          </div>

        {/* Filters */}
        <motion.div className="pt-3 sm:pt-4 border-t border-gray-200">
          {/* Mobile Filter Toggle */}
          <div className="sm:hidden mb-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FilterIcon className="w-4 h-4" />
                Filteri
              </span>
              <motion.span
                animate={{ rotate: showFilters ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                ▼
              </motion.span>
            </motion.button>
          </div>

          {/* Filter Content */}
          <div className={`space-y-3 ${showFilters ? 'block' : 'hidden sm:block'}`}>
            {/* Active Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 w-full sm:w-auto mb-1 sm:mb-0">
                <FilterIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                <span className="text-xs sm:text-sm font-semibold text-gray-700">
                  Status:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <FilterBadge
                  label="Svi"
                  isActive={filters.active === "all"}
                  onClick={() => setFilters({ ...filters, active: "all" })}
                />
                <FilterBadge
                  label="Aktivni"
                  isActive={filters.active === true}
                  onClick={() => setFilters({ ...filters, active: true })}
                  icon={CheckIcon}
                />
                <FilterBadge
                  label="Neaktivni"
                  isActive={filters.active === false}
                  onClick={() => setFilters({ ...filters, active: false })}
                  icon={XCloseIcon}
                />
              </div>
            </div>

            <div className="border-t border-gray-200 sm:hidden" />

            {/* Role Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold text-gray-700 w-full sm:w-auto">
                Rola:
              </span>
              <div className="flex flex-wrap gap-2">
                <FilterBadge
                  label="Sve"
                  isActive={filters.role === "all"}
                  onClick={() => setFilters({ ...filters, role: "all" })}
                />
                <FilterBadge
                  label="Admin"
                  isActive={filters.role === "admin"}
                  onClick={() => setFilters({ ...filters, role: "admin" })}
                  icon={ShieldIcon}
                />
                <FilterBadge
                  label="Operator"
                  isActive={filters.role === "operator"}
                  onClick={() => setFilters({ ...filters, role: "operator" })}
                />
                <FilterBadge
                  label="User"
                  isActive={filters.role === "user"}
                  onClick={() => setFilters({ ...filters, role: "user" })}
                />
              </div>
            </div>

            <div className="border-t border-gray-200 sm:hidden" />

            {/* Product Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold text-gray-700 w-full sm:w-auto">
                Proizvod:
              </span>
              <div className="flex flex-wrap gap-2">
                <FilterBadge
                  label="Svi"
                  isActive={filters.proizvod === "all"}
                  onClick={() => setFilters({ ...filters, proizvod: "all" })}
                />
                <FilterBadge
                  label="eVagaHub"
                  isActive={filters.proizvod === "evagahub"}
                  onClick={() => setFilters({ ...filters, proizvod: "evagahub" })}
                  icon={PackageIcon}
                />
                <FilterBadge
                  label="eVagaTruck"
                  isActive={filters.proizvod === "evagatruck"}
                  onClick={() =>
                    setFilters({ ...filters, proizvod: "evagatruck" })
                  }
                  icon={PackageIcon}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <strong>eVagaClientMobile pristup:</strong> Ovi korisnici mogu da se
          prijave na mobilnu aplikaciju koristeći email i lozinku. Aktivni
          korisnici mogu pristupiti odabranim proizvodima.
        </div>
      </div>

      {/* Table */}
      <UserTable
        users={filteredUsers}
        onEdit={handleEdit}
        onDelete={handleDeleteUser}
        onChangePassword={handleChangePassword}
        onToggleActive={handleToggleActive}
      />

      {/* Modals */}
      <UserCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
      />

      <UserEditDrawer
        isOpen={isEditDrawerOpen}
        user={selectedUser}
        onClose={() => {
          setIsEditDrawerOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleUpdateUser}
      />
    </motion.div>
  );
}

/**
 * Export with Error Boundary wrapper
 */
export default function UserManagementTab() {
  return (
    <ErrorBoundary>
      <UserManagementTabContent />
    </ErrorBoundary>
  );
}
