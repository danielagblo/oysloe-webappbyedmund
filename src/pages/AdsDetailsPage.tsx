import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import "../App.css";
import AdLoadingOverlay from "../components/AdLoadingOverlay";
import LiveChat from "../components/LiveChat";
import MenuButton from "../components/MenuButton";
import RatingReviews from "../components/RatingsReviews";
import ReportModal from "../components/ReportModal";
import useWsChat from "../features/chat/useWsChat";
import useFavourites from "../features/products/useFavourites";
import {
  productKeys,
  useMarkProductAsTaken,
  useOwnerProducts,
  useProduct,
  useRelatedProducts,
  useReportProduct,
} from "../features/products/useProducts";
import useReviews from "../features/reviews/useReviews";
import { useUserSubscriptions } from "../features/subscriptions/useSubscriptions";
import useUserProfile from "../features/userProfile/useUserProfile";
import type { Message as ChatMessage } from "../services/chatService";
import { resolveChatroomId } from "../services/chatService";
import { likeReview } from "../services/reviewService";
import type { Product } from "../types/Product";
import type { Review } from "../types/Review";
import {
  ActionButtons,
  AdDetails,
  CommentsSection,
  DesktopHeader,
  ImageGallery,
  MobileHeader,
  PictureModal,
  QuickChat,
  SafetyTips,
  SellerAdsModal,
  SellerImageModal,
  SellerInfo,
  SimilarAds,
  TitleAndPrice,
} from "./AdsDetails/components";

const AdsDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = id ? +id : null;
  const navigate = useNavigate();
  const location = useLocation();
  const adDataFromState = location.state?.adData;

  const {
    data: currentAdDataFromQuery,
    isLoading: adLoading,
    error: adError,
  } = useProduct(numericId!);
  const { profile: currentUserProfile } = useUserProfile();
  const { reviews: reviews = [] } = useReviews({ product: numericId ?? undefined });
  const { data: userSubscriptions = [] } = useUserSubscriptions();

  const queryClient = useQueryClient();

  const activeUserSubscription =
    (userSubscriptions as any[]).find((us) => us?.is_active) || null;

  const { sendMessage, addLocalMessage, connectToRoom } = useWsChat();
  const [openLiveChatRoomId, setOpenLiveChatRoomId] = useState<string | null>(null);

  const { data: favourites = [], toggleFavourite } = useFavourites();
  const [isFavourited, setIsFavourited] = useState<boolean>(false);

  const markTaken = useMarkProductAsTaken();

  // Scroll to top when ad details page loads or ad ID changes
  useEffect(() => {
    // Immediate scroll
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Delayed scroll to ensure it happens after any router transitions
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [numericId]);

  useEffect(() => {
    const favFromProduct = Boolean(
      (currentAdDataFromQuery as Product)?.favourited_by_user,
    );
    const favFromList = favourites.some(
      (p) => p.id === currentAdDataFromQuery?.id,
    );
    setIsFavourited(Boolean(favFromProduct || favFromList));
  }, [currentAdDataFromQuery, favourites]);

  const handleToggleFavourite = async () => {
    const pidRaw = currentAdDataFromQuery?.id || adDataFromState?.id || null;
    if (!pidRaw) return;
    const pid = Number(pidRaw);
    if (Number.isNaN(pid)) return;

    if (toggleFavourite.status === "pending") {
      console.debug("handleToggleFavourite: mutation already in-flight", {
        pid,
      });
      return;
    }

    console.debug("handleToggleFavourite: toggling", { pid, at: Date.now() });
    setIsFavourited((s) => !s);

    try {
      if ((toggleFavourite as any).mutateAsync) {
        await (toggleFavourite as any).mutateAsync(pid);
      } else {
        await new Promise((resolve, reject) =>
          toggleFavourite.mutate(pid, { onSuccess: resolve, onError: reject }),
        );
      }
    } catch (err) {
      setIsFavourited((s) => !s);
      console.warn("handleToggleFavourite failed", err);
      toast.error("Failed to toggle favourite");
    } finally {
      try {
        queryClient.invalidateQueries({ queryKey: productKeys.detail(pid) });
      } catch (e) {
        queryClient.invalidateQueries({ queryKey: ["products"] });
      }
    }
  };

  const handleMarkAsTaken = async () => {
    const pidRaw = currentAdDataFromQuery?.id || adDataFromState?.id || numericId;
    if (!pidRaw) return;
    const pid = Number(pidRaw);
    if (Number.isNaN(pid)) return;
    setOpenPanel(null);
    toast.promise(
      Promise.resolve().then(async () => {
        const src =
          currentAdDataFromQuery || adDataFromState || currentAdData || {};
        const payload = {
          pid: src?.pid ?? `pid_${pid}`,
          name: src?.name ?? "",
          image: src?.image ?? src?.images?.[0]?.image ?? "",
          type: src?.type ?? ("SALE" as const),
          status: src?.status ?? ("ACTIVE" as const),
          is_taken: true,
          description: src?.description ?? "",
          price: src?.price ?? 0,
          duration: src?.duration ?? "",
          category: src?.category ?? src?.category_id ?? 0,
        } as Record<string, unknown>;

        if ((markTaken as any).mutateAsync) {
          await (markTaken as any).mutateAsync({ id: pid, body: payload });
        } else {
          await new Promise((resolve, reject) =>
            markTaken.mutate({ id: pid, body: payload }, { onSuccess: resolve, onError: reject }),
          );
        }
        try {
          queryClient.invalidateQueries({ queryKey: productKeys.detail(pid) });
        } catch (e) {
          queryClient.invalidateQueries({ queryKey: ["products"] });
        }
      }),
      {
        loading: "Sending alert to owner to mark ad as taken...",
        success: "Alert sent to owner to mark ad as taken!",
        error: "Failed to send alert to owner to mark ad as taken",
      },
    );
  };

  const handleReportAd = () => {
    const pid = currentAdDataFromQuery?.id || adDataFromState?.id || numericId;
    if (!pid) return;
    setOpenPanel(null);
    setIsReportModalOpen(true);
    setOpenPanel("report");
  };

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportMessage, setReportMessage] = useState("");

  const submitReport = async () => {
    const pidRaw = currentAdDataFromQuery?.id || adDataFromState?.id || numericId;
    if (!pidRaw) return;
    const pid = Number(pidRaw);
    if (Number.isNaN(pid)) return;

    const src =
      currentAdDataFromQuery || adDataFromState || currentAdData || {};
    const payload = {
      pid: src?.pid ?? `pid_${pid}`,
      name: src?.name ?? "",
      image: src?.image ?? src?.images?.[0]?.image ?? "",
      type: src?.type ?? ("SALE" as const),
      status: src?.status ?? ("ACTIVE" as const),
      is_taken: Boolean(src?.is_taken),
      description: src?.description ?? "",
      price: src?.price ?? 0,
      duration: src?.duration ?? "",
      category: src?.category ?? src?.category_id ?? 0,
      message: reportMessage,
    } as Record<string, unknown>;

    try {
      const mutatePromise = (reportProduct as any).mutateAsync
        ? (reportProduct as any).mutateAsync({ id: pid, body: payload })
        : new Promise((resolve, reject) => {
          reportProduct.mutate(
            { id: pid, body: payload },
            { onSuccess: resolve, onError: reject },
          );
        });

      await toast.promise(mutatePromise, {
        loading: "Reporting ad...",
        success: "Ad reported successfully!",
        error: "Failed to report ad",
      });

      setIsReportModalOpen(false);
      setReportMessage("");
      try {
        queryClient.invalidateQueries({ queryKey: productKeys.detail(pid) });
      } catch (e) {
        queryClient.invalidateQueries({ queryKey: ["products"] });
      }
      setOpenPanel(null);
    } catch (err) {
      console.warn("submitReport failed", err);
    }
  };

  const ownerIdCandidate =
    adDataFromState?.owner?.id ??
    currentAdDataFromQuery?.owner?.id ??
    undefined;

  const ownerProductsQuery = useOwnerProducts(
    ownerIdCandidate as number | undefined,
  );
  const sellerProducts = ownerProductsQuery.data ?? [];

  const { data: relatedProducts = [] } = useRelatedProducts(
    numericId ?? undefined,
  );
  const reportProduct = useReportProduct();
  const likeMutation = useMutation({
    mutationFn: async ({ id, body }: { id: number; body?: any }) =>
      likeReview(id, body),
    onMutate: async ({ id }) => {
      const queryKey = ["reviews", { product: numericId }];
      const previousReviews = queryClient.getQueryData(queryKey) as Review[] | undefined;

      if (previousReviews) {
        const updated = previousReviews.map((review: Review) => {
          if (review.id !== id) return review;
          const wasLiked = Boolean(review.liked);
          const likes = typeof review.likes_count === "number" ? review.likes_count : 0;
          return {
            ...review,
            liked: !wasLiked,
            likes_count: wasLiked ? Math.max(0, likes - 1) : likes + 1,
          } as Review;
        });
        queryClient.setQueryData(queryKey, updated);
      }

      return { previousReviews };
    },
    onSuccess: async (data: any, variables: any) => {
      const revId = data?.id ?? variables?.id;
      const prodId = data?.product?.id ?? numericId;
      const reviewsKey = ["reviews", { product: prodId }];

      if (revId != null) {
        queryClient.setQueryData(["review", revId], { ...(data || {}), id: revId });
      }

      const allReviews = queryClient.getQueryData(reviewsKey) as Review[] | undefined;
      if (allReviews) {
        const updated = allReviews.map((review: Review) =>
          review.id === revId ? { ...review, ...(data || {}), id: revId } : review,
        );
        queryClient.setQueryData(reviewsKey, updated);
      }

      toast.success((data && data.liked) ? "Review liked!" : "Review unliked!");
    },
    onError: (err: unknown, context: any) => {
      const queryKey = ["reviews", { product: numericId }];
      if (context?.previousReviews) {
        queryClient.setQueryData(queryKey, context.previousReviews);
      } else {
        queryClient.invalidateQueries({ queryKey });
      }

      const message = err instanceof Error ? err.message : "Failed to like review";
      toast.error(message);
    },
  });

  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [quickChatInput, setQuickChatInput] = useState("");
  const [isSellerAdsModalOpen, setIsSellerAdsModalOpen] = useState(false);

  const thisProductsReviews = useMemo(() => {
    if (!reviews || reviews.length === 0) return [];
    return reviews.filter((review) => review?.product?.id === numericId);
  }, [reviews, numericId]);

  const reviewDeconstruction = useMemo(() => {
    return thisProductsReviews.reduce(
      (acc, p) => {
        const star = Math.round(p.rating) as 5 | 4 | 3 | 2 | 1;
        return {
          sum: acc.sum + p.rating,
          count: acc.count + 1,
          avg: (acc.sum + p.rating) / (acc.count + 1),
          stars: {
            ...acc.stars,
            [star]: (acc.stars[star] || 0) + 1,
          },
        };
      },
      {
        sum: 0,
        count: 0,
        avg: 0,
        stars: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      },
    );
  }, [thisProductsReviews]);

  const touchStartX = useRef<number | null>(null);
  const galleryScrollRef = useRef<HTMLDivElement | null>(null);
  const sellerCarouselRef = useRef<HTMLDivElement | null>(null);

  const [galleryIndex, setGalleryIndex] = useState<number>(0);
  useEffect(() => {
    setGalleryIndex(0);
  }, [id]);

  const [isPictureModalOpen, setIsPictureModalOpen] = useState<boolean>(false);
  const [pictureModalIndex, setPictureModalIndex] = useState<number>(0);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState<boolean>(false);
  const [sellerModalImage, setSellerModalImage] = useState<string | null>(null);
  useEffect(() => {
    if (!isPictureModalOpen) {
      setGalleryIndex(pictureModalIndex);
    }
  }, [isPictureModalOpen, pictureModalIndex]);

  useEffect(() => {
    if (!isPictureModalOpen) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") setIsPictureModalOpen(false);
      if (ev.key === "ArrowLeft")
        setPictureModalIndex((i) => Math.max(0, i - 1));
      if (ev.key === "ArrowRight") setPictureModalIndex((i) => i + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPictureModalOpen]);

  if (!id || numericId === null)
    return (
      <p className="h-screen w-screen m-0 flex items-center justify-center">
        Invalid ad ID
      </p>
    );
  if (adError)
    return (
      <p className="h-screen w-screen m-0 flex flex-col items-center justify-center">
        <span className="text-8xl font-bold text-gray-400 animate-pulse">
          404
        </span>
        <span>There was an error loading this ad</span>
        <span className="text-3xl">(ಥ‿ಥ)</span>
      </p>
    );

  const currentAdData =
    currentAdDataFromQuery != null ? currentAdDataFromQuery : adDataFromState;
  const subscriptionMultiplierRaw =
    (currentAdData as any)?.multiplier ??
    activeUserSubscription?.subscription?.multiplier ??
    null;
  const multiplierLabel = (() => {
    if (subscriptionMultiplierRaw == null) return null;
    const n = Number(subscriptionMultiplierRaw);
    if (!Number.isNaN(n)) return `${n}x`;
    return String(subscriptionMultiplierRaw);
  })();
  const pageImages: string[] = (() => {
    const mainImage = (currentAdData as any)?.image;
    const imgsRaw = (currentAdData as any)?.images;

    const addFromArray = (arr: any[]) =>
      arr
        .map((it: any) =>
          typeof it === "string" ? it : (it?.image ?? it?.url ?? null),
        )
        .filter(Boolean) as string[];

    let list: string[] = [];
    if (mainImage) list.push(mainImage);

    if (Array.isArray(imgsRaw) && imgsRaw.length > 0) {
      list = list.concat(addFromArray(imgsRaw));
    } else if (imgsRaw && typeof imgsRaw === "object") {
      const maybeArr = imgsRaw.results ?? imgsRaw.data ?? null;
      if (Array.isArray(maybeArr)) {
        list = list.concat(addFromArray(maybeArr));
      } else {
        const vals = (Object.values(imgsRaw) as any).flat?.() ?? Object.values(imgsRaw);
        if (Array.isArray(vals) && vals.length > 0) {
          list = list.concat(addFromArray(vals as any[]));
        }
      }
    }

    if (list.length === 0 && mainImage) return [mainImage];

    const deduped = Array.from(new Set(list.filter(Boolean)));
    return deduped.length > 0 ? deduped : [];
  })();

  const imageCount = pageImages.length;

  const owner =
    currentAdData?.owner ||
    currentAdDataFromQuery?.owner ||
    adDataFromState?.owner;
  const callerNumber1: string | null =
    owner?.phone || owner?.phone_number || owner?.primary_phone || null;
  const callerNumber2: string | null =
    owner?.second_number ||
    owner?.phone2 ||
    owner?.secondary_phone ||
    owner?.alt_phone ||
    null;
  const toggleCaller1 = () =>
    setOpenPanel((p) => (p === "caller1" ? null : "caller1"));
  const toggleCaller2 = () =>
    setOpenPanel((p) => (p === "caller2" ? null : "caller2"));

  const openChatWithOwnerAndSend = async (text: string) => {
    if (!owner?.id) {
      toast.error("Unable to start chat: seller information not available");
      return;
    }

    try {
      // Ask the API for the chatroom id by email (GET /chatroomid/?email=...), which returns existing room or creates one
      let roomKey: string | null = null;
      try {
        const res = await resolveChatroomId({ email: owner.email } as any);
        const roomKeyRaw = (res as any)?.room_id ?? (res as any)?.room ?? (res as any)?.id ?? null;
        roomKey = roomKeyRaw != null ? String(roomKeyRaw) : null;
      } catch (resolveErr) {
        console.debug("resolveChatroomId by email failed; will try creating room via REST", resolveErr);
        roomKey = null;
      }

      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const tempMsg: Partial<ChatMessage> = {
        room: roomKey as any,
        sender: {
          id: currentUserProfile?.id ?? 0,
          name: currentUserProfile?.name ?? "You",
          avatar: (currentUserProfile as any)?.avatar ?? null,
        } as any,
        content: text,
        created_at: new Date().toISOString(),
        is_read: false,
      };
      (tempMsg as unknown as Record<string, unknown>).__temp_id = tempId;
      (tempMsg as unknown as Record<string, unknown>).__optimistic = true;

      try {
        // Ensure websocket room client is connected where possible so sendMessage uses WS (wss/chat/<room>)
        if (roomKey) {
          try {
            await connectToRoom(roomKey);
          } catch (e) {
            console.debug("connectToRoom failed, will still attempt send", e);
          }
        }
        const targetRoom = roomKey ?? `temp_${owner?.email ?? "anon"}`;
        addLocalMessage(String(targetRoom), tempMsg as ChatMessage);

        // Always prefer websocket for sending messages (persistent rooms use wss/chat/<id>/)
        if (roomKey) {
          try {
            await connectToRoom(roomKey);
          } catch (e) {
            console.debug("connectToRoom failed for persistent room", e);
          }
          try {
            await sendMessage(String(roomKey), text, tempId);
            // Open in-page chat for persistent rooms
            setOpenLiveChatRoomId(String(roomKey));
          } catch (err) {
            console.warn("AdsDetailsPage: sendMessage via websocket failed for persistent room", err);
            toast.error("Failed to send message via websocket");
          }
        } else {
          try {
            await sendMessage(String(targetRoom), text, tempId);
          } catch (err) {
            console.warn("AdsDetailsPage: sendMessage via websocket failed for temp room", err);
            toast.error("Failed to send message via websocket");
          }
        }
      } catch (err) {
        console.warn("AdsDetailsPage: addLocalMessage/send flow failed", err);
      }

      // Do not redirect to inbox — stay on the ad details page after sending
      // navigate("/inbox", { state: { openRoom: String(roomKey) } });
    } catch (err) {
      console.warn("AdsDetailsPage: createChatRoom/send failed", err);
      toast.error("Failed to start chat. Please try again.");
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setGalleryIndex((idx) => (idx + 1) % imageCount);
      } else {
        setGalleryIndex((idx) => (idx - 1 + imageCount) % imageCount);
      }
      touchStartX.current = null;
    }
  };

  return (
    <div className="lg:pt-5">
      <AdLoadingOverlay isVisible={adLoading} />
      <SellerAdsModal
        isSellerAdsModalOpen={isSellerAdsModalOpen}
        sellerProducts={sellerProducts}
        setIsSellerAdsModalOpen={setIsSellerAdsModalOpen}
        currentAdData={currentAdData}
        owner={owner}
      />
      <div
        style={{ color: "var(--dark-def)" }}
        className="flex flex-col items-center w-full sm:w-full min-h-screen px-0 max-sm:pt-10 sm:px-12 gap-6 sm:gap-2 bg-(--div-active) sm:bg-white"
      >
        <MobileHeader
          imageCount={imageCount}
          galleryIndex={galleryIndex}
          multiplierLabel={multiplierLabel}
          totalReports={currentAdData?.total_reports ?? null}
          totalFavourites={currentAdData?.total_favourites ?? null}
          onBack={() => navigate(-1)}
        />
        <DesktopHeader
          currentAdData={currentAdData}
          multiplierLabel={multiplierLabel}
          imageCount={imageCount}
          galleryIndex={galleryIndex}
        />

        <div className="w-full">
          <ImageGallery
            images={pageImages}
            currentIndex={galleryIndex}
            imageCount={imageCount}
            galleryScrollRef={galleryScrollRef}
            onSetCurrentIndex={setGalleryIndex}
            onSetPictureModalIndex={setPictureModalIndex}
            onOpenPictureModal={() => setIsPictureModalOpen(true)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />
          <PictureModal
            pageImages={pageImages}
            isPictureModalOpen={isPictureModalOpen}
            pictureModalIndex={pictureModalIndex}
            setPictureModalIndex={setPictureModalIndex}
            setIsPictureModalOpen={setIsPictureModalOpen}
            setGalleryIndex={setGalleryIndex}
          />
          <SellerImageModal
            isSellerModalOpen={isSellerModalOpen}
            sellerModalImage={sellerModalImage}
            setIsSellerModalOpen={setIsSellerModalOpen}
          />
          <ReportModal
            isOpen={isReportModalOpen}
            message={reportMessage}
            setMessage={setReportMessage}
            onClose={() => {
              setIsReportModalOpen(false);
              setReportMessage("");
              setOpenPanel(null);
            }}
            onSubmit={submitReport}
          />
          <TitleAndPrice
            currentAdData={currentAdData}
            currentAdDataFromQuery={currentAdDataFromQuery}
            id={id}
          />

          <div className="sm:pr-6">
            {currentAdData?.description && (
              <div className="bg-white sm:bg-(--div-active) my-4 sm:p-6 rounded-2xl py-3 px-4 w-full">
                <h2 className="text-xl md:text-[1.75vw] font-bold mb-2">Description</h2>
                <p className="text-sm md:text-[1.125vw] text-gray-700 whitespace-pre-line">
                  {String(currentAdData.description)}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 w-full">
            <div className="flex justify-evenly gap-4 flex-col md:px-4 lg:px-0 ad-details-page">
              <div className="sm:hidden flex w-full justify-between ad-details-page">
                <div className="flex flex-col space-y-6 w-fit px-4 md:w-1/2 mb-6 md:min-h-[250px] pt-7">
                  <AdDetails
                    id={id}
                    currentAdDataFromQuery={currentAdDataFromQuery}
                    currentAdData={currentAdData}
                  />
                </div>
                <div className="flex flex-col space-y-6 w-full md:w-1/2 pt-10">
                  <SafetyTips />
                </div>
              </div>
              <div className="sm:hidden flex w-full ad-details-page">
                <div className="flex flex-col w-fit space-y-6 md:w-1/2  bg-white p-6 rounded-lg mb-5">
                  <ActionButtons
                    currentAdData={currentAdData}
                    currentAdDataFromQuery={currentAdDataFromQuery}
                    onMarkTaken={handleMarkAsTaken}
                    onFavorite={handleToggleFavourite}
                    onReportAd={handleReportAd}
                    isFavourited={isFavourited}
                    favouritePending={toggleFavourite.status === "pending"}
                    caller1={callerNumber1}
                    caller2={callerNumber2}
                    showCaller1={openPanel === "caller1"}
                    showCaller2={openPanel === "caller2"}
                    toggleCaller1={toggleCaller1}
                    toggleCaller2={toggleCaller2}
                    showOffer={openPanel === "makeOffer"}
                    toggleOffer={() => setOpenPanel((p) => (p === "makeOffer" ? null : "makeOffer"))}
                    openChatWithOwnerAndSend={openChatWithOwnerAndSend}
                    setOpenPanel={setOpenPanel}
                  />
                  <QuickChat
                    quickChatInput={quickChatInput}
                    setQuickChatInput={setQuickChatInput}
                    openChatWithOwnerAndSend={openChatWithOwnerAndSend}
                  />
                </div>
                <div className="bg-white rounded-lg w-full">
                  <SellerInfo
                    owner={owner}
                    currentAdData={currentAdData}
                    sellerProducts={sellerProducts}
                    setSellerModalImage={setSellerModalImage}
                    setIsSellerModalOpen={setIsSellerModalOpen}
                    sellerCarouselRef={sellerCarouselRef}
                    navigate={navigate}
                    setIsSellerAdsModalOpen={setIsSellerAdsModalOpen}
                  />
                  <div className="hidden md:block">
                    <RatingReviews layout="row" />
                  </div>
                  <div className="md:hidden">
                    <RatingReviews layout="row" fullWidth rd={reviewDeconstruction} />
                  </div>
                </div>

                <div className="bg-white mt-6 p-6 rounded-lg w-full">
                  <CommentsSection
                    thisProductsReviews={thisProductsReviews}
                    navigate={navigate}
                    currentAdData={currentAdData}
                    numericId={numericId}
                    likeMutation={likeMutation}
                  />
                </div>
              </div>

              <div className="hidden sm:flex w-full justify-between ad-details-page">
                <div className="flex flex-col space-y-6 w-fit md:w-1/2 mb-6 md:min-h-[250px]">
                  <AdDetails
                    id={id}
                    currentAdDataFromQuery={currentAdDataFromQuery}
                    currentAdData={currentAdData}
                  />
                  <div className="flex flex-col w-full space-y-6 p-6 lg:p-0 mb-5">
                    <RatingReviews layout="row" rd={reviewDeconstruction} />
                    <CommentsSection
                      thisProductsReviews={thisProductsReviews}
                      navigate={navigate}
                      currentAdData={currentAdData}
                      numericId={numericId}
                      likeMutation={likeMutation}
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-6 w-full md:w-1/2">
                  <SafetyTips />
                  <div className="p-6 rounded-lg w-full">
                    <div className="sm:bg-(--div-active) w-full p-3 rounded-2xl">
                      <ActionButtons
                        currentAdData={currentAdData}
                        currentAdDataFromQuery={currentAdDataFromQuery}
                        onMarkTaken={handleMarkAsTaken}
                        onFavorite={handleToggleFavourite}
                        onReportAd={handleReportAd}
                        isFavourited={isFavourited}
                        favouritePending={toggleFavourite.status === "pending"}
                        caller1={callerNumber1}
                        caller2={callerNumber2}
                        showCaller1={openPanel === "caller1"}
                        showCaller2={openPanel === "caller2"}
                        toggleCaller1={toggleCaller1}
                        toggleCaller2={toggleCaller2}
                        showOffer={openPanel === "makeOffer"}
                        toggleOffer={() => setOpenPanel((p) => (p === "makeOffer" ? null : "makeOffer"))}
                        openChatWithOwnerAndSend={openChatWithOwnerAndSend}
                        setOpenPanel={setOpenPanel}
                      />
                      <QuickChat
                        quickChatInput={quickChatInput}
                        setQuickChatInput={setQuickChatInput}
                        openChatWithOwnerAndSend={openChatWithOwnerAndSend}
                      />
                    </div>
                    <SellerInfo
                      owner={owner}
                      currentAdData={currentAdData}
                      sellerProducts={sellerProducts}
                      setSellerModalImage={setSellerModalImage}
                      setIsSellerModalOpen={setIsSellerModalOpen}
                      sellerCarouselRef={sellerCarouselRef}
                      navigate={navigate}
                      setIsSellerAdsModalOpen={setIsSellerAdsModalOpen}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-screen p-0 lg:mt-15">
        <SimilarAds relatedProducts={relatedProducts} />
        <div className="p-8 sm:p-10 bg-(--div-active)" />
      </div>
      {openLiveChatRoomId && (
        <div className="fixed bottom-4 right-4 z-50 w-[360px] h-[480px]">
          <LiveChat caseId={openLiveChatRoomId} onClose={() => setOpenLiveChatRoomId(null)} />
        </div>
      )}
      <MenuButton />
    </div>
  );
};

export default AdsDetailsPage;

