"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/store/store";
import { packagesService } from "@/features/packages/packagesService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Pencil, Trash } from "lucide-react";
import { deletePackage } from "@/features/packages/packagesSlice";
import { toast } from "@/components/ui/use-toast";
import { Package } from "@/types/package";

export default function PackageViewPage() {
    const params = useParams<{ id: string }>();
    const id = params.id;
    const [data, setData] = useState<Package | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        async function loadPackage() {
            try {
                setIsLoading(true);
                setIsError(false);
                // Try to get by ID first, then by slug if that fails
                let packageData: Package;
                try {
                    packageData = await packagesService.getByIdAdmin(id);
                } catch {
                    // If getByIdAdmin fails, try getBySlug
                    packageData = await packagesService.getBySlug(id);
                }
                setData(packageData);
            } catch (error) {
                console.error("Failed to load package:", error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        }

        if (id) {
            loadPackage();
        }
    }, [id]);

    async function onDelete() {
        if (!data?._id) return;
        try {
            const res = await dispatch(deletePackage(data._id));
            if (deletePackage.fulfilled.match(res)) {
                toast({ title: "Deleted", description: "Package deleted" });
                router.push("/packages");
            } else {
                throw new Error((res.payload as string) || "Failed to delete");
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
                    <p className="text-muted-foreground">
                        {data.slug ? `Slug: ${data.slug}` : `ID: ${data._id}`}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => router.push(`/packages/${data._id || data.slug}/edit`)}>
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
