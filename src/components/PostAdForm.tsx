import { useState, useRef, useEffect } from "react";
import DropdownPopup from "./DropDownPopup";
import uploadImg from "../assets/upload.png";
import sample from "/sample.png";
import { ghanaRegionsAndPlaces } from "../data/regions";
import { categoryOptions } from "../data/categories";
import LocationSelector from "./LocationSelector";
import { mockPostAd } from "../api/mock";
import { postAd } from "../api/postAd";

// mock || realApi toggle, currently using mock
const useMock = true;
const api = useMock ? mockPostAd : postAd;

const placeholderImages = [sample, sample, sample, sample, sample, sample];

interface UploadedImage {
  id: number;
  url: string;
  file?: File;
}

export default function PostAdForm() {
  const [category, setCategory] = useState("Select product Category");
  const [title, setTitle] = useState("");
  const [purpose, setPurpose] = useState<"Sale" | "Pay Later" | "Rent">("Sale");

  const [dailyValue, setDailyValue] = useState<number | "">("");
  const [dailyDuration, setDailyDuration] = useState("Duration");
  const [weeklyValue, setWeeklyValue] = useState<number | "">("");
  const [weeklyDuration, setWeeklyDuration] = useState("Duration");
  const [monthlyValue, setMonthlyValue] = useState<number | "">("");
  const [monthlyDuration, setMonthlyDuration] = useState("Duration");

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(
    placeholderImages.map((url, i) => ({ id: i + 1, url })),
  );
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const [regionLocation, setRegionLocation] = useState<string | null>(null);
  const [mapSelection, setMapSelection] = useState<{
    coords: { lat: number; lng: number };
    placeName: string;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (gridRef.current && !gridRef.current.contains(e.target as Node)) {
        setSelectedImage(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).map((file, i) => ({
      id: uploadedImages.length + i + 1,
      url: URL.createObjectURL(file),
      file,
    }));

    setUploadedImages((prev) => [...prev, ...newImages]);
  }

  function handleDeleteImage(id: number) {
    const img = uploadedImages.find((x) => x.id === id);
    if (img && img.url && img.file) {
      try {
        URL.revokeObjectURL(img.url);
      } catch {
        console.log("could not 'URL.revokeObjectURL(img.url);', delete image, i think")
      }
    }
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
    setSelectedImage(null);
  }

  function handleRegionSelect(opt: string) {
    setRegionLocation(opt);
    setMapSelection(null);
  }

  function handleMapConfirm(
    selection: {
      coords: { lat: number; lng: number };
      placeName: string;
    } | null,
  ) {
    setMapSelection(selection);
    if (selection) {
      setRegionLocation(null);
    }
  }

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const errors: string[] = [];
    if (!title.trim()) errors.push("Title is required.");
    if (!category || category === "Select product Category")
      errors.push("Category is required.");
    if (!mapSelection && !regionLocation)
      errors.push("Please choose a location (map or region).");

    if (errors.length > 0) {
      console.warn("Validation errors:", errors);
      alert("Please fix: " + errors.join(" "));
      setIsSubmitting(false);
      return;
    }


    const metadata = {
      title: title.trim(),
      category,
      purpose,
      pricing: {
        daily: { value: dailyValue || null, duration: dailyDuration },
        weekly: { value: weeklyValue || null, duration: weeklyDuration },
        monthly: { value: monthlyValue || null, duration: monthlyDuration },
      },
      location: mapSelection
        ? {
            type: "map",
            placeName: mapSelection.placeName,
            coords: mapSelection.coords,
          }
        : { type: "region", value: regionLocation },
      images: uploadedImages.map((img) => ({
        id: img.id,
        url: img.url,
        hasFile: !!img.file,
      })),
      createdAt: new Date().toISOString(),
    };

    console.log("Ad metadata (JSON):", metadata);

    try {
      const result = await api.uploadAd(metadata);

      console.log("Server response:", result);
      alert(result.message || "Ad saved successfully!");
    } catch (err: unknown) {
      console.error("Upload failed:", err);

      if (err instanceof Error) {
        alert(err.message || "An error occurred while saving. See console for details.");
      } else {
        alert("An unexpected error occurred. See console for details.");
      }
    } finally {
      setIsSubmitting(false);
    }

  }

  function handleSelect(trigger: string, value: string) {
    if (trigger === "daily") setDailyDuration(value);
    if (trigger === "weekly") setWeeklyDuration(value);
    if (trigger === "monthly") setMonthlyDuration(value);
  }

  return (
    <form className="h-full w-full" onSubmit={handleSave}>
      <div className="text-xs flex flex-col lg:flex-row w-full h-full overflow-y-autogap-6 lg:gap-2 py-3 pr-2">
        <div className="flex flex-col w-full lg:w-3/5 shadow-lg bg-white rounded-xl p-6 space-y-4 lg:overflow-y-scroll no-scrollbar">
          <div className="grid grid-cols-1 gap-2">
            <div>
              <label className="block mb-1">Product Category</label>
              <DropdownPopup
                triggerLabel={category}
                supportsSubmenu
                options={categoryOptions}
                onSelect={(opt) => {
                  setCategory(opt);
                  console.log("category chosen:", opt);
                }}
                title="Select Category"
              />
            </div>

            <div>
              <label className="block mb-1">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Add a title"
                className="w-full p-3 border rounded-xl border-[var(--div-border)]"
              />
            </div>
          </div>

          <div>
            <p className="mb-1">Declare ad purpose?</p>
            <div className="flex gap-3">
              {(["Sale", "Pay Later", "Rent"] as const).map((option) => (
                <label
                  key={option}
                  className="relative flex items-center gap-1 bg-[var(--div-active)] rounded-lg px-4 py-2 pt-3.5 pr-4 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="purpose"
                    checked={purpose === option}
                    onChange={() => setPurpose(option)}
                    className="absolute top-1 right-0.5 accent-[var(--dark-def)]"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {[
              {
                name: "Daily",
                trigger: "daily",
                value: dailyValue,
                setValue: setDailyValue,
                duration: dailyDuration,
              },
              {
                name: "Weekly",
                trigger: "weekly",
                value: weeklyValue,
                setValue: setWeeklyValue,
                duration: weeklyDuration,
              },
              {
                name: "Monthly",
                trigger: "monthly",
                value: monthlyValue,
                setValue: setMonthlyValue,
                duration: monthlyDuration,
              },
            ].map((label) => (
              <div key={label.trigger}>
                <p className="mb-1 font-medium">{label.name}</p>
                <div
                  className="relative grid gap-2"
                  style={{ gridTemplateColumns: "2fr 1fr" }}
                >
                  <input
                    value={label.value}
                    onChange={(e) =>
                      label.setValue(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    type="number"
                    placeholder="0"
                    className="w-full border rounded-xl border-[var(--div-border)] p-3 pl-7"
                  />
                  <p className="absolute inline top-3.25 left-3">₵</p>
                  <DropdownPopup
                    truncate
                    triggerLabel={label.duration}
                    options={
                      label.trigger === "daily"
                        ? [
                            "30 days - 1 month",
                            "60 days - 2 months",
                            "90 days - 3 months",
                          ]
                        : label.trigger === "weekly"
                          ? [
                              "8 weeks - 2 months",
                              "12 weeks - 3 months",
                              "16 weeks - 4 months",
                              "20 weeks - 5 months",
                            ]
                          : [
                              "4 months",
                              "5 months",
                              "6 months",
                              "7 months",
                              "8 months",
                              "9 months",
                              "10 months",
                              "12 months",
                            ]
                    }
                    onSelect={(opt) => handleSelect(label.trigger, opt)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <div>
              <DropdownPopup
                triggerLabel={regionLocation ?? "Ad Area Location"}
                options={ghanaRegionsAndPlaces}
                onSelect={(opt) => handleRegionSelect(opt)}
                supportsSubmenu
                title="Select Region / Place"
              />
            </div>

            <div className="flex flex-wrap gap-1 my-1 font-bold">
              {[
                "Home Spintex",
                "Shop Accra",
                "Shop East Legon",
                "Shop Kumasi",
              ].map((loc) => (
                <button
                  key={loc}
                  type="button"
                  className="p-1 bg-gray-100 rounded-xs text-[length:0.9vw] hover:bg-gray-200"
                  onClick={() => setRegionLocation(loc)}
                >
                  {loc}
                </button>
              ))}
            </div>

            <p className=" text-[length:0.9vw] text-[var(--bg-active)] mt-1 font-bold">
              <svg className="inline" width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_18425_111" maskUnits="userSpaceOnUse" x="0" y="0" width="12" height="12">
                  <path d="M12 0H0V12H12V0Z" fill="white"/>
                </mask>
                <g mask="url(#mask0_18425_111)">
                  <path d="M6 7.50123C5.8674 7.50123 5.74025 7.44621 5.64645 7.35621C5.5527 7.26121 5.5 7.13623 5.5 7.00123V3.00123C5.5 2.86623 5.5527 2.74125 5.64645 2.64625C5.74025 2.55625 5.8674 2.50123 6 2.50123C6.1326 2.50123 6.2598 2.55625 6.35355 2.64625C6.44735 2.74125 6.5 2.86623 6.5 3.00123V7.00123C6.5 7.13623 6.44735 7.26121 6.35355 7.35621C6.2598 7.44621 6.1326 7.50123 6 7.50123ZM6.3965 11.8812C7.4765 11.4462 11 9.74125 11 6.02125V3.43622C11.0006 2.91122 10.8353 2.4012 10.5277 1.9712C10.2201 1.5462 9.78595 1.23123 9.287 1.06623L6.1575 0.02625C6.05535 -0.00875 5.9447 -0.00875 5.8425 0.02625L2.713 1.06623C2.21405 1.23123 1.7799 1.5462 1.4723 1.9712C1.16475 2.4012 0.999451 2.91122 1 3.43622V6.02125C1 9.30625 4.5025 11.3112 5.5765 11.8462C5.71235 11.9112 5.8542 11.9662 6 12.0012C6.1356 11.9712 6.2683 11.9312 6.3965 11.8812ZM8.972 2.01124C9.2713 2.11124 9.53165 2.30122 9.7162 2.56122C9.90075 2.81622 10.0001 3.12122 10 3.43622V6.02125C10 9.11625 6.9565 10.5762 6.0235 10.9512C5.0795 10.4812 2 8.73125 2 6.02125V3.43622C1.99995 3.12122 2.09925 2.81622 2.2838 2.56122C2.46835 2.30122 2.72875 2.11124 3.028 2.01124L6 1.02625L8.972 2.01124ZM6 8.50123C5.9011 8.50123 5.80445 8.53125 5.72225 8.58625C5.64 8.64125 5.5759 8.71622 5.53805 8.81122C5.50025 8.90122 5.49035 9.0012 5.5096 9.1012C5.5289 9.1962 5.57655 9.28621 5.64645 9.35621C5.7164 9.42621 5.8055 9.47122 5.90245 9.49122C5.99945 9.51122 6.1 9.50125 6.19135 9.46125C6.2827 9.42625 6.3608 9.36126 6.41575 9.28126C6.4707 9.19626 6.5 9.10123 6.5 9.00123C6.5 8.86623 6.44735 8.74125 6.35355 8.64625C6.2598 8.55625 6.1326 8.50123 6 8.50123Z" fill="#374957"/>
                </g>
              </svg>
              &#x20; This is required only for verification and safety purpose
            </p>
          </div>

          <div>
            <div>
              <LocationSelector onConfirm={handleMapConfirm} />
            </div>

            <div className="flex flex-wrap gap-1 ">
              {[
                "Home Spintex",
                "Shop Accra",
                "Shop East Legon",
                "Shop Kumasi",
              ].map((loc) => (
                <button
                  key={loc}
                  type="button"
                  className="p-1 bg-gray-100 rounded-xs text-[length:0.9vw] hover:bg-gray-200"
                  onClick={() => setRegionLocation(loc)}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block gap-2 mb-1 font-medium">Key Features</label>
            <div className="flex  flex-col gap-2">
              <input
                type="text"
                placeholder="Key 1"
                className="w-full border rounded-xl border-[var(--div-border)] p-3"
              />
              <input
                type="text"
                placeholder="Key 2"
                className="w-full border rounded-xl border-[var(--div-border)] p-3"
              />
            </div>
            <div className="h-12 w-full" />
          </div>
        </div>

        <div className="relative flex flex-col w-full lg:w-2/5 bg-white shadow-lg rounded-xl p-6">
          <label className="border-1 border-dashed rounded-xl flex flex-col items-center justify-center h-25 cursor-pointer hover:bg-gray-50">
            <p className="text-xs text-gray-500 mb-1">Upload Images</p>
            <img
              src={uploadImg}
              alt="upload"
              className="w-5 h-5 text-gray-500"
            />
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          <div className="flex justify-between text-xs scale-60 -ml-17 text-gray-500 my-1 gap-1">
            <span className="whitespace-nowrap py-1 px-2 bg-[var(--div-active)] rounded-xl">
              {uploadedImages.length} images added
            </span>
            <span className="whitespace-nowrap py-1 px-2 bg-[var(--div-active)] rounded-xl">
              • Drag images to arrange
            </span>
            <span className="whitespace-nowrap py-1 px-2 bg-[var(--div-active)] rounded-xl">
              • Tap image twice to delete
            </span>
          </div>

          <div ref={gridRef} className="grid grid-cols-3 gap-4 relative">
            {uploadedImages.map((img) => (
              <div key={img.id} className="relative group">
                <img
                  src={img.url}
                  alt={`Uploaded ${img.id}`}
                  className="w-full rounded-lg object-cover cursor-pointer"
                  onClick={() => setSelectedImage(img.id)}
                />
                {selectedImage === img.id && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg z-10">
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="border border-[var(--div-border)] bg-transparent text-red-600 hover:bg-red-200/40 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="lg:absolute lg:-ml-5 bottom-4 w-full flex justify-center items-center">
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-[80%] hover:bg-[var(--accent)] hover:border border-[var(--div-border)] rounded-2xl py-3 text-center cursor-pointer bg-[var(--div-active)]"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
