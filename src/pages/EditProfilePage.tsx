import { Camera, PlusIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import mailGif from "../assets/mail.gif";
import useUserProfile from "../features/userProfile/useUserProfile";
import { apiClient } from "../services/apiClient";
import { endpoints } from "../services/endpoints";
import { buildMediaUrl } from "../services/media";

const EditProfilePage = ({ onClose }: { onClose?: () => void }) => {
  const [closeProgress, setCloseProgress] = useState(true);
  const [openVerificationModal, setOpenVerificationModal] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const setupProgress: number = 100;

  // load profile and prefill editable local state
  const { profile, updateProfile } = useUserProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  //readonly toggle - make editable by default when opening edit page
  const [isReadonly, setIsReadonly] = useState<boolean>(true);
  const [isReadonlyRight, setIsReadonlyRight] = useState<boolean>(true);

  const [selectedUser, setSelectedUser] = useState<{
    profileImage?: string;
    businessLogo?: string;
    name?: string;
    email?: string;
    phonePrimary?: string;
    phoneSecondary?: string;
    nationalId?: string;
    idFront?: string;
    idBack?: string;
    businessName?: string;
    accountName?: string;
    accountNumber?: string;
    mobileNetwork?: string;
  }>({});

  useEffect(() => {
    if (profile) {
      setSelectedUser({
        profileImage: profile.avatar || undefined,
        businessLogo: profile.business_logo || undefined,
        name: profile.name || undefined,
        email: profile.email || undefined,
        phonePrimary: profile.phone || undefined,
        phoneSecondary: profile.second_number || undefined,
        nationalId: profile.id_number || undefined,
        idFront: profile.id_front_page || undefined,
        idBack: profile.id_back_page || undefined,
        businessName: profile.business_name || undefined,
        accountName: profile.account_name || undefined,
        accountNumber: profile.account_number || undefined,
        mobileNetwork: profile.mobile_network || undefined,
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedUser((prev) => ({ ...prev, [name]: value }));
  };

  const avatarPlaceholder =
    "https://placehold.co/100x100?text=Avatar&bg=EFEFEF&fg=666";
  const logoPlaceholder =
    "https://placehold.co/100x100?text=Logo&bg=EFEFEF&fg=666";
  const frontPlaceholder =
    "https://placehold.co/500x250?text=Front&bg=EFEFEF&fg=666";
  const backPlaceholder =
    "https://placehold.co/500x250?text=Back&bg=EFEFEF&fg=666";

  const onImgError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    fallback: string = avatarPlaceholder,
  ) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = fallback;
  };

  const stripAssetPath = (val?: string) => {
    if (!val) return val;
    try {
      // If the value is an assets path, return just the filename
      if (val.includes('/assets/')) return val.split('/').pop();
    } catch {
      // ignore
    }
    return val;
  };

  const navigate = useNavigate();

  // hold chosen files to submit to backend directly
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  return (
    <div className="flex justify-between min-h-screen w-screen relative">
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; } /* Chrome, Safari, Opera */
      `}</style>
      <div className="flex flex-col lg:flex-row w-full -mt-4 md:mt-0 min-h-0 max-h-screen max-lg:overflow-auto lg:overflow-hidden hide-scrollbar justify-start gap-2 py-2 md:py-[3.5vh]">
        {/* LEFT COLUMN: full width on small screens, half on md+; no internal scroll */}
        <div className="lg:w-1/2 lg:overflow-auto no-scrollbar">
          <div className="relative bg-white md:shadow-lg h-fit sm:min-h-[92vh] pt-10  md:pb-12 w-full md:mt-0 md:pt-10 flex flex-col justify-start items-center gap-4 px-3 py-3 md:rounded-2xl text-xs">
            {closeProgress && (
              <div className="flex-col gap-2 p-4 w-[90%] max-md:w-full bg-gray-50 rounded-2xl">
                {setupProgress === 100 && (
                  <div className="mt-[-5px] w-full flex justify-end items-center">
                    <button
                      className="p-2 cursor-pointer"
                      onClick={() => setCloseProgress((prev) => !prev)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
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

            {/* profile images area */}
            <div className="flex justify-around items-center w-full p-4 rounded-md">
              <div className="flex flex-col items-center gap-2 relative">
                <img
                  src={
                    buildMediaUrl(selectedUser?.profileImage) ||
                    avatarPlaceholder
                  }
                  alt="Profile"
                  className="w-20 max-w-full h-20 rounded-full object-cover bg-gray-100"
                  onError={(e) => onImgError(e, avatarPlaceholder)}
                />
                <p className="text-xs">Profile Image</p>
                <label
                  htmlFor="avatar-file-input"
                  className="absolute right-1 bottom-5 bg-white rounded-full p-1 shadow z-10 cursor-pointer"
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
                {avatarFile && (
                  <div className="text-[0.7rem] mt-1">Selected</div>
                )}
              </div>
              <div className="flex flex-col items-center gap-2 relative">
                <img
                  src={
                    buildMediaUrl(selectedUser?.businessLogo) || logoPlaceholder
                  }
                  alt="Business Logo"
                  className="w-20 max-w-full h-20 rounded-md object-cover bg-gray-100"
                  onError={(e) => onImgError(e, logoPlaceholder)}
                />
                <p className="text-xs">Business Logo</p>
                <label
                  htmlFor="logo-file-input"
                  className="absolute -right-1 bottom-5 bg-white rounded-full p-1 shadow z-10 cursor-pointer"
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
                {logoFile && <div className="text-[0.7rem] mt-1">Selected</div>}
              </div>
            </div>

            {/* general details */}
            <div className="w-[95%] bg-white p-4 rounded-md">
              <div className="flex gap-6 items-center mb-2">
                <p className="text-sm font-medium">General Details</p>
                <button 
                  className="bg-gray-100 py-1 px-3 rounded-full text-sm cursor-pointer hover:scale-95 active:scale-105 hover:bg-gray-200  transition"
                  onClick={() => {
                    setIsReadonly(!isReadonly);
                    setIsReadonlyRight(!isReadonlyRight);
                  }}
                  className="text-xs text-blue-500 underline"
                >
                  {isReadonly ? "Edit" : "Preview"}
                </button>
                <button 
                  className="bg-gray-100 py-1 px-3 rounded-full text-sm cursor-pointer hover:scale-95 active:scale-105 hover:bg-gray-200  transition"
                  onClick={() => {
                    setIsReadonly(!isReadonly);
                    setIsReadonlyRight(!isReadonlyRight);
                  }}
                  className="text-xs hover:text-red-700 underline text-red-500 transition"
                  title="This is IRREVERSIBLE"
                >
                  Request Account Deletion
                </button>
              </div>
              <label className="text-xs text-gray-600">Name</label>
              <input
                name="name"
                readOnly={isReadonly}
                value={selectedUser?.name ?? ""}
                onChange={handleInputChange}
                className="w-full p-2 rounded border border-gray-200 mb-3 text-sm"
              />

              <div className="flex items-center">
                <label className="text-xs text-gray-600">Email</label>
                &nbsp;
                <p className="mb-1 text-xs inline text-white bg-blue-400 px-1 py-0.5 text-[0.6rem] rounded-2xl">
                  {selectedUser?.email ? "Verified" : "Unverified"}
                </p>
              </div>
              <input
                name="email"
                readOnly={isReadonly}
                value={selectedUser?.email ?? ""}
                onChange={handleInputChange}
                className="w-full p-2 rounded border border-gray-200 mb-3 text-sm"
              />

              <label className="text-xs text-gray-600">First Number</label>
              <input
                name="phonePrimary"
                readOnly={isReadonly}
                value={selectedUser?.phonePrimary ?? ""}
                onChange={handleInputChange}
                className="w-full p-2 rounded border border-gray-200 mb-3 text-sm"
              />

              <label className="text-xs text-gray-600">Second Number</label>
              <input
                name="phoneSecondary"
                readOnly={isReadonly}
                value={selectedUser?.phoneSecondary ?? ""}
                onChange={handleInputChange}
                className="w-full p-2 rounded border border-gray-200 mb-3 text-sm"
              />

              <div className="flex items-center">
                <label className="text-xs text-gray-600">National ID</label>
                &nbsp;
                <p className="mb-1 inline text-xs text-white bg-blue-400 px-1 py-0.5 text-[0.6rem] rounded-2xl">
                  {selectedUser?.nationalId ? "Verified" : "Not Verified"}
                </p>
              </div>
              <input
                name="nationalId"
                readOnly={isReadonly}
                value={selectedUser?.nationalId ?? ""}
                onChange={handleInputChange}
                className="w-full p-2 rounded border border-gray-200 mb-3 text-sm"
              />

              {setupProgress === 100 ? (
                <>
                  <label>Business Name</label>
                  <input
                    name="businessName"
                    readOnly={isReadonly}
                    value={selectedUser?.businessName ?? ""}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded border border-gray-200 mb-3 text-sm"
                  />
                </>
              ) : (
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex flex-col justify-start items-center gap-2 w-full sm:w-1/2">
                    <p>Front</p>
                    <img
                      src={frontPlaceholder}
                      className="w-full max-w-full h-auto rounded-md object-cover bg-gray-100"
                      onError={(e) => onImgError(e, frontPlaceholder)}
                    />
                  </div>
                  <div className="flex flex-col justify-start items-center gap-2 w-full sm:w-1/2">
                    <p>Back</p>
                    <img
                      src={backPlaceholder}
                      className="w-full max-w-full h-auto rounded-md object-cover bg-gray-100"
                      onError={(e) => onImgError(e, backPlaceholder)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* business details */}
        <div className="lg:w-1/2 lg:overflow-auto no-scrollbar">
          <div className="bg-white lg:shadow-lg w-full mt-2 md:mt-0 flex flex-col justify-start items-center h-fit sm:min-h-[92vh] gap-4 px-3 py-3 pb-0 md:pb-3 md:rounded-2xl text-xs max-lg:mb-10">
            {!linkSent && (
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
            )}

            <div className="w-[95%] bg-white p-4 rounded-md">
              <div className="flex gap-6 items-center my-2">
                <p className="text-sm font-medium">Payment Account</p>
              </div>
              <label className="text-xs text-gray-600">Account Name</label>
              <input
                name="accountName"
                readOnly={isReadonlyRight}
                value={selectedUser?.accountName ?? ""}
                onChange={handleInputChange}
                className="w-full p-2 rounded border border-gray-200 mb-3 text-sm"
              />

              <label className="text-xs text-gray-600">Account Number</label>
              <input
                name="accountNumber"
                readOnly={isReadonlyRight}
                value={selectedUser?.accountNumber ?? ""}
                onChange={handleInputChange}
                className="w-full p-2 rounded border border-gray-200 mb-3 text-sm"
              />

              <label className="text-xs text-gray-600">Mobile Network</label>
              <input
                name="mobileNetwork"
                readOnly={isReadonlyRight}
                value={selectedUser?.mobileNetwork ?? ""}
                onChange={handleInputChange}
                className="w-full p-2 rounded border border-gray-200 mb-3 text-sm"
              />

              {saveError && (
                <div className="mb-2 text-sm text-red-600">{saveError}</div>
              )}
              <button
                onClick={async () => {
                  setSaveError(null);
                  setIsSaving(true);
                  try {
                    // If files were selected, send multipart/form-data to backend
                    if (avatarFile || logoFile) {
                      const form = new FormData();
                      if (avatarFile) form.append("avatar", avatarFile);
                      if (logoFile) form.append("business_logo", logoFile);
                      // other fields
                      form.append("name", selectedUser?.name ?? "");
                      form.append("email", selectedUser?.email ?? "");
                      form.append("phone", selectedUser?.phonePrimary ?? "");
                      if ((selectedUser as any)?.address)
                        form.append("address", (selectedUser as any).address);
                      if (selectedUser?.businessName)
                        form.append("business_name", selectedUser.businessName);
                      if (selectedUser?.accountName)
                        form.append("account_name", selectedUser.accountName);
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

                      await apiClient.patch(endpoints.userProfile.userProfile, form);
                    } else {
                      // build JSON payload according to UserProfileUpdatePayload
                      const payload: any = {
                        name: selectedUser?.name,
                        email: selectedUser?.email,
                        phone: selectedUser?.phonePrimary,
                        address: (selectedUser as any)?.address,
                        // strip local asset paths so backend doesn't try to process them
                        avatar: stripAssetPath(selectedUser?.profileImage),
                        business_logo: stripAssetPath(selectedUser?.businessLogo),
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
                    toast.success('Profile saved');
                  } catch (err: any) {
                    const msg = err instanceof Error ? err.message : String(err);
                    setSaveError(msg || 'Failed to save profile');
                    toast.error(msg || 'Failed to save profile');
                  } finally {
                    setIsSaving(false);
                  }
                }}
                disabled={isSaving}
                className={`w-full py-4 rounded-xl text-[1.1rem] mt-6 ${isSaving ? "bg-gray-300 text-gray-500" : "bg-gray-200 text-gray-800"}`}
              >
                {isSaving
                  ? "Saving..."
                  : setupProgress === 100
                    ? "Finish"
                    : "Save"}
              </button>
            </div>
          </div>
          <div className="md:w-full md:h-20" />
        </div>
      </div>

      {openVerificationModal && (
        <div className="fixed inset-0 z-30 backdrop-blur-sm bg-black/50 flex justify-center items-center ">
          <div className="bg-white flex justify-center items-center flex-col p-4 px-10 gap-4 rounded-3xl max-w-md w-full mx-4">
            <img src={mailGif} alt="Mail animation" className="w-32 h-auto" />
            <h2 className="text-xl w-[80%] text-center">
              Verification link has been sent
            </h2>
            <button
              onClick={() => {
                setOpenVerificationModal(false);
                setLinkSent(true);
              }}
              className="text-sm border-2 cursor-pointer border-gray-300 rounded-full py-1.5 px-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfilePage;
