"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/store";
import { updatePackage } from "@/features/packages/packagesSlice";
import { packagesService } from "@/features/packages/packagesService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormLabel } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { Package } from "@/types/package";

export default function EditPackagePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [form, setForm] = useState<Partial<Package>>({
    title: "",
    shortDesc: "",
    region: "",
    basePricePerPax: 0,
    minPax: 1,
    maxPax: 10,
    isActive: true,
    images: [],
  });

  // 🔹 Fetch package details
  const load = async () => {
    try {
      setLoading(true);
      let pkg: Package | null = null;

      try {
        pkg = await packagesService.getByIdAdmin(id);
      } catch {
        // fallback: if id is actually a slug
        pkg = await packagesService.getBySlug(id);
      }

      if (!pkg) throw new Error("Package not found");

      setPackageData(pkg);
      setForm({
        title: pkg.title || "",
        shortDesc: pkg.shortDesc || "",
        region: pkg.region || "",
        basePricePerPax: pkg.basePricePerPax || 0,
        minPax: pkg.minPax || 1,
        maxPax: pkg.maxPax || 10,
        isActive: pkg.isActive ?? true,
        images: pkg.images || [],
      });
    } catch (error) {
      console.error("Error loading package:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) load();
  }, [id]);

  // 🔹 Handle form submit
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageData?._id) return;

    try {
      setSubmitting(true);

      let images = [...(form.images || [])];

      if (files.length > 0) {
        const uploaded = await packagesService.upload(files);
        images = [...images, ...uploaded];
      }

      const payload: Partial<Package> & { images: string[] } = {
        title: form.title?.trim() || "",
        shortDesc: form.shortDesc?.trim() || "",
        region: form.region?.trim() || "",
        basePricePerPax: Number(form.basePricePerPax) || 0,
        minPax: Number(form.minPax) || 1,
        maxPax: Number(form.maxPax) || 10,
        isActive: Boolean(form.isActive),
        images,
      };

      const result = await dispatch(
        updatePackage({ id: packageData._id, payload })
      );

      if (result?.type?.endsWith("/fulfilled")) {
        router.push("/packages");
      } else {
        throw new Error(result?.payload as string || "Failed to update package");
      }
    } catch (err) {
      console.error("Error updating package:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-muted-foreground flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading package...
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="p-6 text-red-500">Package not found or failed to load.</div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Edit Package</h2>
        <p className="text-muted-foreground">
          Update package details and images
        </p>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Title", name: "title" },
                { label: "Short Description", name: "shortDesc" },
                { label: "Region", name: "region" },
              ].map(({ label, name }) => (
                <div key={name}>
                  <FormLabel>{label}</FormLabel>
                  <Input
                    value={form[name as keyof Package] as string}
                    onChange={(e) =>
                      setForm({ ...form, [name]: e.target.value })
                    }
                  />
                </div>
              ))}

              {[
                { label: "Base Price Per Pax", name: "basePricePerPax" },
                { label: "Min Pax", name: "minPax" },
                { label: "Max Pax", name: "maxPax" },
              ].map(({ label, name }) => (
                <div key={name}>
                  <FormLabel>{label}</FormLabel>
                  <Input
                    type="number"
                    value={form[name as keyof Package] as number}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [name]: Number(e.target.value),
                      })
                    }
                  />
                </div>
              ))}
            </div>

            {/* Existing Images */}
            <div className="space-y-2">
              <FormLabel>Existing Images</FormLabel>
              <div className="flex flex-wrap gap-2">
                {(form.images || []).map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`image-${idx}`}
                    className="h-16 w-16 object-cover rounded border"
                  />
                ))}
              </div>
            </div>

            {/* Upload new images */}
            <div className="space-y-2">
              <FormLabel>Add Images</FormLabel>
              <Input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                onChange={(e) =>
                  setFiles(e.target.files ? Array.from(e.target.files) : [])
                }
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/packages")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
