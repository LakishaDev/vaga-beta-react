import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldIcon,
  UserIcon,
  PackageIcon,
  CheckIcon,
  XCloseIcon,
  MailIcon,
} from "../../icons";
import UserMobileCard from "./UserMobileCard";

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
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r ${config.color} text-white text-xs font-semibold shadow-sm`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </div>
  );
};

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
        const config = productConfig[product] || productConfig.evagahub;
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
        className="text-center py-16 bg-white rounded-2xl border border-gray-200"
      >
        <UserIcon className="w-14 h-14 text-gray-300 mx-auto mb-4" />
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          Nema korisnika
        </h3>
        <p className="text-sm text-gray-500">
          Kreirajte prvog korisnika za eVagaClientMobile aplikaciju
        </p>
      </motion.div>
    );
  }

  return (
    <>
      {/* Mobile */}
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

      {/* Desktop */}
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto" data-lenis-prevent>
          <table className="w-full">
            <thead className="bg-admin-navy border-b border-admin-navy">
              <tr>
                {["Status", "Korisnik", "Rola", "Proizvodi", "Admin"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-3.5 text-left text-xs font-semibold text-white/70 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => onEdit(user)}
                    className="hover:bg-admin-surface-tint transition-colors cursor-pointer group"
                  >
                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleActive(user);
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer transition-all hover:opacity-80 ${
                          user.active
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        {user.active ? (
                          <>
                            <CheckIcon className="w-3 h-3" /> Aktivan
                          </>
                        ) : (
                          <>
                            <XCloseIcon className="w-3 h-3" /> Neaktivan
                          </>
                        )}
                      </span>
                    </td>

                    {/* Korisnik */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-admin-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                          {user.displayName
                            ? user.displayName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()
                            : "U"}
                        </div>
                        <div>
                          <div className="font-semibold text-admin-text text-sm group-hover:text-admin-primary transition-colors">
                            {user.displayName || "N/A"}
                          </div>
                          <div className="text-xs text-admin-text-muted flex items-center gap-1 mt-0.5">
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

                    {/* Admin */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isAdmin ? (
                        <div className="inline-flex items-center gap-1.5 text-purple-600">
                          <ShieldIcon className="w-4 h-4" />
                          <span className="text-sm font-semibold">Da</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Ne</span>
                      )}
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
