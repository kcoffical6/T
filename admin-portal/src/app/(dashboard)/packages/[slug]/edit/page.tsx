"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetPackageBySlugQuery } from "@/features/packages/packagesApi";
import { useAppDispatch } from "@/lib/store/store";
import { updatePackage } from "@/features/packages/packagesSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const schema = z.object({
  title: z.string().min(2, "Title is required"),
  shortDesc: z.string().min(5, "Short description is required"),
  region: z.string().min(2, "Region is required"),
  basePricePerPax: z.coerce.number().min(0, "Invalid price"),
  minPax: z.coerce.number().min(1, "Min pax >= 1"),
  maxPax: z.coerce.number().min(1, "Max pax >= 1"),
});

export default function EditPackagePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { data, isLoading, isError } = useGetPackageBySlugQuery(slug);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      shortDesc: "",
      region: "",
      basePricePerPax: 0,
      minPax: 1,
      maxPax: 10,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        title: data.title,
        shortDesc: data.shortDesc,
        region: data.region,
        basePricePerPax: data.basePricePerPax,
        minPax: data.minPax,
        maxPax: data.maxPax,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  async function onSubmit(values: z.infer<typeof schema>) {
    if (!data?._id) return;
    try {
      const res = await dispatch(updatePackage({ id: data._id, payload: values }) as any);
      if (updatePackage.fulfilled.match(res)) {
        toast({ title: "Updated", description: "Package updated successfully" });
        router.push(`/packages/${slug}`);
      } else {
        throw new Error((res.payload as any) || "Failed to update package");
      }
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to update package",
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
      <div>
        <h2 className="text-2xl font-bold">Edit Package</h2>
        <p className="text-muted-foreground">Update package details</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Package title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shortDesc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Short description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. karnataka" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="basePricePerPax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Price per Pax</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minPax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Pax</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxPax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Pax</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
