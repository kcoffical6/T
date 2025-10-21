"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/store";
import { createPackage } from "@/features/packages/packagesSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { log } from "console";

const schema = z.object({
  title: z.string().min(2, "Title is required"),
  shortDesc: z.string().min(5, "Short description is required"),
  region: z.string().min(2, "Region is required"),
  basePricePerPax: z.coerce.number().min(0, "Invalid price"),
  minPax: z.coerce.number().min(1, "Min pax >= 1"),
  maxPax: z.coerce.number().min(1, "Max pax >= 1"),
  isActive: z.coerce.boolean().default(true),
});

export default function NewPackagePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const form = useForm<z.input<typeof schema>, any, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      shortDesc: "",
      region: "",
      basePricePerPax: 0,
      minPax: 1,
      maxPax: 10,
      isActive: true,
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      console.log("values", values);
      const result = await dispatch(createPackage(values) as any);
      if (createPackage.fulfilled.match(result)) {
        toast({
          title: "Created",
          description: "Package created successfully",
        });
        router.push("/packages");
      } else {
        throw new Error((result.payload as any) || "Failed to create package");
      }
    } catch (e) {
      toast({
        title: "Error",
        description:
          e instanceof Error ? e.message : "Failed to create package",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Create Package</h2>
        <p className="text-muted-foreground">Add a new tour package</p>
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
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          value={
                            (field.value as number | string | undefined) ?? ""
                          }
                          onChange={(e) => field.onChange(e.target.value)}
                        />
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
                        <Input
                          type="number"
                          {...field}
                          value={
                            (field.value as number | string | undefined) ?? ""
                          }
                          onChange={(e) => field.onChange(e.target.value)}
                        />
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
                        <Input
                          type="number"
                          {...field}
                          value={
                            (field.value as number | string | undefined) ?? ""
                          }
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Package
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
