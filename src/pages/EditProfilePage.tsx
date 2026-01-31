import { Camera, PlusIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAccountDeleteRequest from "../features/accountDelete/useAccountDeleteRequest";
import useUserProfile from "../features/userProfile/useUserProfile";
import { apiClient } from "../services/apiClient";
import { endpoints } from "../services/endpoints";
import { buildMediaUrl } from "../services/media";

// Local Cloudinary upload helper (unsigned preset). Returns upload response or null.
const uploadToCloudinary = async (file: File) => {
  try {
    const cloudName =
      (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string) ||
      (import.meta.env.CLOUDINARY_CLOUD_NAME as string);
    const uploadPreset =
      (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string) ||
      (import.meta.env.CLOUDINARY_UPLOAD_PRESET as string);
    if (!cloudName || !uploadPreset) return null;
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", uploadPreset);
    const resp = await fetch(url, { method: "POST", body: fd });
    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`Cloudinary upload failed: ${resp.status} ${txt}`);
    }
    return await resp.json();
  } catch (e) {
    console.warn("Cloudinary upload error:", e);
    return null;
  }
};

const EditProfilePage = () => {
  const [closeProgress] = useState(true);
  // derive setup progress from profile completeness

  // load profile and prefill editable local state
  const { profile, updateProfile } = useUserProfile();
  // compute setup progress after profile is available
  const setupProgress: number = useMemo(() => {
    if (!profile) return 0;
    // fields to consider for profile completeness
    const fields = [
      profile.name,
      profile.email,
      profile.phone,
      profile.business_name,
      profile.business_logo,
      profile.avatar,
      profile.id_number,
      profile.id_front_page,
      profile.id_back_page,
      profile.account_name,
      profile.account_number,
      profile.mobile_network,
    ];
    const filled = fields.filter((f) => !!f).length;
    if (fields.length === 0) return 0;
    return Math.round((filled / fields.length) * 100);
  }, [profile]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  //readonly toggle - make editable by default when opening edit page
  const [isReadonly, setIsReadonly] = useState<boolean>(true);
  const [isReadonlyRight, setIsReadonlyRight] = useState<boolean>(true);

  const [accountDeletionRequested, setAccountDeletionRequested] =
    useState(false);

  const [selectedUser, setSelectedUser] = useState<{
    profileImage?: string;
    businessLogo?: string;
    name?: string;
    email?: string;
    phonePrimary?: string;
    phoneSecondary?: string;
    nationalId?: string;
    businessName?: string;
    accountName?: string;
    accountNumber?: string;
    mobileNetwork?: string;
    // verification flags populated from backend profile
    emailVerified?: boolean;
    phoneVerified?: boolean;
    idVerified?: boolean;
    // ID pages
    idFrontImage?: string;
    idBackImage?: string;
  }>({});

  useEffect(() => {
    if (profile) {
      const sanitize = (val?: string | null) => {
        if (!val) return undefined;
        if (typeof val !== "string") return val;
        // treat values that contain only asterisks and whitespace as empty
        return /[^*\s]/.test(val) ? val : undefined;
      };

      setSelectedUser({
        profileImage: sanitize(profile.avatar) || undefined,
        businessLogo: sanitize(profile.business_logo) || undefined,
        name: sanitize(profile.name) || undefined,
        email: sanitize(profile.email) || undefined,
        phonePrimary: profile.phone || undefined,
        phoneSecondary: profile.second_number || undefined,
        nationalId: sanitize(profile.id_number) || undefined,
        businessName: sanitize(profile.business_name) || undefined,
        accountName: sanitize(profile.account_name) || undefined,
        accountNumber: profile.account_number || undefined,
        mobileNetwork: profile.mobile_network || undefined,
        // read verification flags (backend uses snake_case)
        emailVerified: (profile as any).email_verified ?? false,
        phoneVerified: (profile as any).phone_verified ?? false,
        idVerified: (profile as any).id_verified ?? false,
        idFrontImage: sanitize((profile as any).id_front_page) || undefined,
        idBackImage: sanitize((profile as any).id_back_page) || undefined,
      });
    }
  }, [profile]);

  // hold chosen id files to submit to backend directly
  const [idFrontFile, setIdFrontFile] = useState<File | null>(null);
  const [idBackFile, setIdBackFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedUser((prev) => ({ ...prev, [name]: value }));
  };

  const avatarPlaceholder =
    "https://placehold.co/100x100?text=Avatar&bg=EFEFEF&fg=666";
  const logoPlaceholder =
    "https://placehold.co/100x100?text=Logo&bg=EFEFEF&fg=666";
  const idFrontPlaceholder =
    "https://placehold.co/200x120?text=ID+Front&bg=EFEFEF&fg=666";
  const idBackPlaceholder =
    "https://placehold.co/200x120?text=ID+Back&bg=EFEFEF&fg=666";
  // removed ID front/back placeholders — ID pages are no longer collected here

  const onImgError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    fallback: string = avatarPlaceholder,
  ) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = fallback;
  };

  const getFileLabel = (file?: File | null, path?: string) => {
    if (file && file.name)
      return file.name.length > 24 ? file.name.slice(0, 21) + "..." : file.name;
    if (path) {
      const name = path.split("/").pop();
      if (name) return name.length > 24 ? name.slice(0, 21) + "..." : name;
    }
    return "Upload";
  };

  // const stripAssetPath = (val?: string) => {
  //   if (!val) return val;
  //   try {
  //     // If the value is an assets path, return just the filename
  //     if (val.includes("/assets/")) return val.split("/").pop();
  //   } catch {
  //     // ignore
  //   }
  //   return val;
  // };

  const navigate = useNavigate();

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const { create, data } = useAccountDeleteRequest();

  const handleDelete = async () => {
    if (!deleteReason) {
      toast.warning("Delete reason required");
      return;
    }

    if (typeof create !== "function") {
      toast.error("Account delete action is not available");
      return;
    }

    if (data && (data.status === "PENDING" || data.status === "APPROVED")) {
      toast.warning(
        `You already have a${data.status === "APPROVED" ? "n " : " "}${data.status.toLowerCase()} delete request.`,
      );
      return;
    }

    //check if user has a rejected request/no pending or approved b4 allowing them to proceed

    try {
      await create({ reason: deleteReason });
      setAccountDeletionRequested(false);
      setDeleteReason("");
      toast.success("Account delete request submitted successfully");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to submit delete request: ${msg}`);
    }
  };

  // hold chosen files to submit to backend directly
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  // image modal for previewing larger images
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageModalSrc, setImageModalSrc] = useState<string | null>(null);
  const [imageModalAlt, setImageModalAlt] = useState<string | null>(null);

  return (
    <>
      <div className="flex justify-between min-h-screen w-screen relative max-sm:pt-10">
        <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; } /* Chrome, Safari, Opera */
      `}</style>
        <div className="flex flex-col lg:flex-row w-full sm:mt-0 min-h-0 max-h-screen max-lg:overflow-auto lg:overflow-hidden hide-scrollbar justify-start gap-2 py-2 sm:py-[3.5vh]">
          {/* LEFT COLUMN: full width on small screens, half on md+; no internal scroll */}
          <div className="lg:w-1/2">
            <div className="relative lg:overflow-auto no-scrollbar bg-white h-fit lg:h-[93vh] max- pt-10  lg:pb-12 w-full lg:mt-0 lg:pt-10 flex flex-col justify-start items-center gap-4 px-3 py-3 lg:rounded-2xl text-xs">
              {closeProgress && setupProgress < 100 && (
                <div className="flex-col gap-2 p-4 max-sm:pt-10 w-[90%] max-sm:w-full bg-gray-50 rounded-2xl">
                  <div className="my-3 h-[6px] w-full bg-[#defeed] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#74ffa7] rounded-full"
                      style={{ width: `${setupProgress}%` }}
                    />
                  </div>

                  <p className="text-lg">You're set now {setupProgress}%</p>
                  <p className="mb-3">
                    {setupProgress === 100
                      ? "Congrats! Submit your first ad"
                      : "Complete your account to upload your first ad"}
                  </p>
                  {setupProgress === 100 && (
                    <div className="mt-[-5px] w-full flex justify-end items-center">
                      <button
                        className="p-2 cursor-pointer flex justify-between gap-2 bg-gray-100 rounded-full px-4 items-center"
                        onClick={() => navigate("/postad")}
                      >
                        <span className="border-2 border-gray-500 p-0.5 rounded">
                          <PlusIcon size={12} />
                        </span>
                        <p>Post Ad</p>
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end w-2/5">
                <button
                  className="bg-gray-100 py-3 w-full rounded-xl text-sm cursor-pointer hover:scale-95 active:scale-105 hover:bg-gray-200  transition"
                  onClick={() => {
                    setIsReadonly(!isReadonly);
                    setIsReadonlyRight(!isReadonlyRight);
                  }}
                >
                  {isReadonly ? "Edit Details" : "Preview Details"}
                </button>
              </div>

              {/* profile images area */}
              <div className="flex justify-center flex-col items-center w-full p-2 rounded-md gap-3">
                <div className="flex flex-row items-center bg-white p-2 rounded-2xl border border-dashed border-gray-300 justify-around w-full relative">
                  <div className="bg-green-300 relative rounded-full p-1">
                    {selectedUser?.profileImage ? (
                      <img
                        src={
                          buildMediaUrl(selectedUser?.profileImage)
                        }
                        alt="Profile"
                        className="w-17 max-w-full h-17 lg:w-[5vw] lg:h-[5vw] rounded-full border-5 border-white object-cover bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setImageModalSrc(
                            buildMediaUrl(selectedUser?.profileImage) ||
                            avatarPlaceholder,
                          );
                          setImageModalAlt("Profile Image");
                          setImageModalOpen(true);
                        }}
                        onError={(e) => onImgError(e, avatarPlaceholder)}
                      />
                    ):(
                      <svg 
                        className="w-17 max-w-full h-17 lg:w-[5vw] lg:h-[5vw] rounded-full border-5 border-white object-cover bg-gray-100 cursor-pointer"
                        viewBox="0 0 60 61" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M30 61C46.5685 61 60 47.3447 60 30.5C60 13.6553 46.5685 0 30 0C13.4315 0 0 13.6553 0 30.5C0 47.3447 13.4315 61 30 61Z" fill="#B8BAC0"/>
                        <path d="M29.9999 45.0094C26.5069 45.0094 23.3378 43.5105 20.9996 41.0879C20.9978 42.5398 20.9451 44.6353 20.5601 46.1643C20.8126 46.3186 21.0086 46.572 21.0468 46.8873C21.5458 50.9478 25.3944 54.0094 29.9999 54.0094C34.6044 54.0094 38.4531 50.9474 38.9531 46.8873C38.9918 46.5716 39.1836 46.3186 39.4399 46.1648C39.0549 44.6356 39.0021 42.5399 39.0003 41.0879C36.6621 43.5105 33.4929 45.0094 29.9999 45.0094Z" fill="white"/>
                        <path d="M38.8049 41.2724C36.4863 43.582 33.3997 45.0094 29.9999 45.0094C26.5069 45.0094 23.3378 43.5105 20.9996 41.0879C20.9978 42.5398 20.9451 44.6353 20.5601 46.1643C20.8126 46.3186 21.0086 46.572 21.0468 46.8873C21.2674 48.6821 22.1441 50.2803 23.4497 51.5065C29.4707 50.6588 36.3046 44.7134 38.8049 41.2724Z" fill="#D7DBE0"/>
                        <path d="M39 20.0078H22C19.2431 20.0078 17 22.2509 17 25.0078V31.0078C17 38.7276 22.832 45.0078 30 45.0078C37.168 45.0078 43 38.7276 43 31.0078V24.0078C43 21.8023 41.206 20.0078 39 20.0078Z" fill="white"/>
                        <path d="M8 49.0682C13.4913 55.1651 21.4449 59.0002 30.296 59.0002C39.1471 59.0002 47.1008 55.1651 52.592 49.0682C51.6345 47.7737 50.2843 46.7219 48.548 46.2358C48.508 46.2246 48.4679 46.2158 48.4269 46.2099L40.4445 45.0122C40.3956 45.0048 40.2911 45.0009 40.2414 45.0009C39.7365 45.0009 39.3107 45.3774 39.2491 45.8788C38.7491 49.9388 34.9005 53.0009 30.296 53.0009C25.6905 53.0009 21.8419 49.9394 21.3429 45.8788C21.2804 45.3627 20.8155 44.9746 20.3252 45.0013C20.2666 44.9979 20.209 45.0028 20.1475 45.0121L12.1651 46.2098C12.1241 46.2157 12.0841 46.2244 12.044 46.2357C10.3078 46.7221 8.9575 47.7737 8 49.0682Z" fill="#5C546A"/>
                      </svg>
                    )}

                    {!isReadonly && (
                      <label
                        htmlFor="avatar-file-input"
                        className="absolute right-0 bottom-0 bg-white rounded-full p-1 shadow z-10 cursor-pointer"
                      >
                        <input
                          id="avatar-file-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0] ?? null;
                            if (f) {
                              setAvatarFile(f);
                              setSelectedUser((p) => ({
                                ...p,
                                profileImage: URL.createObjectURL(f),
                              }));
                            }
                          }}
                        />
                        <Camera size={16} />
                      </label>
                    )}
                  </div>
                  
                  <div className="max-w-7/10 lg:max-w-3/5">
                    <p className="text-sm lg:text-[1.1vw] font-semibold flex gap-1 items-center">
                      <span>Profile Image</span>
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <mask id="mask0_21369_749" maskUnits="userSpaceOnUse" x="0" y="0" width="11" height="11">
                        <path d="M11 0H0V11H11V0Z" fill="white"/>
                        </mask>
                        <g mask="url(#mask0_21369_749)">
                        <path d="M5.50008 6.87612C5.37853 6.87612 5.26198 6.82569 5.17599 6.74319C5.09006 6.65611 5.04175 6.54154 5.04175 6.41779V2.75112C5.04175 2.62737 5.09006 2.51281 5.17599 2.42572C5.26198 2.34322 5.37853 2.29279 5.50008 2.29279C5.62163 2.29279 5.73823 2.34322 5.82417 2.42572C5.91015 2.51281 5.95842 2.62737 5.95842 2.75112V6.41779C5.95842 6.54154 5.91015 6.65611 5.82417 6.74319C5.73823 6.82569 5.62163 6.87612 5.50008 6.87612ZM5.86354 10.8911C6.85354 10.4924 10.0834 8.92947 10.0834 5.51947V3.14987C10.0839 2.66862 9.93244 2.2011 9.65047 1.80693C9.36855 1.41735 8.97053 1.12863 8.51316 0.977376L5.64446 0.0240625C5.55082 -0.00802083 5.44939 -0.00802083 5.35571 0.0240625L2.487 0.977376C2.02963 1.12863 1.63166 1.41735 1.34969 1.80693C1.06777 2.2011 0.916245 2.66862 0.916749 3.14987V5.51947C0.916749 8.53072 4.12737 10.3686 5.11187 10.859C5.2364 10.9186 5.36643 10.969 5.50008 11.0011C5.62438 10.9736 5.74602 10.937 5.86354 10.8911ZM8.22441 1.84363C8.49877 1.9353 8.73743 2.10945 8.9066 2.34779C9.07577 2.58154 9.16679 2.86112 9.16675 3.14987V5.51947C9.16675 8.35656 6.37687 9.69488 5.52162 10.0386C4.65629 9.6078 1.83342 8.00364 1.83342 5.51947V3.14987C1.83337 2.86112 1.92439 2.58154 2.09357 2.34779C2.26274 2.10945 2.50144 1.9353 2.77575 1.84363L5.50008 0.940729L8.22441 1.84363ZM5.50008 7.79279C5.40942 7.79279 5.32083 7.82031 5.24548 7.87073C5.17008 7.92114 5.11133 7.98987 5.07663 8.07695C5.04198 8.15945 5.0329 8.2511 5.05055 8.34277C5.06824 8.42985 5.11192 8.51236 5.17599 8.57652C5.24012 8.64069 5.32179 8.68195 5.41066 8.70028C5.49958 8.71861 5.59175 8.70948 5.67549 8.67281C5.75922 8.64073 5.83081 8.58115 5.88118 8.50782C5.93156 8.4299 5.95842 8.34279 5.95842 8.25112C5.95842 8.12737 5.91015 8.01281 5.82417 7.92572C5.73823 7.84322 5.62163 7.79279 5.50008 7.79279Z" fill="#FF6B6B"/>
                        </g>
                      </svg>

                    </p>
                    <p className="text-[11px] lg:text-[0.9vw]">To verify your identity and keep the platform safe. A clear Picture of your face is required.</p>
                  
                  </div>
                </div>
                <div className="flex flex-row items-center justify-around  bg-white p-2 rounded-2xl border border-dashed border-gray-300 w-full relative">
                  <div className="bg-green-300 p-1 rounded-full relative">
                    <img
                      src={
                        buildMediaUrl(selectedUser?.businessLogo) || logoPlaceholder
                      }
                      alt="Business Logo"
                      className="w-17 max-w-full h-17 lg:w-[5vw] lg:h-[5vw] border-5 border-white rounded-full object-cover bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setImageModalSrc(
                          buildMediaUrl(selectedUser?.businessLogo) ||
                          logoPlaceholder,
                        );
                        setImageModalAlt("Business Logo");
                        setImageModalOpen(true);
                      }}
                      onError={(e) => onImgError(e, logoPlaceholder)}
                    />
                    {!isReadonly && (
                      <label
                        htmlFor="logo-file-input"
                        className="absolute right-0 bottom-0 bg-white rounded-full p-1 shadow z-10 cursor-pointer"
                      >
                        <input
                          id="logo-file-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0] ?? null;
                            if (f) {
                              setLogoFile(f);
                              setSelectedUser((p) => ({
                                ...p,
                                businessLogo: URL.createObjectURL(f),
                              }));
                            }
                          }}
                        />
                        <Camera size={16} />
                      </label>
                    )}
                  </div>
                <div className="max-w-7/10 lg:max-w-3/5">
                  <p className="text-sm lg:text-[1.1vw] font-semibold">Business Logo</p>
                  <p className="text-[11px] lg:text-[0.9vw]">Upload any image that represents what you do.</p>
                </div>                  
                </div>
              </div>

              {/* general details */}
              <div className="w-[95%] bg-white p-4 rounded-md">
                <div className="grid grid-cols-2 justify-between items-center mb-2 max-w-[650px]">
                  <p className="text-sm font-medium whitespace-nowrap">
                    General Details
                  </p>
                  <button
                    onClick={() => setAccountDeletionRequested(true)}
                    className="text-xs cursor-pointer hover:text-red-700 underline text-red-500 transition text-right"
                    title="This is IRREVERSIBLE"
                  >
                    Deactivate
                  </button>
                </div>
                <label className="text-xs text-gray-600">Name</label>
                <input
                  name="name"
                  readOnly={isReadonly}
                  value={selectedUser?.name ?? ""}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded border border-gray-200 mb-3 text-sm focus:outline-none read-only:cursor-not-allowed read-only:border-transparent read-only:bg-gray-50"
                />

                <label className="text-xs text-gray-600">Business Name</label>
                <input
                  name="businessName"
                  readOnly={isReadonly}
                  value={selectedUser?.businessName ?? ""}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded border border-gray-200 mb-3 text-sm focus:outline-none read-only:cursor-not-allowed read-only:border-transparent read-only:bg-gray-50"
                />

                <div className="flex items-center">
                  <label className="text-xs text-gray-600">Email</label>
                </div>
                <input
                  name="email"
                  readOnly={isReadonly}
                  pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                  value={selectedUser?.email ?? ""}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded border border-gray-200 mb-3 text-sm focus:outline-none read-only:cursor-not-allowed read-only:border-transparent read-only:bg-gray-50"
                />

                <div className="flex items-center">
                  <label className="text-xs text-gray-600">First Number</label>
                  &nbsp;
                  <p className="mb-1 text-xs inline text-white bg-blue-400 px-1 py-0.5 text-[0.6rem] rounded-2xl">
                    {selectedUser?.phoneVerified ? "Verified" : "Unverified"}
                  </p>
                </div>
                <input
                  name="phonePrimary"
                  readOnly={isReadonly}
                  pattern="^\+?[0-9\s-]{7,15}$"
                  value={selectedUser?.phonePrimary ?? ""}
                  onChange={handleInputChange}
                  className="focus:outline-none read-only:cursor-not-allowed read-only:border-transparent read-only:bg-gray-50 w-full p-2 rounded border border-gray-200 mb-3 text-sm"
                />

                <label className="text-xs text-gray-600">Second Number</label>
                <input
                  name="phoneSecondary"
                  readOnly={isReadonly}
                  pattern="^\+?[0-9\s-]{7,15}$"
                  value={selectedUser?.phoneSecondary ?? ""}
                  onChange={handleInputChange}
                  className="focus:outline-none read-only:cursor-not-allowed read-only:border-transparent read-only:bg-gray-50 w-full p-2 rounded border border-gray-200 mb-3 text-sm"
                />

                <div className="flex items-center">
                  <label className="text-xs text-gray-600">National ID</label>
                  &nbsp;
                  <p className="mb-1 inline text-xs text-white bg-blue-400 px-1 py-0.5 text-[0.6rem] rounded-2xl">
                    {selectedUser?.idVerified ? "Verified" : "Unverified"}
                  </p>
                </div>
                <input
                  name="nationalId"
                  readOnly={isReadonly}
                  pattern="^GHA-\d{9}-\d$"
                  value={selectedUser?.nationalId ?? ""}
                  onChange={handleInputChange}
                  className="focus:outline-none read-only:cursor-not-allowed read-only:border-transparent read-only:bg-gray-50 w-full p-2 rounded border border-gray-200 mb-3 text-sm"
                />

                {/* ID front/back previews and upload inputs */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="flex flex-col items-center">
                    <img
                      src={
                        buildMediaUrl(selectedUser?.idFrontImage) ||
                        idFrontPlaceholder
                      }
                      alt="ID Front"
                      className="w-full max-w-[200px] h-auto rounded-md object-cover bg-gray-100 mb-2 cursor-pointer"
                      onClick={() => {
                        setImageModalSrc(
                          buildMediaUrl(selectedUser?.idFrontImage) ||
                          idFrontPlaceholder,
                        );
                        setImageModalAlt("ID Front");
                        setImageModalOpen(true);
                      }}
                      onError={(e) => onImgError(e, idFrontPlaceholder)}
                    />
                    <label className="text-xs">ID Front</label>
                    {!isReadonly && (
                      <>
                        <input
                          id="id-front-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0] ?? null;
                            if (f) {
                              setIdFrontFile(f);
                              setSelectedUser((p) => ({
                                ...p,
                                idFrontImage: URL.createObjectURL(f),
                              }));
                            }
                          }}
                        />
                        <label
                          htmlFor="id-front-input"
                          className="mt-2 inline-block text-sm px-3 py-1 bg-gray-200 rounded cursor-pointer"
                          title={selectedUser?.idFrontImage}
                        >
                          {getFileLabel(idFrontFile, selectedUser?.idFrontImage)}
                        </label>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <img
                      src={
                        buildMediaUrl(selectedUser?.idBackImage) ||
                        idBackPlaceholder
                      }
                      alt="ID Back"
                      className="w-full max-w-[200px] h-auto rounded-md object-cover bg-gray-100 mb-2 cursor-pointer"
                      onClick={() => {
                        setImageModalSrc(
                          buildMediaUrl(selectedUser?.idBackImage) ||
                          idBackPlaceholder,
                        );
                        setImageModalAlt("ID Back");
                        setImageModalOpen(true);
                      }}
                      onError={(e) => onImgError(e, idBackPlaceholder)}
                    />
                    <label className="text-xs">ID Back</label>
                    {!isReadonly && (
                      <>
                        <input
                          id="id-back-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0] ?? null;
                            if (f) {
                              setIdBackFile(f);
                              setSelectedUser((p) => ({
                                ...p,
                                idBackImage: URL.createObjectURL(f),
                              }));
                            }
                          }}
                        />
                        <label
                          htmlFor="id-back-input"
                          className="mt-2 inline-block text-sm px-3 py-1 bg-gray-200 rounded cursor-pointer"
                          title={selectedUser?.idBackImage}
                        >
                          {getFileLabel(idBackFile, selectedUser?.idBackImage)}
                        </label>
                      </>
                    )}
                  </div>
                </div>

                {setupProgress === 100 ? (
                  <></>
                ) : (
                  <div className="py-3 text-sm text-gray-600">
                    Finish the remaining account details to complete your profile.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* business details */}
          <div className="lg:w-1/2">
            <div className="bg-white lg:overflow-auto no-scrollbarw-full mt-2 lg:mt-0 flex flex-col justify-center items-center h-fit lg:h-[93vh] gap-4 px-3 py-3 pb-0 lg:pb-3 lg:rounded-2xl text-xs max-lg:mb-10 max-sm:mb-0">
              {/* {!selectedUser?.emailVerified && !linkSent && (
              <div className="flex flex-col justify-start items-center gap-2 p-4 w-[90%] bg-gray-50 rounded-2xl">
                <p className="text-lg text-center">Please verify your email*</p>
                <p className="mb-3 text-center">
                  We will send an email to {selectedUser?.email}. Click the link
                  in the email to verify your account.
                </p>
                <button
                  onClick={() => {
                    setOpenVerificationModal((prev) => !prev);
                  }}
                  className="text-center mx-auto px-4 cursor-pointer py-2 rounded-2xl bg-gray-200"
                >
                  Send Link
                </button>
              </div>
            )} */}

              <div className="w-[95%] bg-white p-4 rounded-md max-sm:pb-14">
                <div className="flex gap-6 items-center my-2">
                  <p className="text-sm font-medium">Payment Account</p>
                </div>
                <label className="text-xs text-gray-600">Account Name</label>
                <input
                  name="accountName"
                  pattern="^[A-Za-z][A-Za-z\s\.\-]{1,}$"
                  readOnly={isReadonlyRight}
                  value={selectedUser?.accountName ?? ""}
                  onChange={handleInputChange}
                  className="focus:outline-none read-only:cursor-not-allowed read-only:border-transparent read-only:bg-gray-50 w-full p-2 rounded border border-gray-200 mb-3 text-sm"
                />

                <label className="text-xs text-gray-600">Account Number</label>
                <input
                  name="accountNumber"
                  pattern="^\d{6,20}$"
                  readOnly={isReadonlyRight}
                  value={selectedUser?.accountNumber ?? ""}
                  onChange={handleInputChange}
                  className="focus:outline-none read-only:cursor-not-allowed read-only:border-transparent read-only:bg-gray-50 w-full p-2 rounded border border-gray-200 mb-3 text-sm"
                />

                <label className="text-xs text-gray-600">Mobile Network</label>
                <input
                  name="mobileNetwork"
                  readOnly={isReadonlyRight}
                  value={selectedUser?.mobileNetwork ?? ""}
                  onChange={handleInputChange}
                  className="focus:outline-none read-only:cursor-not-allowed read-only:border-transparent read-only:bg-gray-50 w-full p-2 rounded border border-gray-200 mb-3 text-sm"
                />

                {!isReadonly && (
                  <>
                    <button
                      onClick={async () => {
                        setSaveError(null);
                        setIsSaving(true);
                        try {
                          // If files were selected, prefer uploading them to Cloudinary
                          // first and sending the resulting URLs to the backend.
                          if (
                            avatarFile ||
                            logoFile ||
                            idFrontFile ||
                            idBackFile
                          ) {
                            try {
                              let avatarUrl: string | undefined;
                              let logoUrl: string | undefined;
                              let idFrontUrl: string | undefined;
                              let idBackUrl: string | undefined;
                              // upload avatar/logo to Cloudinary when available
                              if (avatarFile) {
                                const r = await uploadToCloudinary(avatarFile);
                                if (r && (r.secure_url || r.url))
                                  avatarUrl = r.secure_url || r.url;
                              }
                              if (logoFile) {
                                const r = await uploadToCloudinary(logoFile);
                                if (r && (r.secure_url || r.url))
                                  logoUrl = r.secure_url || r.url;
                              }
                              // upload ID front/back to Cloudinary when available
                              if (idFrontFile) {
                                const r = await uploadToCloudinary(idFrontFile);
                                if (r && (r.secure_url || r.url))
                                  idFrontUrl = r.secure_url || r.url;
                              }
                              if (idBackFile) {
                                const r = await uploadToCloudinary(idBackFile);
                                if (r && (r.secure_url || r.url))
                                  idBackUrl = r.secure_url || r.url;
                              }

                              // If we uploaded at least one file to Cloudinary,
                              // send a JSON PATCH with the URLs instead of the
                              // binary files. If Cloudinary isn't configured or
                              // uploads failed, fall back to multipart FormData below.
                              if (avatarUrl || logoUrl || idFrontUrl || idBackUrl) {
                                const payloadForServer: any = {
                                  name: selectedUser?.name,
                                  email: selectedUser?.email,
                                  phone: selectedUser?.phonePrimary,
                                  second_number: selectedUser?.phoneSecondary,
                                  id_number: selectedUser?.nationalId,
                                  address: (selectedUser as any)?.address,
                                  business_name: selectedUser?.businessName,
                                  account_name: selectedUser?.accountName,
                                  account_number: selectedUser?.accountNumber,
                                  mobile_network: selectedUser?.mobileNetwork,
                                  preferred_notification_email:
                                    selectedUser?.email,
                                  preferred_notification_phone:
                                    selectedUser?.phonePrimary,
                                };
                                if (avatarUrl) payloadForServer.avatar = avatarUrl;
                                if (logoUrl) payloadForServer.business_logo = logoUrl;
                                if (idFrontUrl) payloadForServer.id_front_page = idFrontUrl;
                                if (idBackUrl) payloadForServer.id_back_page = idBackUrl;

                                await apiClient.patch(
                                  endpoints.userProfile.userProfile,
                                  payloadForServer,
                                );

                                // refresh local cache
                                try {
                                  const payloadForUpdate: any = {
                                    ...payloadForServer,
                                  };
                                  await updateProfile(payloadForUpdate);
                                } catch (e) {
                                  void e;
                                }

                                // skip the fallback multipart branch
                                // (we already saved via JSON)
                                // continue to success handling
                                // (no-op here)
                              } else {
                                // fallthrough to original multipart behavior
                                throw new Error("cloudinary-not-available");
                              }
                            } catch (err) {
                              // Fallback: original multipart/form-data flow
                              const form = new FormData();
                              if (avatarFile) form.append("avatar", avatarFile);
                              if (logoFile) form.append("business_logo", logoFile);
                              if (idFrontFile) form.append("id_front_page", idFrontFile);
                              if (idBackFile) form.append("id_back_page", idBackFile);
                              // other fields
                              form.append("name", selectedUser?.name ?? "");
                              form.append("email", selectedUser?.email ?? "");
                              form.append(
                                "phone",
                                selectedUser?.phonePrimary ?? "",
                              );
                              if (selectedUser?.phoneSecondary)
                                form.append(
                                  "second_number",
                                  selectedUser.phoneSecondary,
                                );
                              if (selectedUser?.nationalId)
                                form.append("id_number", selectedUser.nationalId);
                              if ((selectedUser as any)?.address)
                                form.append(
                                  "address",
                                  (selectedUser as any).address,
                                );
                              if (selectedUser?.businessName)
                                form.append(
                                  "business_name",
                                  selectedUser.businessName,
                                );
                              if (selectedUser?.accountName)
                                form.append(
                                  "account_name",
                                  selectedUser.accountName,
                                );
                              if (selectedUser?.accountNumber)
                                form.append(
                                  "account_number",
                                  selectedUser.accountNumber,
                                );
                              if (selectedUser?.mobileNetwork)
                                form.append(
                                  "mobile_network",
                                  selectedUser.mobileNetwork,
                                );
                              form.append(
                                "preferred_notification_email",
                                selectedUser?.email ?? "",
                              );
                              form.append(
                                "preferred_notification_phone",
                                selectedUser?.phonePrimary ?? "",
                              );

                              // Use PATCH for partial updates including file uploads
                              await apiClient.patch(
                                endpoints.userProfile.userProfile,
                                form,
                              );
                            }
                          } else {
                            // build JSON payload according to UserProfileUpdatePayload
                            // Do NOT include file fields when no File objects are selected —
                            // sending filename/URL strings causes the backend to validate
                            // them as files and return "The submitted data was not a file.".
                            const payload: any = {
                              name: selectedUser?.name,
                              email: selectedUser?.email,
                              phone: selectedUser?.phonePrimary,
                              second_number: selectedUser?.phoneSecondary,
                              id_number: selectedUser?.nationalId,
                              address: (selectedUser as any)?.address,
                              business_name: selectedUser?.businessName,
                              account_name: selectedUser?.accountName,
                              account_number: selectedUser?.accountNumber,
                              mobile_network: selectedUser?.mobileNetwork,
                              preferred_notification_email: selectedUser?.email,
                              preferred_notification_phone:
                                selectedUser?.phonePrimary,
                            };

                            // reuse existing updateProfile when not sending files
                            await updateProfile(payload);
                          }
                          // close edit view on success
                          // setShowEdit(false);
                          toast.success("Profile saved");
                        } catch (err: any) {
                          const msg =
                            err instanceof Error ? err.message : String(err);
                          setSaveError(msg || "Failed to save profile");
                          toast.error(msg || "Failed to save profile");
                        } finally {
                          setIsSaving(false);
                        }
                      }}
                      disabled={isSaving}
                      className={`w-full hover:scale-95 active:scale-100 cursor-pointer transition py-4 rounded-xl text-[1.1rem] mt-6 ${isSaving ? "bg-gray-300 text-gray-500" : "bg-gray-200 text-gray-800"}`}
                    >
                      {isSaving
                        ? "Saving..."
                        : setupProgress === 100
                          ? "Finish"
                          : "Save"}
                    </button>

                    {saveError && (
                      <div className="mt-2 text-bas text-red-600 w-full text-right">
                        An error occurred.
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="md:w-full md:h-20" />
          </div>
        </div>

        {imageModalOpen && imageModalSrc && (
          <div
            className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center p-4"
            onClick={() => setImageModalOpen(false)}
          >
            <div className="max-w-[90vw] max-h-[90vh]">
              <img
                src={imageModalSrc}
                alt={imageModalAlt ?? "Image preview"}
                className="max-w-full max-h-[90vh] rounded-lg object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}

        {accountDeletionRequested && (
          <div className="fixed inset-0 z-30 bg-black/50 flex justify-center items-center ">
            {!deleteConfirmation ? (
              <div className="bg-white flex justify-center items-center flex-col p-10 px-6 gap-10 rounded-xl lg:w-1/2 max-lg:w-fit min-h-1/2 sm:min-h-0 lg:min-h-1/2 mx-4">
                <h2 className="text-lg w-[80%] text-center">
                  <span>Are you sure you want to delete your account?</span>
                  <br />
                  <span className="text-red-600 text-xl font-bold">
                    ⚠️ This action is irreversible.
                  </span>
                </h2>
                <div className="grid grid-cols-2 max-sm:flex max-sm:flex-col gap-4 lg:gap-6 w-4/5">
                  <button
                    onClick={() => setDeleteConfirmation(true)}
                    className="text-base bg-red-600 text-white  hover:bg-red-700 cursor-pointer rounded-lg py-2 px-4 max-sm:py-4 transition"
                  >
                    Yes, Delete My Account
                  </button>
                  <button
                    onClick={() => {
                      setAccountDeletionRequested(false);
                    }}
                    className="text-base cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-lg py-2 px-4 max-sm:py-4 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white flex justify-center items-center flex-col p-10 lg:px-20 gap-10 rounded-xl lg:w-1/2 max-lg:w-fit min-h-1/2 mx-4">
                <h3 className="text-xl font-semibold">
                  Why do you want to delete your account?
                </h3>
                <textarea
                  placeholder="Please provide your reason for deleting your account here."
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded resize-none"
                  rows={4}
                />
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer transition"
                    onClick={() => {
                      setAccountDeletionRequested(false);
                      setDeleteConfirmation(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer transition"
                    onClick={() => {
                      handleDelete();
                      setDeleteConfirmation(false);
                      setAccountDeletionRequested(false);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default EditProfilePage;
