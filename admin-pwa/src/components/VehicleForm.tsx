// admin-pwa/src/components/vehicles/VehicleForm.tsx
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { vehicleApi, IVehicle } from "../services/vehicleApi";
import { toast } from "react-toastify";

const vehicleTypes = ["sedan", "suv", "van", "luxury", "bus"];

const schema: yup.ObjectSchema<
  Omit<IVehicle, "_id" | "createdAt" | "updatedAt">
> = yup.object().shape({
  make: yup.string().required("Make is required"),
  model: yup.string().required("Model is required"),
  year: yup
    .number()
    .required("Year is required")
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  type: yup.string().required("Type is required").oneOf(vehicleTypes),
  seatingCapacity: yup
    .number()
    .required("Seating capacity is required")
    .min(1, "Must have at least 1 seat")
    .max(50, "Maximum 50 seats allowed"),
  basePricePerDay: yup
    .number()
    .required("Price per day is required")
    .min(0, "Price cannot be negative"),
  features: yup.array().of(yup.string().required()).default([]),
  description: yup.string().max(1000, "Description is too long").default(""),
  images: yup.array().of(yup.string().required()).default([]),
  isAvailable: yup.boolean().default(true),
  driver: yup
    .object()
    .shape({
      name: yup.string().required("Driver name is required"),
      mobile: yup
        .string()
        .required("Mobile number is required")
        .matches(/^[0-9]{10}$/, "Must be a valid 10-digit number"),
      experience: yup
        .number()
        .required("Experience is required")
        .min(0, "Experience cannot be negative"),
      licenseNumber: yup.string().required("License number is required"),
      description: yup.string().default(""),
      image: yup.string().default(""),
    })
    .default(() => ({
      name: "",
      mobile: "",
      experience: 0,
      licenseNumber: "",
      description: "",
      image: "",
    })),
});

interface VehicleFormProps {
  vehicle?: IVehicle | null;
  onSubmit: (data: Omit<IVehicle, "_id" | "createdAt" | "updatedAt">) => void;
  isLoading?: boolean;
  isEditMode: boolean;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
  vehicle,
  onSubmit,
  isLoading = false,
  isEditMode,
}) => {
  // isEditMode prop is used to determine if we're in edit mode
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [featureInput, setFeatureInput] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<Omit<IVehicle, "_id" | "createdAt" | "updatedAt">>({
    resolver: yupResolver(schema),
    defaultValues: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      type: "sedan",
      seatingCapacity: 4,
      basePricePerDay: 0,
      features: [],
      description: "",
      images: [],
      isAvailable: true,
      driver: {
        name: "",
        mobile: "",
        experience: 0,
        licenseNumber: "",
        description: "",
      },
    },
  });

  const features = watch("features") || [];
  const images = watch("images") || [];

  // Set initial values when component mounts or vehicle changes
  useEffect(() => {
    if (vehicle) {
      const { _id, createdAt, updatedAt, ...vehicleData } = vehicle;
      reset(vehicleData);
    }
  }, [vehicle, reset]);

  // Load vehicle data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const loadVehicle = async () => {
        try {
          const vehicle = await vehicleApi.getVehicle(id);
          reset(vehicle);
        } catch (error) {
          console.error("Error loading vehicle:", error);
          toast.error("Failed to load vehicle data");
          navigate("/vehicles");
        }
      };

      loadVehicle();
    }
  }, [isEditMode, id, reset, navigate]);

  const handleAddFeature = () => {
    if (featureInput.trim() && !features.includes(featureInput)) {
      setValue("features", [...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (featureToRemove: string) => {
    setValue(
      "features",
      features.filter((f: string) => f !== featureToRemove)
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await vehicleApi.uploadImage(file);
        setValue("images", [...images, imageUrl]);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image");
      }
    }
  };

  const handleRemoveImage = (imageToRemove: string) => {
    setValue(
      "images",
      images.filter((img: string) => img !== imageToRemove)
    );
  };

  const handleFormSubmit = async (
    data: Omit<IVehicle, "_id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error(`Failed to ${isEditMode ? "update" : "create"} vehicle`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditMode ? "Edit Vehicle" : "Add New Vehicle"}
      </h1>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Make <span className="text-red-500">*</span>
              </label>
              <Controller
                name="make"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.make ? "border-red-500" : ""
                    }`}
                  />
                )}
              />
              {errors.make && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.make.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model <span className="text-red-500">*</span>
              </label>
              <Controller
                name="model"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.model ? "border-red-500" : ""
                    }`}
                  />
                )}
              />
              {errors.model && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.model.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year <span className="text-red-500">*</span>
              </label>
              <Controller
                name="year"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.year ? "border-red-500" : ""
                    }`}
                  />
                )}
              />
              {errors.year && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.year.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.type ? "border-red-500" : ""
                    }`}
                  >
                    {vehicleTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.type.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seating Capacity <span className="text-red-500">*</span>
              </label>
              <Controller
                name="seatingCapacity"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min="1"
                    max="50"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.seatingCapacity ? "border-red-500" : ""
                    }`}
                  />
                )}
              />
              {errors.seatingCapacity && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.seatingCapacity.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Price per Day (₹) <span className="text-red-500">*</span>
              </label>
              <Controller
                name="basePricePerDay"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min="0"
                    step="0.01"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.basePricePerDay ? "border-red-500" : ""
                    }`}
                  />
                )}
              />
              {errors.basePricePerDay && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.basePricePerDay.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={3}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors.description ? "border-red-500" : ""
                  }`}
                />
              )}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Features</h2>

          <div className="flex">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              placeholder="Add a feature (e.g., GPS, AC)"
              className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddFeature())
              }
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>

          {features.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {features.map((feature: string) => (
                <span
                  key={feature}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(feature)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Images */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Images</h2>

          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload images</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleImageUpload}
                    accept="image/*"
                    disabled={isLoading}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>

          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image: string, index: number) => (
                <div key={index} className="relative group">
                  <img
                    src={image.startsWith("http") ? image : `/uploads/${image}`}
                    alt={`Vehicle ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(image)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove image"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Driver Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Driver Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Driver Name <span className="text-red-500">*</span>
              </label>
              <Controller
                name="driver.name"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.driver?.name ? "border-red-500" : ""
                    }`}
                  />
                )}
              />
              {errors.driver?.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.driver.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <Controller
                name="driver.mobile"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="tel"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.driver?.mobile ? "border-red-500" : ""
                    }`}
                    placeholder="10-digit number"
                  />
                )}
              />
              {errors.driver?.mobile && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.driver.mobile.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Years of Experience <span className="text-red-500">*</span>
              </label>
              <Controller
                name="driver.experience"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min="0"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.driver?.experience ? "border-red-500" : ""
                    }`}
                  />
                )}
              />
              {errors.driver?.experience && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.driver.experience.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Number <span className="text-red-500">*</span>
              </label>
              <Controller
                name="driver.licenseNumber"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.driver?.licenseNumber ? "border-red-500" : ""
                    }`}
                    placeholder="e.g., DL12345678901234"
                  />
                )}
              />
              {errors.driver?.licenseNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.driver.licenseNumber.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Driver Description
              </label>
              <Controller
                name="driver.description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={2}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.driver?.description ? "border-red-500" : ""
                    }`}
                    placeholder="Any additional information about the driver"
                  />
                )}
              />
              {errors.driver?.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.driver.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Driver Photo
              </label>
              <div className="mt-1 flex items-center">
                <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                  {watch("driver.image") ? (
                    <img
                      src={watch("driver.image")}
                      alt="Driver"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <svg
                      className="h-full w-full text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </span>
                <button
                  type="button"
                  className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <Controller
              name="isAvailable"
              control={control}
              render={({ field }) => (
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    name={field.name}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              )}
            />
            <label className="ml-2 block text-sm text-gray-900">
              This vehicle is currently available for booking
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/vehicles")}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Save Vehicle"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleForm;
