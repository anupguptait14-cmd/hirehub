import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { adminService } from '../../services/adminService';
import { useNotification } from '../../context/NotificationContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Search, UserCheck, ShieldAlert, Shield } from 'lucide-react';

export const ManageUsers = () => {
  const { addToast } = useNotification();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers({ role: roleFilter, search });
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await adminService.updateUser(userId, { status: nextStatus });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: nextStatus } : u))
      );
      addToast(`User status updated to ${nextStatus}`, 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUser(userId, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      addToast(`User role updated to ${newRole}`, 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <Sidebar />

        <main className="flex-1 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">User Governance & Moderation</h1>
            <p className="text-xs text-gray-500">Manage user accounts, roles, and suspension states</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="w-full sm:w-72">
              <Input
                placeholder="Search user by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={Search}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setRoleFilter('')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                  !roleFilter ? 'bg-brand-600 text-white' : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300'
                }`}
              >
                All Roles
              </button>
              <button
                onClick={() => setRoleFilter('candidate')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                  roleFilter === 'candidate' ? 'bg-brand-600 text-white' : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300'
                }`}
              >
                Candidates
              </button>
              <button
                onClick={() => setRoleFilter('recruiter')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                  roleFilter === 'recruiter' ? 'bg-brand-600 text-white' : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300'
                }`}
              >
                Recruiters
              </button>
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500 py-6">Loading users...</p>
          ) : (
            <div className="glass-card rounded-2xl border overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-dark-hover border-b border-gray-200 dark:border-dark-border text-gray-500 uppercase font-semibold">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Joined</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50/50 dark:hover:bg-dark-hover/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={u.avatar?.url} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{u.name}</p>
                            <p className="text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card font-semibold"
                        >
                          <option value="candidate">candidate</option>
                          <option value="recruiter">recruiter</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold ${
                            u.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          size="sm"
                          variant={u.status === 'active' ? 'danger' : 'success'}
                          onClick={() => handleToggleStatus(u._id, u.status)}
                        >
                          {u.status === 'active' ? 'Suspend' : 'Activate'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
