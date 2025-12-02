import { Camera, PlusIcon, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import mailGif from "../assets/mail.gif";
import useUserProfile from "../features/userProfile/useUserProfile";
import { apiClient } from "../services/apiClient";
import { endpoints } from "../services/endpoints";
import { buildMediaUrl } from "../services/media";
import useAccountDeleteRequest from "../features/accountDelete/useAccountDeleteRequest";

const EditProfilePage = () => {
  const [closeProgress, setCloseProgress] = useState(true);
  const [openVerificationModal, setOpenVerificationModal] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
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
  // removed ID front/back placeholders — ID pages are no longer collected here

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
      if (val.includes("/assets/")) return val.split("/").pop();
    } catch {
      // ignore
    }
    return val;
  };

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
        `You already have a${data.status === "APPROVED" ? "n " : " "}${data.status.toLowerCase()} delete request.`
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
              </div>
            </div>

            {/* general details */}
            <div className="w-[95%] bg-white p-4 rounded-md">
              <div className="grid grid-cols-3 gap-4 justify-between items-center mb-2 max-w-[650px]">
                <p className="text-sm font-medium whitespace-nowrap">
                  General Details
                </p>
                <div className="flex items-center justify-center">
                  <button
                    className="bg-gray-100 py-1 px-3 w-fit rounded-full text-sm cursor-pointer hover:scale-95 active:scale-105 hover:bg-gray-200  transition"
                    onClick={() => {
                      setIsReadonly(!isReadonly);
                      setIsReadonlyRight(!isReadonlyRight);
                    }}
                  >
                    {isReadonly ? "Edit" : "Preview"}
                  </button>
                </div>
                <button
                  onClick={() => setAccountDeletionRequested(true)}
                  className="text-xs cursor-pointer hover:text-red-700 underline text-red-500 transition"
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
                className="w-full p-2 rounded border border-gray-200 mb-3 text-sm focus:outline-none read-only:cursor-not-allowed read-only:border-transparent read-only:bg-gray-50"
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
                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                value={selectedUser?.email ?? ""}
                onChange={handleInputChange}
                className="w-full p-2 rounded border border-gray-200 mb-3 text-sm focus:outline-none read-only:cursor-not-allowed read-only:border-transparent read-only:bg-gray-50"
              />

              <label className="text-xs text-gray-600">First Number</label>
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
                  {selectedUser?.nationalId ? "Verified" : "Not Verified"}
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

              {setupProgress === 100 ? (
                <>
                  <label>Business Name</label>
                  <input
                    name="businessName"
                    readOnly={isReadonly}
                    value={selectedUser?.businessName ?? ""}
                    onChange={handleInputChange}
                    className="focus:outline-none read-only:cursor-not-allowed read-only:border-transparent read-only:bg-gray-50 w-full p-2 rounded border border-gray-200 mb-3 text-sm"
                  />
                </>
              ) : (
                <div className="py-3 text-sm text-gray-600">
                  Finish the remaining account details to complete your profile.
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

                      await apiClient.put(
                        endpoints.userProfile.userProfile,
                        form,
                      );
                    } else {
                      // build JSON payload according to UserProfileUpdatePayload
                      const payload: any = {
                        name: selectedUser?.name,
                        email: selectedUser?.email,
                        phone: selectedUser?.phonePrimary,
                        address: (selectedUser as any)?.address,
                        // strip local asset paths so backend doesn't try to process them
                        avatar: stripAssetPath(selectedUser?.profileImage),
                        business_logo: stripAssetPath(
                          selectedUser?.businessLogo,
                        ),
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

      {accountDeletionRequested && (
        <div className="fixed inset-0 z-30 bg-black/50 flex justify-center items-center ">

          {!deleteConfirmation ? (
              <div className="bg-white flex justify-center items-center flex-col p-10 px-6 gap-10 rounded-xl lg:w-1/2 max-lg:w-fit min-h-1/2 mx-4">
                <h2 className="text-lg w-[80%] text-center">
                  <span>Are you sure you want to delete your account?</span>
                  <br />
                  <span className="text-red-600 text-xl font-bold">
                    ⚠️ This action is irreversible.
                  </span>
                </h2>
                <div className="grid grid-cols-2 gap-4 lg:gap-6 w-4/5">
                  <button
                    onClick={() => setDeleteConfirmation(true) }               
                    className="text-base bg-red-600 text-white  hover:bg-red-700 cursor-pointer rounded-lg py-2 px-4 transition"
                  >
                    Yes, Delete My Account
                  </button>
                  <button
                    onClick={() => {
                      setAccountDeletionRequested(false);
                    }}
                    className="text-base cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-lg py-2 px-4 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
          ) : (
            <div className="bg-white flex justify-center items-center flex-col p-10 px-20 gap-10 rounded-xl lg:w-1/2 max-lg:w-fit min-h-1/2 mx-4">

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
          )
        }
      </div>
      )}
    </div>
  );
};

export default EditProfilePage;
