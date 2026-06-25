import UserManagementTab from "../../../components/admin/licensing/UserManagementTab";

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-admin-surface-tint">
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 pt-5 sm:pt-6">
        <UserManagementTab />
      </div>
    </div>
  );
}
