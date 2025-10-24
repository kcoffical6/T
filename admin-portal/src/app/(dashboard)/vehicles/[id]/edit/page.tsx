"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/store";
import { updateVehicle } from "@/features/vehicles/vehiclesSlice";
import { vehiclesService } from "@/features/vehicles/vehiclesService";
import { packagesService } from "@/features/packages/packagesService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormLabel } from "@/components/ui/form";
import { Loader2 } from "lucide-react";

export default function EditVehiclePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [vehicle, setVehicle] = useState<any>(null);
  const [form, setForm] = useState<any>({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    type: "suv",
    seatingCapacity: 7,
    basePricePerDay: 0,
    description: "",
    images: [] as string[],
    driver: { name: "", mobile: "", experience: 0, licenseNumber: "" },
  });

  async function load() {
    try {
      setLoading(true);
      const v = await vehiclesService.getById(params.id);
      setVehicle(v);
      setForm({
        make: v.make,
        model: v.model || v.vehicleModel,
        year: v.year,
        type: v.type,
        seatingCapacity: v.seatingCapacity,
        basePricePerDay: v.basePricePerDay,
        description: v.description || "",
        images: v.images || [],
        driver: {
          name: v?.driver?.name || "",
          mobile: v?.driver?.mobile || "",
          experience: v?.driver?.experience || 0,
          licenseNumber: v?.driver?.licenseNumber || "",
        },
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmitting(true);
      let images: string[] = form.images || [];
      if (files.length > 0) {
        const uploaded = await packagesService.upload(files);
        images = [...images, ...uploaded];
      }
      const payload = {
        make: form.make,
        model: form.model,
        year: Number(form.year),
        type: form.type,
        seatingCapacity: Number(form.seatingCapacity),
        basePricePerDay: Number(form.basePricePerDay),
        description: form.description,
        images,
        driver: {
          name: form.driver.name,
          mobile: form.driver.mobile,
          experience: Number(form.driver.experience),
          licenseNumber: form.driver.licenseNumber,
        },
      } as any;

      const result = await dispatch(
        // @ts-ignore
        updateVehicle({ id: params.id, payload }) as any
      );
      if ((result as any).type?.endsWith("/fulfilled")) {
        router.push("/vehicles");
      } else {
        throw new Error((result as any).payload || "Failed to update vehicle");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-muted-foreground flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading vehicle...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Edit Vehicle</h2>
        <p className="text-muted-foreground">Update vehicle details and images</p>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormLabel>Make</FormLabel>
                <Input value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} />
              </div>
              <div>
                <FormLabel>Model</FormLabel>
                <Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
              </div>
              <div>
                <FormLabel>Year</FormLabel>
                <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />
              </div>
              <div>
                <FormLabel>Type</FormLabel>
                <Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
              </div>
              <div>
                <FormLabel>Seating Capacity</FormLabel>
                <Input type="number" value={form.seatingCapacity} onChange={(e) => setForm({ ...form, seatingCapacity: Number(e.target.value) })} />
              </div>
              <div>
                <FormLabel>Base Price / Day</FormLabel>
                <Input type="number" value={form.basePricePerDay} onChange={(e) => setForm({ ...form, basePricePerDay: Number(e.target.value) })} />
              </div>
            </div>

            <div>
              <FormLabel>Description</FormLabel>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="space-y-2">
              <FormLabel>Existing Images</FormLabel>
              <div className="flex flex-wrap gap-2">
                {(form.images || []).map((src: string, idx: number) => (
                  <img key={idx} src={src} alt="image" className="h-16 w-16 object-cover rounded" />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <FormLabel>Add Images</FormLabel>
              <Input
                type="file"
                accept="image/png,image/jpeg,image/webp,application/pdf"
                multiple
                onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files) : [])}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
              <Button type="button" variant="ghost" onClick={() => router.push("/vehicles")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
