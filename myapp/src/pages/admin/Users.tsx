import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchProfiles, updateProfileRole } from '../../lib/admin-data';
import type { Profile, UserRole } from '../../types';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { SkeletonTableRows } from '../../components/admin/SkeletonCard';

export function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchProfiles()
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleRoleChange = async (id: string, role: UserRole) => {
    try {
      await updateProfileRole(id, role);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    } catch (e) {
      console.error(e);
    }
  };

  const columns: Column<Profile>[] = [
    {
      key: 'avatar',
      header: '',
      render: (r) => (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E53935]/10 text-sm font-bold text-[#E53935]">
          {(r.name?.[0] ?? r.email?.[0] ?? '?').toUpperCase()}
        </div>
      ),
    },
    { key: 'name', header: 'Name', render: (r) => <span className="font-medium">{r.name}</span> },
    { key: 'email', header: 'Email', render: (r) => <span className="text-gray-600">{r.email}</span> },
    {
      key: 'role',
      header: 'Role',
      render: (r) => (
        <select
          value={r.role}
          onChange={(e) => handleRoleChange(r.id, e.target.value as UserRole)}
          className={`rounded-xl border-0 px-2.5 py-1 text-xs font-medium focus:ring-2 focus:ring-[#E53935]/30 ${
            r.role === 'admin' ? 'bg-[#E53935]/15 text-[#E53935]' : 'bg-gray-100 text-gray-700'
          }`}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Users</h1>
        <p className="mt-1 text-gray-500">Registered users and roles</p>
      </div>

      {loading ? (
        <SkeletonTableRows rows={6} />
      ) : (
        <DataTable
          columns={columns}
          data={users}
          keyExtractor={(r) => r.id}
          emptyMessage="No users yet"
        />
      )}
    </motion.div>
  );
}
