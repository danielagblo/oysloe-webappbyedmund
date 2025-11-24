import { useState } from "react";
import { PlusIcon, X } from "lucide-react";
import mailGif from "../assets/mail.gif";
import { useNavigate } from "react-router-dom";

const EditProfilePage = () => {
  const [closeProgress, setCloseProgress] = useState(true);
  const [openVerificationModal, setOpenVerificationModal] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const setupProgress: number = 100;

  const [selectedUser] = useState({
    profileImage: "",
    businessLogo: "",
    name: "",
    email: "",
    phonePrimary: "",
    phoneSecondary: "",
    nationalId: "",
    idFront: "",
    idBack: "",
    businessName: "",
    accountName: "",
    accountNumber: "",
    mobileNetwork: "",
  });

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

  const navigate = useNavigate();

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
          <div className="bg-white md:shadow-lg h-fit sm:min-h-[92vh] pt-10 md:pt-3 md:pb-12 w-full md:mt-0 flex flex-col justify-start items-center gap-4 px-3 py-3 md:rounded-2xl text-xs">
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
              <div className="flex flex-col items-center gap-2">
                <img
                  src={selectedUser?.profileImage || avatarPlaceholder}
                  alt="Profile"
                  className="w-20 max-w-full h-auto rounded-full object-cover bg-gray-100"
                  onError={(e) => onImgError(e, avatarPlaceholder)}
                />
                <p className="text-xs">Profile Image</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <img
                  src={selectedUser?.businessLogo || logoPlaceholder}
                  alt="Business Logo"
                  className="w-20 max-w-full h-auto rounded-md object-cover bg-gray-100"
                  onError={(e) => onImgError(e, logoPlaceholder)}
                />
                <p className="text-xs">Business Logo</p>
              </div>
            </div>

            {/* general details */}
            <div className="w-[95%] bg-white p-4 rounded-md">
              <p className="mb-2 text-sm font-medium">General Details</p>

              <label className="text-xs text-gray-600">Name</label>
              <input
                defaultValue={selectedUser?.name}
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
                defaultValue={selectedUser?.email}
                className="w-full p-2 rounded border border-gray-200 mb-3 text-sm"
              />

              <label className="text-xs text-gray-600">First Number</label>
              <input
                defaultValue={selectedUser?.phonePrimary}
                className="w-full p-2 rounded border border-gray-200 mb-3 text-sm"
              />

              <label className="text-xs text-gray-600">Second Number</label>
              <input
                defaultValue={selectedUser?.phoneSecondary || "---"}
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
                defaultValue={selectedUser?.nationalId}
                className="w-full p-2 rounded border border-gray-200 mb-3 text-sm"
              />

              {setupProgress === 100 ? (
                <>
                  <label>Business Name</label>
                  <input
                    defaultValue={selectedUser?.businessName}
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

        {/* RIGHT COLUMN: full width on small screens, half on md+; content grows naturally */}
        <div className="lg:w-1/2 lg:overflow-auto no-scrollbar">
          <div className="bg-white lg:shadow-lg w-full mt-2 md:mt-0 flex flex-col justify-start items-center h-fit sm:min-h-[92vh] gap-4 px-3 py-3 pb-0 md:pb-3 md:rounded-2xl text-xs max-lg:mb-10">
            {!linkSent && (
              <div className="flex flex-col justify-start items-center gap-2 p-4 w-[90%] bg-gray-50 rounded-2xl">
                <p className="text-lg text-center">Please verify your email*</p>
                <p className="mb-3 text-center">
                  We will send an email to agblod27@gmail.com. Click the link in
                  the email to verify your account.
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
              <p className="mt-2 mb-1 text-sm font-medium">Payment Account</p>
              <label className="text-xs text-gray-600">Account Name</label>
              <input
                defaultValue={selectedUser?.accountName}
                className="w-full p-2 rounded border border-gray-200 mb-3 text-sm"
              />

              <label className="text-xs text-gray-600">Account Number</label>
              <input
                defaultValue={selectedUser?.accountNumber || "---"}
                className="w-full p-2 rounded border border-gray-200 mb-3 text-sm"
              />

              <label className="text-xs text-gray-600">Mobile Network</label>
              <input
                defaultValue={selectedUser?.mobileNetwork}
                className="w-full p-2 rounded border border-gray-200 mb-3 text-sm"
              />

              <button className="w-full bg-gray-200 py-4 rounded-xl text-[1.1rem] text-gray-800 mt-6">
                {setupProgress === 100 ? "Finish" : "Save"}
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
