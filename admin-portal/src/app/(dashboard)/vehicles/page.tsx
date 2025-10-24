"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { vehiclesService } from "@/features/vehicles/vehiclesService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function VehiclesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [q, setQ] = useState("");

  async function load() {
    try {
      setLoading(true);
      const res = await vehiclesService.list();
      const data = res?.data || res?.vehicles || res; // accommodate shapes
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = items.filter((v) =>
    `${v.make} ${v.model} ${v.type}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Vehicles</h2>
          <p className="text-muted-foreground">Manage vehicles inventory</p>
        </div>
        <Button onClick={() => router.push("/vehicles/new")}>New Vehicle</Button>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Search vehicles..."
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
              <th className="text-left p-3">Make</th>
              <th className="text-left p-3">Model</th>
              <th className="text-left p-3">Type</th>
              <th className="text-left p-3">Seats</th>
              <th className="text-left p-3">Price/Day</th>
              <th className="text-left p-3">Available</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v._id || v.id} className="border-t">
                <td className="p-3">{v.make}</td>
                <td className="p-3">{v.model || v.vehicleModel}</td>
                <td className="p-3">{v.type}</td>
                <td className="p-3">{v.seatingCapacity}</td>
                <td className="p-3">{v.basePricePerDay}</td>
                <td className="p-3">{v.isAvailable ? "Yes" : "No"}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => router.push(`/vehicles/${v._id || v.id}/edit`)}>
                      Edit
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td className="p-4 text-center text-muted-foreground" colSpan={7}>
                  No vehicles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
