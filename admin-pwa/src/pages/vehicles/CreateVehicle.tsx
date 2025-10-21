import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { vehicleTypes } from "@/lib/constants";
import { createVehicle } from "@/services/vehicleService";

interface DriverData {
  name: string;
  mobile?: string;
  experience?: number;
  licenseNumber?: string;
  description?: string;
}

interface VehicleFormData {
  make: string;
  model: string;
  year: number;
  type: string;
  seatingCapacity: number | string;
  features: string[];
  description: string;
  images: string[];
  basePricePerDay: number;
  driver: DriverData;
}

const initialFormData: VehicleFormData = {
  make: "",
  model: "",
  year: new Date().getFullYear(),
  type: "",
  seatingCapacity: 4,
  features: [],
  description: "",
  images: [],
  basePricePerDay: 0,
  driver: {
    name: "",
    mobile: "",
    experience: 0,
    licenseNumber: "",
    description: "",
  },
};

export default function CreateVehicle() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<VehicleFormData>(initialFormData);
  const [newFeature, setNewFeature] = useState("");
  const [newImage, setNewImage] = useState("");
  const [errors, setErrors] = useState<Partial<VehicleFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<VehicleFormData> = {};

    if (!formData.make.trim()) newErrors.make = "Make is required";
    if (!formData.model.trim()) newErrors.model = "Model is required";
    if (!formData.type) newErrors.type = "Vehicle type is required";
    if (formData.seatingCapacity < "1")
      newErrors.seatingCapacity = "Seating capacity must be at least 1";
    if (formData.basePricePerDay < 0)
      newErrors.basePricePerDay = "Price cannot be negative";

    // Validate driver fields
    if (!formData.driver.name.trim()) {
      newErrors.driver = {
        ...newErrors.driver,
        name: "Driver name is required",
      };
    }
    if (!formData.driver.mobile.trim()) {
      newErrors.driver = {
        ...newErrors.driver,
        mobile: "Mobile number is required",
      };
    } else if (!/^\d{10}$/.test(formData.driver.mobile)) {
      newErrors.driver = {
        ...newErrors.driver,
        mobile: "Please enter a valid 10-digit mobile number",
      };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("driver.")) {
      const driverField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        driver: {
          ...prev.driver,
          [driverField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "seatingCapacity" ||
          name === "year" ||
          name === "basePricePerDay" ||
          name === "experience"
            ? Number(value)
            : value,
      }));
    }
  };

  const addFeature = () => {
    if (
      newFeature.trim() &&
      !formData.features.includes(newFeature.trim()) &&
      formData.features.length < 20
    ) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== featureToRemove),
    }));
  };

  const addImage = () => {
    const trimmedImage = newImage.trim();
    if (!trimmedImage) return;

    // Basic URL validation
    try {
      new URL(trimmedImage); // Will throw if not a valid URL

      if (formData.images.includes(trimmedImage)) {
        toast.warning("This image URL is already added");
        return;
      }

      if (formData.images.length >= 10) {
        toast.error("Maximum 10 images allowed");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, trimmedImage],
      }));
      setNewImage("");
    } catch (error) {
      toast.error("Please enter a valid image URL");
    }
  };

  const removeImage = (imageToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== imageToRemove),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setLoading(true);

    try {
      await createVehicle(formData);
      toast.success("Vehicle created successfully!");
      navigate("/vehicles");
    } catch (error: any) {
      console.error("Error creating vehicle:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create vehicle";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Vehicle</CardTitle>
          <CardDescription>
            Fill in the details below to add a new vehicle to the fleet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="make">Make *</Label>
                <Input
                  id="make"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  placeholder="e.g., Toyota"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g., Innova Crysta"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Input
                  type="number"
                  id="year"
                  name="year"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Vehicle Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seatingCapacity">Seating Capacity *</Label>
                <Input
                  type="number"
                  id="seatingCapacity"
                  name="seatingCapacity"
                  min="1"
                  value={formData.seatingCapacity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="basePricePerDay">
                  Base Price Per Day (₹) *
                </Label>
                <Input
                  type="number"
                  id="basePricePerDay"
                  name="basePricePerDay"
                  min="0"
                  step="0.01"
                  value={formData.basePricePerDay}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Features</Label>
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature (e.g., AC, GPS)"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addFeature}
                  disabled={
                    !newFeature.trim() || formData.features.length >= 20
                  }
                >
                  Add
                </Button>
              </div>
              {formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-sm"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500">
                {formData.features.length}/20 features added
              </p>
            </div>

            <div className="space-y-2">
              <Label>Image URLs</Label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="Add image URL"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addImage}
                  disabled={!newImage.trim() || formData.images.length >= 10}
                >
                  Add
                </Button>
              </div>
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Vehicle ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/300x200?text=Image+Not+Found";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500">
                {formData.images.length}/10 images added
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Enter vehicle description..."
                required
              />
            </div>

            <div className="border-t pt-6 space-y-6">
              <h3 className="text-lg font-medium">Driver Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="driver.name">Driver Name *</Label>
                  <Input
                    id="driver.name"
                    name="driver.name"
                    value={formData.driver.name}
                    onChange={handleChange}
                    placeholder="Driver's full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driver.mobile">Mobile Number *</Label>
                  <Input
                    id="driver.mobile"
                    name="driver.mobile"
                    value={formData.driver.mobile}
                    onChange={handleChange}
                    placeholder="Driver's mobile number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driver.experience">
                    Experience (years) *
                  </Label>
                  <Input
                    type="number"
                    id="driver.experience"
                    name="driver.experience"
                    min="0"
                    value={formData.driver.experience}
                    onChange={handleChange}
                    placeholder="Years of driving experience"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driver.licenseNumber">License Number *</Label>
                  <Input
                    id="driver.licenseNumber"
                    name="driver.licenseNumber"
                    value={formData.driver.licenseNumber}
                    onChange={handleChange}
                    placeholder="Driver's license number"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="driver.description">Driver Bio</Label>
                  <Textarea
                    id="driver.description"
                    name="driver.description"
                    value={formData.driver.description || ""}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Tell us about the driver..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/vehicles")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Vehicle"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
