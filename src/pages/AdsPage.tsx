import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import MenuButton from "../components/MenuButton";
import PostAdForm from "../components/PostAdForm";
import {
  useDeleteProduct,
  useMarkProductAsTaken,
  useOwnerProducts,
} from "../features/products/useProducts";
import useUserProfile from "../features/userProfile/useUserProfile";
import { formatMoney } from "../utils/formatMoney";

const AdsPage = () => {
  const [activeTab, setActiveTab] = useState("Active");
  const [selectedAd, setSelectedAd] = useState<null | any>(null);

  const { profile } = useUserProfile();
  const ownerId = profile?.id;

  const { data: products = [] } = useOwnerProducts(ownerId);

  const deleteMutation = useDeleteProduct();
  const markTakenMutation = useMarkProductAsTaken();
  // const setStatusMutation = useSetProductStatus();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAdId, setEditingAdId] = useState<string | null>(null);

  const mapToLabel = (p: any) => {
    if (p.is_taken) return "Taken";
    if (p.status === "ACTIVE") return "Active";
    if (p.status === "PENDING") return "Pending";
    if (p.status === "SUSPENDED") return "Suspended"
    return "Other";
  };

  const filteredAds = products.filter((ad) => mapToLabel(ad) === activeTab);

  return (
    <div className="flex justify-between h-screen w-screen items-center bg-transparent">
      <div className="w-full flex flex-col h-full items-center gap-2 relative">
        <div className="md:bg-white w-full mt-3 px-4 pt-4 rounded-2xl">
          <div className="hidden sm:flex justify-around items-center px-4 max-sm:pb-2">
            {['Active', 'Pending', 'Taken', 'Suspended'].map((status) => (
              <div
                key={status}
                onClick={() => setActiveTab(status)}
                className={`flex items-center gap-2 cursor-pointer border-b-[5px] pb-3 lg:pr-3 transition-colors 
                  ${activeTab === status
                    ? "border-(--dark-def)"
                    : "border-transparent hover:border-gray-300"
                  }`}
              >
                <img
                  src={`/${status.toLowerCase()}.svg`}
                  alt={status}
                  className="w-10 h-auto hidden md:block bg-[#f3f4f6] rounded-full p-2.5"
                />
                <div>
                  <h2>{products.filter((ad) => mapToLabel(ad) === status).length} Ads</h2>
                  <p className="text-xs">{status}</p>
                </div>
              </div>
            ))}
          </div>

          <div className=" sm:hidden fixed top-0 left-0 w-full bg-[#ededed] pt-7 pr-4">
            <div className="flex flex-col items-end md:hidden gap-2">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-3/4 border border-gray-400 rounded-xl p-2 px-3 text-sm focus:outline-none focus:ring-transparent"
              >
                {['Active', 'Pending', 'Taken', 'Suspended'].map((status) => (
                  <option key={status} value={status}>
                    {status} ({products.filter((ad) => mapToLabel(ad) === status).length})
                  </option>
                ))}
              </select>

              <div className="w-full text-center my-2">
                <h2 className="text-lg font-semibold">
                  {products.filter((ad) => mapToLabel(ad) === activeTab).length} Ads
                </h2>
                <p className="text-sm text-gray-500">{activeTab}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-27 sm:mt-0 w-full grid grid-cols-2 px-2 lg:px-0 lg:flex lg:flex-row h-auto lg:flex-wrap gap-2 justify-evenly">
          {filteredAds.length < 1
            ? <div className="text-center col-span-full h-full min-h-[55vh] w-full flex flex-col gap-4 justify-center items-center overflow-hidden">
              <img
                src="/public/nothing-to-show.png"
                alt="Nothing to show here"
                className="h-40 lg:h-50 w-auto"
              />
              <p className="text-xl text-(--dark-def)">No {activeTab} ads to show.</p>
            </div>
            : filteredAds.map((ad) => (
              <div
                key={ad.id}
                className="lg:w-[32%] lg:max-w-[325px] lg:min-w-[185px] bg-white rounded-xl px-2 py-2 shadow-sm flex flex-col relative"
              >
                <div className="flex flex-row justify-between items-center mb-2">
                  <img
                    className="bg-gray-300 h-20 w-auto rounded-lg object-cover min-w-20 max-w-30"
                    src={ad.image || (ad.images?.[0] as any)?.url || (ad.images?.[0] as any)?.src || "/no-image.jpeg"}
                    alt={ad.name}
                  />
                  <button
                    className="inline text-lg font-bold rotate-90 select-none cursor-pointer bg-(--div-active) px-4 rounded-full pb-2 "
                    onClick={() => setSelectedAd(ad)}
                  >
                    ...
                  </button>
                </div>
                <div className="mt-2">
                  <div className="w-4/5">
                    <p onClick={() => console.log(ad)} className="font-medium truncate">{ad.name}</p>
                  </div>
                  <p className="text-xs text-gray-600">
                    {formatMoney(ad.price)}
                    {ad.type?.toUpperCase() === 'RENT' && ' per month'}
                  </p>
                </div>
              </div>
            ))}
          <div className="h-20 w-full" />
        </div>

        {selectedAd && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-4 w-[90%] max-w-[400px] shadow-md relative pt-10">
              <button
                onClick={() => setSelectedAd(null)}
                className="absolute top-0 right-2 text-5xl text-gray-500 rotate-45 block py-2"
              >
                +
              </button>

              {/* Show price preview with rent indicator */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Price shown to users:</p>
                <p className="text-lg font-semibold text-gray-800">
                  {formatMoney(selectedAd.price)}
                  {selectedAd.type?.toUpperCase() === 'RENT' && ' per month'}
                </p>
              </div>

              {mapToLabel(selectedAd) === "Suspended" || mapToLabel(selectedAd) === "Other" ? (
                <div className="flex flex-col gap-3 mt-6">
                  <div className="flex justify-around text-xs">
                    <button
                      className="border border-(--div-border) cursor-pointer px-3.5 py-2 rounded-xl hover:bg-green-200/40"
                      onClick={() => {
                        // Open the post-ad page in "duplicate" mode; saving will create a new ad
                        setSelectedAd(null);
                        navigate(`/postad?duplicate=${selectedAd.id}`);
                      }}
                    >
                      Repost Ad
                    </button>
                    <button
                      className="border border-(--div-border) cursor-pointer px-3.5 py-2 rounded-xl hover:bg-orange-200/40"
                      onClick={() => {
                        // open edit modal instead of navigation
                        setSelectedAd(null);
                        setEditingAdId(String(selectedAd.id));
                        setShowEditModal(true);
                      }}
                    >
                      Edit Details
                    </button>
                    <button
                      className="border border-(--div-border) cursor-pointer px-3.5 py-2 rounded-xl hover:bg-red-200/40"
                      onClick={async () => {
                        try {
                          await deleteMutation.mutateAsync(selectedAd.id);
                          toast.success("Ad deleted");
                          setSelectedAd(null);
                        } catch (err: unknown) {
                          const msg = err instanceof Error ? err.message : String(err);
                          toast.error(msg);
                        }
                      }}
                    >
                      Delete Ad
                    </button>
                  </div>

                  <div className="relative flex items-start gap-2 mt-4">
                    <div className="absolute left-0 -top-4.5 flex items-center gap-3">
                      <div className="bg-red-200/60 rounded-full p-3">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 15 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            opacity="0.5"
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M1.57851 0.606913C1.57851 0.271727 1.22514 0 0.789254 0C0.353365 0 0 0.271727 0 0.606913V16.7913C0 17.1264 0.353365 17.3982 0.789254 17.3982C1.22514 17.3982 1.57851 17.1264 1.57851 16.7913V10.1961V2.10397V0.606913Z"
                            fill="#1C274C"
                          />
                          <path
                            d="M9.00599 2.32544L8.57106 2.19166C6.92646 1.68579 5.12601 1.55868 3.3891 1.82581L1.57837 2.10429V10.1964L3.3891 9.91798C5.12601 9.65086 6.92646 9.77799 8.57106 10.2838C10.3533 10.832 12.3148 10.9344 14.177 10.5764L14.2823 10.5561C14.8991 10.4376 15.1915 9.89451 14.8645 9.47534L13.2222 7.37048C12.8628 6.90993 12.6831 6.67965 12.6405 6.42916C12.6228 6.32467 12.6228 6.21885 12.6405 6.11436C12.6831 5.86387 12.8628 5.63359 13.2222 5.17301L14.5676 3.44866C14.9197 2.99734 14.3865 2.44393 13.7225 2.57159C12.1557 2.87278 10.5055 2.78665 9.00599 2.32544Z"
                            fill="#1C274C"
                          />
                        </svg>
                      </div>
                      <p className=" text-xs text-gray-700 ">Note</p>
                    </div>

                    <p className=" mt-2 ml-2 text-sm text-gray-700 border border-(--div-border) rounded-xl p-2">
                      Your ad does not meet our acceptable ad posting
                      requirements. We kindly advise you to consider the use of
                      words when submitting an ad. Review and submit again.
                      Click{" "}
                      <a
                        href="https://www.oysloe.com/terms"
                        className="text-blue-600 underline"
                      >
                        www.oysloe.com/terms
                      </a>
                      .
                    </p>
                  </div>
                </div>
              ) : mapToLabel(selectedAd) === "Pending" ? (
                <div className="flex flex-col gap-3 mt-6 font-medium">
                  <div className="flex gap-2 sm:gap-1 flex-col sm:flex-row justify-around text-xs">
                    <button
                      className="border border-(--div-border) cursor-pointer px-3.5 py-4 sm:py-2 rounded-xl hover:bg-orange-200/40"
                      onClick={() => {
                        // open edit modal instead of navigation
                        setSelectedAd(null);
                        setEditingAdId(String(selectedAd.id));
                        setShowEditModal(true);
                      }}
                    >
                      Edit Details
                    </button>
                    <button
                      className="border border-(--div-border) cursor-pointer px-3.5 py-4 sm:py-2 rounded-xl hover:bg-red-200/40"
                      onClick={async () => {
                        try {
                          await deleteMutation.mutateAsync(selectedAd.id);
                          toast.success("Ad deleted");
                          setSelectedAd(null);
                        } catch (err: unknown) {
                          const msg = err instanceof Error ? err.message : String(err);
                          toast.error(msg);
                        }
                      }}
                    >
                      Delete Ad
                    </button>
                  </div>
                </div>
              ) : mapToLabel(selectedAd) === "Active" ? (
                <div className="flex flex-col gap-3 mt-6 font-medium">
                  <div className="flex gap-2 sm:gap-1 flex-col sm:flex-row justify-around text-xs">
                    <button
                      className="border border-(--div-border) cursor-pointer px-3.5 py-4 sm:py-2 rounded-xl hover:bg-green-200/40"
                      onClick={async () => {
                        try {
                          await markTakenMutation.mutateAsync({ id: selectedAd.id });
                          toast.success("Marked as taken");
                          setSelectedAd(null);
                        } catch (err: unknown) {
                          const msg = err instanceof Error ? err.message : String(err);
                          toast.error(msg);
                        }
                      }}
                    >
                      Mark as Taken
                    </button>
                    <button
                      className="border border-(--div-border) cursor-pointer px-3.5 py-2 rounded-xl hover:bg-orange-200/40"
                      onClick={() => {
                        setSelectedAd(null);
                        setEditingAdId(String(selectedAd.id));
                        setShowEditModal(true);
                      }}
                    >
                      Edit Details
                    </button>
                    <button
                      className="border border-(--div-border) cursor-pointer px-3.5 py-4 sm:py-2 rounded-xl hover:bg-red-200/40"
                      onClick={async () => {
                        try {
                          await deleteMutation.mutateAsync(selectedAd.id);
                          toast.success("Ad deleted");
                          setSelectedAd(null);
                        } catch (err: unknown) {
                          const msg = err instanceof Error ? err.message : String(err);
                          toast.error(msg);
                        }
                      }}
                    >
                      Delete Ad
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 mt-6 font-medium">
                  <div className="flex gap-2 sm:gap-1 flex-col sm:flex-row justify-around text-xs">
                    <button
                      className="border border-(--div-border) cursor-pointer px-3.5 py-2 rounded-xl hover:bg-green-200/40"
                      onClick={() => {
                        setSelectedAd(null);
                        navigate(`/postad?duplicate=${selectedAd.id}`);
                      }}
                    >
                      Repost Ad
                    </button>
                    <button
                      className="border border-(--div-border) cursor-pointer px-3.5 py-2 rounded-xl hover:bg-orange-200/40"
                      onClick={() => {
                        setSelectedAd(null);
                        setEditingAdId(String(selectedAd.id));
                        setShowEditModal(true);
                      }}
                    >
                      Edit Details
                    </button>
                    <button
                      className="border border-(--div-border) cursor-pointer px-3.5 py-4 sm:py-2 rounded-xl hover:bg-red-200/40"
                      onClick={async () => {
                        try {
                          await deleteMutation.mutateAsync(selectedAd.id);
                          toast.success("Ad deleted");
                          setSelectedAd(null);
                        } catch (err: unknown) {
                          const msg = err instanceof Error ? err.message : String(err);
                          toast.error(msg);
                        }
                      }}
                    >
                      Delete Ad
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="relative bg-transparent rounded-xl w-[90%] max-sm:w-screen max-w-[85vw] h-fit overflow-auto no-scrollbar">
            <button
              onClick={() => { setShowEditModal(false); setEditingAdId(null); }}
              className="fixed top-0 right-3 text-6xl text-white max-sm:text-(--dark-def) z-50 rotate-45"
            >
              +
            </button>
            {/* <p className="sticky top-0 right-2 bg-white font-semibold pl-8 pt-4 -mb-6 pb-2">Edit Ad</p> */}
            <PostAdForm editId={editingAdId ?? null} onClose={() => { setShowEditModal(false); setEditingAdId(null); }} embedded />
          </div>
        </div>
      )}
      <MenuButton />
    </div>
  );
};

export default AdsPage;
