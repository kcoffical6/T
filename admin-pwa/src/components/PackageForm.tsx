import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { packagesApi } from "../services/api";
import { FiX, FiPlus, FiTrash2 } from "react-icons/fi";

type PackageFormData = {
  title: string;
  slug: string;
  shortDesc: string;
  longDesc: string;
  itinerary: Array<{
    day: number;
    activities: string[];
    accommodation: string;
    meals: string[];
    notes: string;
  }>;
  minPax: number;
  maxPax: number;
  basePricePerPax: number;
  region: string;
  tags: string[];
  featured: boolean;
  inclusions: string[];
  exclusions: string[];
  isActive: boolean;
};

export const PackageForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PackageFormData>({
    defaultValues: {
      title: "",
      slug: "",
      shortDesc: "",
      longDesc: "",
      itinerary: [
        { day: 1, activities: [], accommodation: "", meals: [], notes: "" },
      ],
      minPax: 2,
      maxPax: 10,
      basePricePerPax: 0,
      region: "",
      tags: [],
      featured: false,
      inclusions: [],
      exclusions: [],
      isActive: true,
    },
  });

  // Load package data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const loadPackage = async () => {
        try {
          const pkg = await packagesApi.getPackage(id);
          reset(pkg);
          setPreviewImages(pkg.images || []);
        } catch (error) {
          console.error("Error loading package:", error);
        }
      };
      loadPackage();
    }
  }, [id, isEditMode, reset]);

  // Generate slug from title
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title" && value.title && !isEditMode) {
        const slug = value.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/--+/g, "-");
        setValue("slug", slug);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, isEditMode]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const tags = watch("tags");
      if (!tags.includes(tagInput.trim())) {
        setValue("tags", [...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      "tags",
      watch("tags").filter((tag) => tag !== tagToRemove)
    );
  };

  const handleAddItineraryDay = () => {
    const itinerary = watch("itinerary");
    setValue("itinerary", [
      ...itinerary,
      {
        day: itinerary.length + 1,
        activities: [],
        accommodation: "",
        meals: [],
        notes: "",
      },
    ]);
  };

  const handleRemoveItineraryDay = (index: number) => {
    const itinerary = [...watch("itinerary")];
    itinerary.splice(index, 1);
    // Update day numbers
    const updatedItinerary = itinerary.map((day, idx) => ({
      ...day,
      day: idx + 1,
    }));
    setValue("itinerary", updatedItinerary);
  };

  const handleAddActivity = (dayIndex: number) => {
    const activity = prompt("Enter activity:");
    if (activity) {
      const itinerary = [...watch("itinerary")];
      itinerary[dayIndex].activities.push(activity);
      setValue("itinerary", itinerary);
    }
  };

  const handleRemoveActivity = (dayIndex: number, activityIndex: number) => {
    const itinerary = [...watch("itinerary")];
    itinerary[dayIndex].activities.splice(activityIndex, 1);
    setValue("itinerary", itinerary);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles([...imageFiles, ...files]);

    // Create preview URLs
    const fileUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...fileUrls]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...previewImages];
    newImages.splice(index, 1);
    setPreviewImages(newImages);

    // If it's a new file, remove from files array
    if (index >= previewImages.length - imageFiles.length) {
      const fileIndex = index - (previewImages.length - imageFiles.length);
      const newFiles = [...imageFiles];
      newFiles.splice(fileIndex, 1);
      setImageFiles(newFiles);
    }
  };

  const onSubmit = async (data: PackageFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      // Append all form fields except files
      Object.entries(data).forEach(([key, value]) => {
        if (key === "itinerary" || Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      // Append image files
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      if (isEditMode && id) {
        await packagesApi.updatePackage(id, formData);
      } else {
        await packagesApi.createPackage(formData);
      }

      navigate("/packages");
    } catch (error) {
      console.error("Error saving package:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">
        {isEditMode ? "Edit Package" : "Add New Package"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <Controller
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Package title"
                  />
                )}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <Controller
                name="slug"
                control={control}
                rules={{ required: "Slug is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="package-slug"
                  />
                )}
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.slug.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Description *
            </label>
            <Controller
              name="shortDesc"
              control={control}
              rules={{ required: "Short description is required" }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="Brief description (max 160 characters)"
                  maxLength={160}
                />
              )}
            />
            {errors.shortDesc && (
              <p className="mt-1 text-sm text-red-600">
                {errors.shortDesc.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Long Description *
            </label>
            <Controller
              name="longDesc"
              control={control}
              rules={{ required: "Long description is required" }}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={4}
                  className="w-full p-2 border rounded-md"
                  placeholder="Detailed description of the package"
                />
              )}
            />
            {errors.longDesc && (
              <p className="mt-1 text-sm text-red-600">
                {errors.longDesc.message}
              </p>
            )}
          </div>
        </div>

        {/* Pricing & Capacity */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Pricing & Capacity</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Price (per person) *
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <Controller
                  name="basePricePerPax"
                  control={control}
                  rules={{
                    required: "Price is required",
                    min: { value: 0, message: "Price must be positive" },
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      min="0"
                      step="0.01"
                      className="pl-7 w-full p-2 border rounded-md"
                      placeholder="0.00"
                    />
                  )}
                />
              </div>
              {errors.basePricePerPax && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.basePricePerPax.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Pax *
              </label>
              <Controller
                name="minPax"
                control={control}
                rules={{
                  required: "Minimum pax is required",
                  min: { value: 1, message: "Minimum 1 person" },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min="1"
                    className="w-full p-2 border rounded-md"
                  />
                )}
              />
              {errors.minPax && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.minPax.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Pax *
              </label>
              <Controller
                name="maxPax"
                control={control}
                rules={{
                  required: "Maximum pax is required",
                  validate: (value) =>
                    value >= watch("minPax") ||
                    "Must be greater than or equal to minimum pax",
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min={watch("minPax") || 1}
                    className="w-full p-2 border rounded-md"
                  />
                )}
              />
              {errors.maxPax && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.maxPax.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Itinerary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Itinerary</h3>
            <button
              type="button"
              onClick={handleAddItineraryDay}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Day
            </button>
          </div>

          {watch("itinerary").map((day, dayIndex) => (
            <div key={dayIndex} className="mb-6 border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Day {day.day}</h4>
                {watch("itinerary").length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItineraryDay(dayIndex)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove Day
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Activities
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {day.activities.map((activity, activityIndex) => (
                      <span
                        key={activityIndex}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {activity}
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveActivity(dayIndex, activityIndex)
                          }
                          className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-blue-500 hover:text-blue-700"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddActivity(dayIndex)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Activity
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Accommodation
                  </label>
                  <Controller
                    name={`itinerary.${dayIndex}.accommodation`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="Hotel name or type of accommodation"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meals Included
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Breakfast", "Lunch", "Dinner"].map((meal) => (
                      <label key={meal} className="inline-flex items-center">
                        <Controller
                          name={`itinerary.${dayIndex}.meals`}
                          control={control}
                          render={({ field }) => (
                            <input
                              type="checkbox"
                              checked={field.value.includes(meal)}
                              onChange={(e) => {
                                const newMeals = e.target.checked
                                  ? [...field.value, meal]
                                  : field.value.filter((m) => m !== meal);
                                field.onChange(newMeals);
                              }}
                              className="h-4 w-4 text-blue-600 rounded"
                            />
                          )}
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {meal}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <Controller
                    name={`itinerary.${dayIndex}.notes`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="Additional notes for this day"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Images */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Images</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {previewImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={
                    image.startsWith("data:") || image.startsWith("http")
                      ? image
                      : `/uploads/${image}`
                  }
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <label className="inline-block px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
            Upload Images
            <input
              type="file"
              className="sr-only"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
          <p className="mt-1 text-xs text-gray-500">
            Upload high-quality images of the destination (max 10 images, 5MB
            each)
          </p>
        </div>

        {/* Tags & Metadata */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Tags & Metadata</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {watch("tags").map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full p-2 border rounded-md"
              placeholder="Type and press Enter to add tags"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Region *
              </label>
              <Controller
                name="region"
                control={control}
                rules={{ required: "Region is required" }}
                render={({ field }) => (
                  <select {...field} className="w-full p-2 border rounded-md">
                    <option value="">Select a region</option>
                    <option value="north">North India</option>
                    <option value="south">South India</option>
                    <option value="east">East India</option>
                    <option value="west">West India</option>
                    <option value="northeast">Northeast India</option>
                    <option value="international">International</option>
                  </select>
                )}
              />
              {errors.region && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.region.message}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <Controller
                name="featured"
                control={control}
                render={({ field }) => (
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Featured Package
                    </span>
                  </label>
                )}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Inclusions
            </label>
            <Controller
              name="inclusions"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  {field.value.map((inclusion, index) => (
                    <div key={index} className="flex">
                      <input
                        type="text"
                        value={inclusion}
                        onChange={(e) => {
                          const newInclusions = [...field.value];
                          newInclusions[index] = e.target.value;
                          field.onChange(newInclusions);
                        }}
                        className="flex-1 p-2 border rounded-l-md"
                        placeholder="Included item"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newInclusions = field.value.filter(
                            (_, i) => i !== index
                          );
                          field.onChange(newInclusions);
                        }}
                        className="px-3 border-t border-r border-b border-red-300 bg-red-50 text-red-600 rounded-r-md hover:bg-red-100"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => field.onChange([...field.value, ""])}
                    className="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <FiPlus className="mr-1" /> Add Inclusion
                  </button>
                </div>
              )}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exclusions
            </label>
            <Controller
              name="exclusions"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  {field.value.map((exclusion, index) => (
                    <div key={index} className="flex">
                      <input
                        type="text"
                        value={exclusion}
                        onChange={(e) => {
                          const newExclusions = [...field.value];
                          newExclusions[index] = e.target.value;
                          field.onChange(newExclusions);
                        }}
                        className="flex-1 p-2 border rounded-l-md"
                        placeholder="Excluded item"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newExclusions = field.value.filter(
                            (_, i) => i !== index
                          );
                          field.onChange(newExclusions);
                        }}
                        className="px-3 border-t border-r border-b border-red-300 bg-red-50 text-red-600 rounded-r-md hover:bg-red-100"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => field.onChange([...field.value, ""])}
                    className="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <FiPlus className="mr-1" /> Add Exclusion
                  </button>
                </div>
              )}
            />
          </div>
        </div>

        {/* Status */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <label className="inline-flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    {field.value ? "Active" : "Inactive"}
                  </span>
                </label>
              )}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/packages")}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading
              ? "Saving..."
              : isEditMode
                ? "Update Package"
                : "Create Package"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PackageForm;
