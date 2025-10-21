"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetPackageBySlugQuery } from "@/features/packages/packagesApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Pencil, Trash } from "lucide-react";
import { useAppDispatch } from "@/lib/store/store";
import { deletePackage } from "@/features/packages/packagesSlice";
import { toast } from "@/components/ui/use-toast";

export default function PackageViewPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { data, isLoading, isError } = useGetPackageBySlugQuery(slug);
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function onDelete() {
    if (!data?._id) return;
    try {
      const res = await dispatch(deletePackage(data._id) as any);
      if (deletePackage.fulfilled.match(res)) {
        toast({ title: "Deleted", description: "Package deleted" });
        router.push("/packages");
      } else {
        throw new Error((res.payload as any) || "Failed to delete");
      }
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to delete",
        variant: "destructive",
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading package...
      </div>
    );
  }

  if (isError || !data) {
    return <div className="text-sm text-destructive">Failed to load package.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{data.title}</h2>
          <p className="text-muted-foreground">Slug: {data.slug}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push(`/packages/${data.slug}/edit`)}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div><span className="font-medium">Region:</span> {data.region}</div>
          <div><span className="font-medium">Active:</span> {data.isActive ? "Yes" : "No"}</div>
          <div><span className="font-medium">Base Price:</span> {data.basePricePerPax}</div>
          <div><span className="font-medium">Min/Max Pax:</span> {data.minPax} / {data.maxPax}</div>
          <div><span className="font-medium">Short Desc:</span> {data.shortDesc}</div>
        </CardContent>
      </Card>
    </div>
  );
}
