"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usersService } from "@/features/users/usersService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function UsersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [q, setQ] = useState("");

  async function load() {
    try {
      setLoading(true);
      const res = await usersService.list();
      setUsers(res?.users || res?.data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = users.filter((u) =>
    `${u.name} ${u.email} ${u.phone}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Users</h2>
          <p className="text-muted-foreground">Manage platform users and roles</p>
        </div>
        <Button onClick={() => router.push("/users/new")}>New User</Button>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Search users..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-64"
        />
        <Button variant="ghost" onClick={load} disabled={loading}>
          Refresh
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Phone</th>
              <th className="text-left p-3">Country</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.phone}</td>
                <td className="p-3">{u.country}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => router.push(`/users/${u._id}/edit`)}>
                      Edit
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td className="p-4 text-center text-muted-foreground" colSpan={6}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
