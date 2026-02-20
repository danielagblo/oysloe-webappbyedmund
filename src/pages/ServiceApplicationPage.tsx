import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import MenuButton from "../components/MenuButton";
import ProfileStats from "../components/ProfileStats";
import { useUserProfile } from "../features/userProfile/useUserProfile";
import { createJobApplication } from "../services/jobService";
import { nothingToShowUrl } from "../assets/images";
import { assetUrl } from "../assets/publicAssets";

interface ApplicationFormData {
  name: string;
  phone: string;
  email: string;
  location: string;
  gender: string;
  dateOfBirth: string;

  coverLetter: string;
  resume: File | null;
}

function ServiceApplicationPage() {
  const navigate = useNavigate();
  const { profile: userProfile, loading: profileLoading } = useUserProfile();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ApplicationFormData>({
    name: "",
    phone: "",
    email: "",
    location: "",
    gender: "",
    dateOfBirth: "",
    coverLetter: "",
    resume: null,
  });

  // Save draft to localStorage
  const handleSaveDraft = useCallback(
    async (isAutoSave: boolean = false) => {
      setIsSaving(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const dataToSave = {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          location: formData.location,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          coverLetter: formData.coverLetter,
        };

        localStorage.setItem(
          "serviceApplicationDraft",
          JSON.stringify(dataToSave),
        );

        if (!isAutoSave) {
          toast.success("Draft saved successfully!");
        }
      } catch (error) {
        console.error("Failed to save draft:", error);
        toast.error("Failed to save draft");
      } finally {
        setIsSaving(false);
      }
    },
    [formData],
  );

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("serviceApplicationDraft");
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData({
          ...parsed,
          resume: null, // Files can't be stored in localStorage
        });
      } catch (error) {
        console.warn("Failed to load draft:", error);
      }
    }
  }, []);

  // Autofill from user profile
  useEffect(() => {
    if (userProfile) {
      setFormData((prev) => ({
        ...prev,
        name: userProfile.name || prev.name,
        phone: userProfile.phone || prev.phone,
        email: userProfile.email || prev.email,
        location: userProfile.address || prev.location,
      }));
    }
  }, [userProfile]);

  // Auto-save every 90 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      handleSaveDraft(true);
    }, 90000);

    return () => clearInterval(autoSaveInterval);
  }, [formData, handleSaveDraft]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setFormData((prev) => ({
        ...prev,
        resume: file,
      }));
    } else {
      toast.error("File size must be less than 10MB");
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({
      ...prev,
      resume: null,
    }));
  };

  const handleNext = () => {
    // Validate current step
    if (currentStep === 1) {
      if (!formData.name || !formData.location) {
        toast.error("Please fill in required fields");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      // Build payload according to API schema
      const payload: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        gender: formData.gender,
        dob: formData.dateOfBirth,
        cover_letter: formData.coverLetter,
      };

      if (formData.resume instanceof File) payload.resume = formData.resume;

      await createJobApplication(payload);

      toast.success("Application submitted successfully!");
      // Clear saved draft on success
      localStorage.removeItem("serviceApplicationDraft");
      navigate("/");
    } catch (err: any) {
      console.error("Failed to submit application:", err);
      const msg =
        err instanceof Error ? err.message : "Failed to submit application";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center max-sm:pb-5 gap-1 sm:gap-4 mb-2">
      {[1, 2, 3].map((step) => (
        <div
          key={step}
          className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none"
        >
          <div
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm ${
              step === currentStep
                ? "bg-(--dark-def) text-white"
                : step < currentStep
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-600"
            }`}
          >
            {step < currentStep ? "✓" : step}
          </div>
          <span
            className={`hidden sm:inline text-xs sm:text-sm font-medium ${step === currentStep ? "text-(--dark-def)" : "text-gray-500"}`}
          >
            {step === 1 ? "Personal" : step === 2 ? "Additional" : "Review"}
          </span>
          {step < 3 && (
            <div className="flex-1 sm:w-8 h-px bg-gray-300 mx-0.5 sm:mx-2" />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex w-full min-h-screen bg-(--div-active) text-(--dark-def)">
      <div className="hidden lg:flex lg:w-1/4 bg-(--div-active) flex-col">
        <MenuButton />
        <div className="fixed top-0 left-2">
          <ProfileStats />
        </div>
      </div>

      <div className="w-full lg:w-3/4 flex-1 lg:p-2 items-center justify-center flex px-3 sm:px-0">
        <div className="w-full lg:w-full flex flex-col rounded-none sm:rounded-2xl max-lg:min-h-screen sm:h-[93vh] sm:max-h-[93vh] bg-white sm:shadow-lg">
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 gap-2">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-base font-medium text-(--dark-def) disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80"
            >
              <img
                src={assetUrl("arrowleft.svg")}
                alt=""
                className="h-4 w-4 sm:h-5 sm:w-5"
              />
              <span className="hidden sm:inline">Back</span>
            </button>
            <button
              onClick={() => handleSaveDraft(false)}
              disabled={isSaving}
              className={`px-3 sm:px-6 py-2 bg-(--dark-def) text-white rounded-lg text-xs sm:text-base font-medium transition-all whitespace-nowrap ${
                isSaving ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
              }`}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>

          <div className="px-3 sm:px-6 pt-3 sm:pt-4 max-sm:w-full">
            <StepIndicator />
          </div>

          {/* Form */}
          <div className="flex-1 px-3 sm:px-6 pb-6 sm:pb-8 overflow-y-auto no-scrollbar">
            {profileLoading && currentStep === 1 ? (
              <div className="flex items-center justify-center py-8 sm:py-16">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-gray-300 border-t-(--dark-def) rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-sm sm:text-base text-gray-600">
                    Loading your profile...
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* STEP 1: Personal Details */}
                {currentStep === 1 && (
                  <div className="w-full sm:max-w-2xl">
                    <div className="mb-4 sm:mb-6">
                      <h2 className="text-xl sm:text-3xl font-semibold mb-1 sm:mb-2">
                        Personal details
                      </h2>
                      <p className="text-gray-600 text-xs sm:text-base">
                        Allow us to get to know you a bit by sharing some
                        details about you.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Ex. John Agblo"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--dark-def) text-sm"
                        />
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="0552892433"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--dark-def) text-sm"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--dark-def) text-sm"
                        />
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Location <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="Ex. Accra, Santa Maria"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--dark-def) text-sm"
                        />
                      </div>

                      {/* Gender and Date of Birth */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Gender
                          </label>
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--dark-def) text-sm"
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--dark-def) text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 sm:mt-8 flex justify-center">
                      <button
                        onClick={handleNext}
                        className="px-8 sm:px-12 py-2.5 sm:py-3 bg-(--dark-def) text-white rounded-lg text-sm sm:text-base font-medium hover:opacity-90"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Additional Details */}
                {currentStep === 2 && (
                  <div className="w-full sm:max-w-2xl">
                    <div className="mb-4 sm:mb-6">
                      <h2 className="text-xl sm:text-3xl font-semibold mb-1 sm:mb-2">
                        Additional details
                      </h2>
                      <p className="text-gray-600 text-xs sm:text-base">
                        In order to select you for the right job opportunities
                        we need some more details.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Cover Letter
                        </label>
                        <textarea
                          name="coverLetter"
                          value={formData.coverLetter}
                          onChange={handleInputChange}
                          placeholder="Tell us about yourself and why you're interested..."
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--dark-def) text-sm resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-3">
                          Resume
                        </label>

                        {formData.resume ? (
                          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">
                                <img
                                  src={assetUrl("resume.svg")}
                                  className="h-6 w-6"
                                  alt="resume"
                                />
                              </span>
                              <div>
                                <p className="text-sm font-medium">
                                  {formData.resume.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(formData.resume.size / 1024 / 1024).toFixed(
                                    2,
                                  )}{" "}
                                  MB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={handleRemoveFile}
                              className="text-red-500 hover:text-red-700 text-xl cursor-pointer"
                            >
                              <img
                                src={assetUrl("bin-svg.svg")}
                                className="h-6 w-6"
                                alt="delete"
                              />
                            </button>
                          </div>
                        ) : null}

                        <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-(--dark-def) hover:bg-gray-50 transition">
                          <span className="text-2xl font-bold -mt-1">+</span>
                          <span className="text-sm font-medium">Add File</span>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          Max file size 10MB (pdf, doc, docx)
                        </p>
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="mt-8 flex justify-center gap-4">
                      <button
                        onClick={handleBack}
                        className="px-12 py-3 border-2 border-(--dark-def) text-(--dark-def) rounded-lg font-medium hover:bg-gray-50"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleNext}
                        className="px-12 py-3 bg-(--dark-def) text-white rounded-lg font-medium hover:opacity-90"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Review */}
                {currentStep === 3 && (
                  <div className="w-full sm:max-w-2xl">
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-2xl sm:text-3xl font-semibold">
                        Review your application
                      </h2>
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="text-sm text-(--dark-def) font-medium hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base mb-8">
                      Is your information correct?
                    </p>

                    {/* Personal Details Section */}
                    <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">
                        Personal details
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">
                            {formData.name || "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium">
                            {formData.phone || "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">
                            {formData.email || "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">
                            {formData.location || "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="font-medium">
                            {formData.dateOfBirth && formData.gender
                              ? `${formData.gender} - DOB: ${formData.dateOfBirth}`
                              : "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Additional Information Section */}
                    <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">
                        Additional information
                      </h3>

                      {/* Cover Letter */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold mb-2">
                          Cover letter
                        </h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {formData.coverLetter || "No cover letter provided"}
                        </p>
                      </div>

                      {/* Resume */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Resume</h4>
                        {formData.resume ? (
                          <div className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg w-fit">
                            <span className="text-xl">
                              <img
                                src={assetUrl("resume.svg")}
                                className="h-6 w-6"
                                alt="resume"
                              />
                            </span>
                            <span className="text-sm font-medium">
                              {formData.resume.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({(formData.resume.size / 1024 / 1024).toFixed(2)}{" "}
                              MB)
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center flex-col justify-center">
                              <img
                                src={nothingToShowUrl}
                                sizes="60px"
                              className="h-15 w-15"
                              alt="nothing to show"
                            />
                            <p className="text-sm text-gray-500">
                              No resume uploaded
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6 sm:mt-8 flex justify-center gap-2 sm:gap-4">
                      <button
                        onClick={handleBack}
                        className="px-6 sm:px-12 py-2.5 sm:py-3 border-2 border-(--dark-def) text-(--dark-def) rounded-lg text-sm sm:text-base font-medium hover:bg-gray-50"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className={`px-6 sm:px-12 py-2.5 sm:py-3 bg-(--dark-def) text-white rounded-lg text-sm sm:text-base font-medium ${isSaving ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`}
                      >
                        {isSaving ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </div>
                )}
                <div className="h-15 w-full" />
              </>
            )}
          </div>
        </div>
      </div>
      <MenuButton />
    </div>
  );
}

export default ServiceApplicationPage;
