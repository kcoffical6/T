"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/store";
import { createVehicle } from "@/features/vehicles/vehiclesSlice";
import { packagesService } from "@/features/packages/packagesService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

export default function NewVehiclePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const [form, setForm] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    type: "suv",
    seatingCapacity: 7,
    basePricePerDay: 0,
    description: "",
    driver: { name: "", mobile: "", experience: 0, licenseNumber: "" },
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmitting(true);
      let images: string[] = [];
      if (files.length > 0) {
        images = await packagesService.upload(files);
      }
      const result = await dispatch(
        // @ts-ignore partial typing
        createVehicle({
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
        }) as any
      );
      if ((result as any).type?.endsWith("/fulfilled")) {
        router.push("/vehicles");
      } else {
        throw new Error((result as any).payload || "Failed to create vehicle");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Create Vehicle</h2>
        <p className="text-muted-foreground">Add a new vehicle</p>
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
                <Input
                  value={form.make}
                  onChange={(e) => setForm({ ...form, make: e.target.value })}
                />
              </div>
              <div>
                <FormLabel>Model</FormLabel>
                <Input
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                />
              </div>
              <div>
                <FormLabel>Year</FormLabel>
                <Input
                  type="number"
                  value={form.year}
                  onChange={(e) =>
                    setForm({ ...form, year: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <FormLabel>Type</FormLabel>
                <Input
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                />
              </div>
              <div>
                <FormLabel>Seating Capacity</FormLabel>
                <Input
                  type="number"
                  value={form.seatingCapacity}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      seatingCapacity: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <FormLabel>Base Price / Day</FormLabel>
                <Input
                  type="number"
                  value={form.basePricePerDay}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      basePricePerDay: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div>
              <FormLabel>Description</FormLabel>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormLabel>Driver Name</FormLabel>
                <Input
                  value={form.driver.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      driver: { ...form.driver, name: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <FormLabel>Driver Mobile</FormLabel>
                <Input
                  value={form.driver.mobile}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      driver: { ...form.driver, mobile: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <FormLabel>Experience (years)</FormLabel>
                <Input
                  type="number"
                  value={form.driver.experience}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      driver: {
                        ...form.driver,
                        experience: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>
              <div>
                <FormLabel>License Number</FormLabel>
                <Input
                  value={form.driver.licenseNumber}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      driver: { ...form.driver, licenseNumber: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <FormLabel>Images</FormLabel>
              <Input
                type="file"
                accept="image/png,image/jpeg,image/webp,application/pdf"
                multiple
                onChange={(e) =>
                  setFiles(e.target.files ? Array.from(e.target.files) : [])
                }
              />
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Vehicle
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
